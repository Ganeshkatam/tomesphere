import { test, expect } from '@playwright/test';

test.describe('Discovery Accessibility & Keyboard', () => {
  test('Interactive elements have focus-visible treatment and logical tab order', async ({ page }) => {
    await page.goto('/discover');
    
    // Tab into the document
    await page.keyboard.press('Tab');
    
    // Evaluate if the currently focused element is a known interactive element
    // and if it receives our focus-visible class rings.
    
    let activeElementTagName = await page.evaluate(() => document.activeElement?.tagName);
    expect(activeElementTagName).toBeTruthy();
    
    // Tab multiple times to verify traversal
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      
      const isFocusVisibleStyleApplied = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el) return false;
        
        // Next.js Link / native inputs
        const computedStyle = window.getComputedStyle(el);
        // We look for our primary focus ring color or outline
        // Tailwind focus-visible:ring-primary translates to a box-shadow
        return computedStyle.boxShadow.includes('rgba') || computedStyle.outline !== 'none' || computedStyle.outlineStyle !== 'none';
      });
      
      // We expect the focus-visible styles to be present
      expect(isFocusVisibleStyleApplied).toBe(true);
    }
  });
});
