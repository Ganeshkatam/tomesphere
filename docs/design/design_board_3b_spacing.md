# Phase 3B: Spacing & Grid System

This board breathes life into the structural wireframes by defining the exact proportions, rhythms, and grids we will use. We use an 8px base grid system for all spacing tokens.

## 1. Grid & Containers

### Reader Layout
- **Max-Width**: `65ch` (Optimal reading line length for typography)
- **Margins**: Fluid `clamp(24px, 5vw, 64px)` on left/right to ensure it feels spacious on large screens but doesn't touch the edges on mobile.

### Discovery & Workspace (Sidebar Layout)
- **Sidebar Width**: `280px` fixed.
- **Main Content**: `minmax(0, 1fr)` (Takes remaining space).
- **Max-Width**: `1440px` (To prevent grids from becoming uncomfortably wide on ultrawide monitors).
- **Gap between Sidebar and Content**: `64px` (8 units) for a spacious, uncluttered feel.

### Marketing Layout
- **Max-Width**: `1200px` for standard centered content.

## 2. The Spacing Scale (8px Base)

We strictly use these tokens. No ad-hoc pixel values are allowed.

| Token | Value | Rem | Usage |
| :--- | :--- | :--- | :--- |
| **Space-1** | 4px | 0.25rem | Micro-adjustments, icon to text spacing |
| **Space-2** | 8px | 0.5rem | Tight grouping (e.g., Title to Author name) |
| **Space-3** | 12px | 0.75rem | Small padding inside cards/buttons |
| **Space-4** | 16px | 1rem | Standard UI element padding, list item spacing |
| **Space-6** | 24px | 1.5rem | Outer padding of cards, medium gaps |
| **Space-8** | 32px | 2rem | Spacing between related sections (e.g., Title block and Description) |
| **Space-12** | 48px | 3rem | Distinct section breaks |
| **Space-16** | 64px | 4rem | Major layout margins, gap between sidebar and content |
| **Space-24** | 96px | 6rem | Vertical rhythm between major page sections (e.g., Trending vs Featured) |

## 3. Responsive Breakpoints

| Breakpoint | Value | Behavior |
| :--- | :--- | :--- |
| **sm** | 640px | Sidebar collapses into a hamburger menu / bottom sheet. Grids become 2 columns. |
| **md** | 768px | Standard tablet. Grids are 3-4 columns. |
| **lg** | 1024px | Sidebar is visible. Grids are 4-5 columns. |
| **xl** | 1280px | Grids are 6 columns. |

## 4. Rhythm Example (Book Grid)
- Gap between grid items: `Space-6` (24px)
- Gap between Section Header and Grid: `Space-6` (24px)
- Gap between Section (e.g., Trending) and the next Section (e.g., Featured): `Space-16` (64px) to `Space-24` (96px).
