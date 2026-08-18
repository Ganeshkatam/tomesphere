import { test, expect } from '@playwright/test';

test.describe('Book Detail Network Isolation & DTO Boundary', () => {
  test('Zero resource requests on initial load', async ({ page }) => {
    let pdfRequests = 0;
    let bookFilesRequests = 0;
    const forbiddenRequests: string[] = [];

    page.on('request', request => {
      const url = request.url();
      if (url.endsWith('.pdf') || url.includes('/book-pdfs')) {
        pdfRequests++;
        forbiddenRequests.push(url);
      }
      if (url.includes('book_files') || (url.includes('/api/') && url.includes('/download'))) {
        bookFilesRequests++;
        forbiddenRequests.push(url);
      }
    });

    // Navigate to a book page
    // (Assuming we have a fixture slug like 'the-great-gatsby')
    // We can just grab the first book from the discovery page to test against.
    await page.goto('/discover');
    await page.waitForLoadState('load');
    
    // Find first book link and navigate
    const bookLink = page.locator('a[href^="/book/"]').first();
    const bookUrl = await bookLink.getAttribute('href');
    
    expect(bookUrl).toBeTruthy();

    await page.goto(bookUrl!);
    await page.waitForLoadState('load');

    // Small timeout to catch delayed hydration requests
    await page.waitForTimeout(1000);

    expect(forbiddenRequests, `Found forbidden resource requests:\n${forbiddenRequests.join('\n')}`).toHaveLength(0);
    expect(pdfRequests).toBe(0);
    expect(bookFilesRequests).toBe(0);
  });
});
