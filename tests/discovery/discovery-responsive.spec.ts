import { test, expect } from '@playwright/test';

test.describe('Discovery Responsive Stability', () => {
  const viewports = [
    { width: 375, height: 812 },  // Mobile
    { width: 768, height: 1024 }, // Tablet
    { width: 1024, height: 768 }, // Desktop small
    { width: 1440, height: 900 }  // Desktop wide
  ];

  for (const vp of viewports) {
    test(`No horizontal overflow at ${vp.width}x${vp.height} on Torture Test`, async ({ page }) => {
      await page.setViewportSize(vp);
      // We run against the torture test to ensure missing data doesn't break layout
      await page.goto('/discover');
      
      const isOverflowing = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      
      expect(isOverflowing).toBe(false);
    });
  }
});
