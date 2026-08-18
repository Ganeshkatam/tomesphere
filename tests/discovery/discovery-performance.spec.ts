import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Discovery Performance Baseline', () => {
  test('Capture LCP, CLS and network metrics', async ({ page }) => {
    let initialRequestCount = 0;
    let initialTransferredBytes = 0;
    let imageRequestCount = 0;
    let imageTransferredBytes = 0;
    let jsTransferredBytes = 0;

    page.on('response', async response => {
      // Exclude data URLs
      if (response.url().startsWith('data:')) return;
      
      initialRequestCount++;
      const resourceType = response.request().resourceType();
      
      // Calculate bytes
      let bodySize = 0;
      try {
        const headers = response.headers();
        if (headers['content-length']) {
          bodySize = parseInt(headers['content-length'], 10);
        } else {
          // If no content-length, we might try to get body length if needed, but headers are safer for baseline
        }
      } catch (e) {
        // Ignore
      }

      initialTransferredBytes += bodySize;

      if (resourceType === 'image') {
        imageRequestCount++;
        imageTransferredBytes += bodySize;
      }

      if (resourceType === 'script') {
        jsTransferredBytes += bodySize;
      }
    });

    // We use addInitScript to capture web vitals via PerformanceObserver
    await page.addInitScript(() => {
      (window as any)['__web_vitals'] = { lcp: null, cls: 0 };
      
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        (window as any)['__web_vitals'].lcp = lastEntry.startTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });

      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            (window as any)['__web_vitals'].cls += (entry as any).value;
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });

    await page.goto('/discover');
    await page.waitForLoadState('load');

    // Small delay to allow final LCP and CLS to settle
    await page.waitForTimeout(1000);

    const vitals = await page.evaluate(() => (window as any)['__web_vitals']);

    // Log the baseline to a file so we can parse it for the final artifact
    const baseline = {
      lcp: vitals.lcp,
      cls: vitals.cls,
      initialRequestCount,
      initialTransferredBytes,
      imageRequestCount,
      imageTransferredBytes,
      jsTransferredBytes
    };

    fs.writeFileSync(path.join(process.cwd(), 'performance-baseline.json'), JSON.stringify(baseline, null, 2));

    expect(vitals.lcp).not.toBeNull();
    expect(vitals.cls).toBeGreaterThanOrEqual(0);
  });
});
