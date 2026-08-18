import { test, expect } from '@playwright/test';

test.describe('Discovery Network Isolation & Lazy Loading', () => {
  test('Zero forbidden resource requests on initial load', async ({ page }) => {
    const forbiddenRequests: string[] = [];

    page.on('request', request => {
      const url = request.url().toLowerCase();
      const resourceType = request.resourceType();

      // Check URL patterns
      if (
        url.includes('.pdf') ||
        url.includes('/book-pdfs/') ||
        url.includes('/book_files') ||
        url.includes('/api/books/') && url.includes('/files')
      ) {
        forbiddenRequests.push(`Forbidden URL: ${url}`);
      }
    });

    page.on('response', response => {
      const contentType = response.headers()['content-type'] || '';
      if (contentType.includes('application/pdf')) {
        forbiddenRequests.push(`Forbidden Content-Type: ${contentType} for ${response.url()}`);
      }
    });

    await page.goto('/discover');
    await page.waitForLoadState('load');
    // Give it a brief moment to catch any immediate lazy loads
    await page.waitForTimeout(2000);

    expect(forbiddenRequests, `Found forbidden resource requests:\n${forbiddenRequests.join('\n')}`).toHaveLength(0);
  });

  test('Cover images lazy load behavior', async ({ page }) => {
    await page.goto('/discover');

    // 1. Check that Featured primary cover is eager
    const primaryCover = page.locator('section').filter({ hasText: 'Featured' }).locator('img').first();
    const primaryLoading = await primaryCover.getAttribute('loading');
    expect(primaryLoading).toBe('eager');

    // 2. Check that below-fold covers are lazy
    // Grab all images that have src containing 'placeholder' or 'cover' or 'unsplash'
    const allImages = page.locator('img');
    const count = await allImages.count();
    
    // We expect at least one image to test against
    expect(count).toBeGreaterThan(1);
    
    for (let i = 1; i < count; i++) { // Skip the first image (which is Featured)
      const loading = await allImages.nth(i).getAttribute('loading');
      if (loading) {
        expect(loading).toBe('lazy');
      }
    }
  });
});
