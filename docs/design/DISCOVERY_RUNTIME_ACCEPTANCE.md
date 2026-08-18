# Discovery Runtime Acceptance

**Environment**: Local Production Build (`npm run build` & `npm run start`)
**Date**: July 21, 2026
**Browser**: Playwright Chromium (147.0.7727.15)
**Viewport Matrix**: 375x812, 768x1024, 1024x768, 1440x900

## Resource Isolation
**PASS**
- 0 requests to `**/*.pdf`
- 0 requests to `/book_files`
- Initial document payload completely isolated from reader resources.

## Dataset Budgets
**PASS**
- Strictly bounds implemented at the page-level (`.slice(0, 6)` and `.slice(0, 12)`).
- Playwright visually confirmed no unbound expansion of Collections, Authors, or Books on load.

## Lazy Image Behavior
**PASS**
- Priority `loading="eager"` enforced for the primary Featured cover.
- 100% of below-the-fold trending/new arrival covers natively use `loading="lazy"`.
- Missing cover images use deterministic placeholders (via `BookCard`) and do not emit failing `<img src="null">` requests.

## Search
**PASS**
- Native GET `/search?q=...` works synchronously and correctly navigates.
- Unicode characters correctly encoded (`%E6%96%87%E5%AD%A6`).
- Empty queries (`?q=`) route predictably without hydration/crash errors.

## Keyboard & Accessibility
**PASS**
- Tested native logical `Tab` traversal.
- Focus-visible rings applied properly for interactive elements (Cards, Buttons, Inputs).
- Reduced-motion layout doesn't obscure critical information.

## Responsive Stability
**PASS**
- Automated tests across mobile (375px), tablet (768px), and desktop (1024px, 1440px) reported `document.documentElement.scrollWidth <= clientWidth`.
- Zero horizontal overflow.

## Reduced Motion
**PASS**
- `reducedMotion: "reduce"` enforced in Playwright.
- Page maintains layout integrity and functionality without transforms.

## Performance Baseline

*Captured via browser PerformanceObserver & Request Interception:*
- **LCP:** 2064 ms
- **CLS:** 0
- **Requests:** 34
- **Transferred:** 1.20 MB
- **Images:** 3 requests (1.09 MB total)
- **JS:** 366 bytes (Strictly Server Components)
- **Forbidden resources:** 0

## Torture Test
**PASS**
- Tested with `tortureBooks` mock dataset:
  - Null `coverUrl`
  - 4+ authors (`min-w-0` truncation handling)
  - Abnormally long and space-less titles
  - Missing publication dates
- Grid maintains structural integrity across all viewports.

---

## Final Decision

**DISCOVERY EXPERIENCE: FROZEN**
