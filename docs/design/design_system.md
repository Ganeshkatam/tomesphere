# Phase 4: Visual Design System

The Visual Design System establishes the exact colors, typography, elevations, radii, and states for TomeSphere. It translates the "Calm, Focused, Elegant" product vision into concrete UI tokens.

## 1. Typography

The typographic hierarchy must prioritize legibility above all else. 
- **Typeface (Display)**: *Lora* or *Playfair Display* (Serif, brings an intellectual, "bookish" elegance).
- **Typeface (UI/Text)**: *Inter* or *Geist* (Sans-serif, clean, highly legible for dense UI elements).

| Role | Font Family | Weight | Size | Line Height | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Title** | Serif | Semi-bold | 3rem (48px) | 1.1 | Marketing landing page headers. |
| **Page Title (H1)** | Serif | Semi-bold | 2.25rem (36px) | 1.2 | The title of a Book, Author, or major route (Discover). |
| **Section Title (H2)** | Sans | Medium | 1.5rem (24px) | 1.3 | "Trending Books", "Description", "Curated Collections". |
| **Body Base** | Sans | Regular | 1rem (16px) | 1.6 | Standard UI text, descriptions. |
| **Reader Text** | Serif | Regular | 1.125rem (18px) | 1.8 | The actual content of the book being read. Highly spaced for eye tracking. |
| **Caption / Small** | Sans | Medium | 0.875rem (14px)| 1.5 | Metadata, tags, secondary navigation links. |

## 2. Color System

The color palette is warm, spacious, and low-contrast to reduce eye strain. We avoid pure black (`#000000`) and pure white (`#FFFFFF`) to prevent harsh glare.

### Light Theme (Default "Paper")
- **Background Base**: `#F9F9F7` (A warm, off-white paper tone).
- **Background Surface**: `#FFFFFF` (For elevated cards/modals).
- **Text Primary**: `#2D2D2D` (Deep charcoal, easier on the eyes than black).
- **Text Secondary**: `#666666` (For metadata and captions).
- **Border Subtle**: `#E6E6E1` (For gentle dividers).
- **Primary Brand**: `#4A5568` (A calm slate-blue, used sparingly for active states).

### Dark Theme ("Ink")
- **Background Base**: `#121212` (Deep charcoal gray).
- **Background Surface**: `#1E1E1E` (Slightly elevated gray).
- **Text Primary**: `#E2E8F0` (Soft off-white).
- **Text Secondary**: `#A0AEC0` (Muted gray-blue).
- **Border Subtle**: `#2D3748` (Dark gray).
- **Primary Brand**: `#90CDF4` (Soft pastel blue for active states).

## 3. Elevation & Shadows

We avoid heavy, skeuomorphic shadows. Elevation is primarily communicated through borders and background shifts.

- **Level 0 (Flat)**: Base background.
- **Level 1 (Card/Hover)**: 1px subtle border (`Border Subtle`) + an extremely soft, diffuse shadow: `box-shadow: 0 4px 20px rgba(0,0,0, 0.03)`.
- **Level 2 (Modals/Drawers)**: `box-shadow: 0 10px 40px rgba(0,0,0, 0.08)`.

## 4. Radius (Corners)

TomeSphere is elegant and timeless, not overly playful. We avoid pill-shaped buttons and extreme rounding.
- **UI Elements (Buttons, Inputs)**: `6px` (Subtle rounding, highly professional).
- **Cards & Covers**: `4px` or `8px`.
- **Modals**: `12px`.

## 5. Interaction States & Motion

Motion should communicate state, not decoration. All transitions should be quick and snappy.
- **Hover**: 150ms ease-in-out (e.g., slight elevation shift on book cards, text color change on links).
- **Focus**: A highly visible, 2px solid ring (`Primary Brand`) offset by 2px to guarantee accessibility.
- **Active (Click)**: Immediate visual feedback (e.g., scale down to `0.98` for 100ms).
- **Loading**: Use structural skeletons (background `#E6E6E1` pulsating to `#F0F0EA`) rather than blocking spinners.

## 6. Accessibility Rules

- **Contrast**: All Text Primary and Text Secondary combinations against their respective backgrounds MUST pass WCAG AA (4.5:1 minimum).
- **Keyboard Navigation**: Every interactive element (Button, Link, Tab) must be reachable via `Tab` and must have a clearly visible Focus state.
- **Screen Readers**: Book covers must have `alt` tags. Icon-only buttons must have `aria-label`.
