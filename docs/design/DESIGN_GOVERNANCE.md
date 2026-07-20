# Design Governance

**STATUS: ENFORCED**

This document serves as the absolute source of truth for visual and interaction boundaries within TomeSphere. Just as `ARCHITECTURE_RULES.md` prevents structural drift in the codebase, this document prevents visual drift in the UI. Do not merge PRs that violate these rules.

## 1. Source of Truth

- **The Markdown specs are the final specification.** Any high-fidelity mockups generated during the design process are strictly for *visual validation*. If a mockup contradicts these markdown rules, the mockup is wrong.

## 2. Layout Rules

- **No ad hoc layouts.** Every new page MUST use one of the predefined layout shells defined in `design_board_2a_layouts.md` (Marketing, Discovery, Workspace, Reader, or Admin).
- **No layout mutations.** Do not arbitrarily hide a sidebar or add a secondary header to a route unless that variant is explicitly defined in the layout architecture.

## 3. Navigation Rules

- **Primary navigation is frozen.** The navigation hierarchy established in `design_board_1_ia.md` is complete.
- **No new top-level items.** Introducing a new top-level navigation item requires architectural justification and a corresponding update to the IA board.

## 4. Component Rules

- **Extend, don't duplicate.** Prefer extending existing UI primitives (e.g., passing a new variant prop to `<Button>`) over creating a new generic component.
- **No duplicate patterns.** If a book grid exists, use it. Do not create a slightly different list view for a new feature unless justified by the product vision.

## 5. Token Rules (Strict Enforcement)

- **No ad hoc spacing.** Every margin, padding, or gap MUST use a predefined spacing token (e.g., `Space-4`, `Space-6`). `padding: 13px` is illegal.
- **No ad hoc colors.** Every color MUST pull from the Visual Design System palette. Do not introduce `#F4F4F4` if `#F9F9F7` is the official Paper Base.
- **No ad hoc typography.** Font sizes, weights, and line-heights MUST match the established typographic scale.

## 6. Accessibility Rules

- **Keyboard First:** Every interactive element MUST be keyboard accessible (`Tab`, `Enter`, `Space`) with a visible focus state.
- **Contrast Check:** Every text color combination against its background MUST meet WCAG AA contrast requirements (minimum 4.5:1).
- **Semantic HTML:** Use proper tags (`<button>`, `<a>`, `<nav>`, `<main>`). Do not use `div` with an `onClick` handler unless strictly necessary (and accompanied by `role="button"` and `tabIndex={0}`).
