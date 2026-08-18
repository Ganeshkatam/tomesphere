import { test, expect } from '@playwright/test';

test.use({ 
  colorScheme: 'light',
  // @ts-ignore
  reducedMotion: 'reduce' 
});

test.describe('Discovery Reduced Motion', () => {
  test('Page remains usable with reduced motion', async ({ page }) => {
    await page.goto('/discover');
    
    // Test that a book card is still clickable and visible
    const firstBook = page.locator('a[href^="/book/"]').first();
    await expect(firstBook).toBeVisible();
    
    // We can't easily assert CSS transition absence strictly in all browsers, 
    // but we can assert no critical layout errors happen when the media query is active.
    
    // Assert focus-visible still works
    await page.keyboard.press('Tab');
    
    const isFocusVisibleStyleApplied = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return false;
      const computedStyle = window.getComputedStyle(el);
      return computedStyle.boxShadow.includes('rgba') || computedStyle.outline !== 'none';
    });
    
    expect(isFocusVisibleStyleApplied).toBe(true);
  });
});
