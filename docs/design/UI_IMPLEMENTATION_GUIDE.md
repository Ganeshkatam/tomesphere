# UI Implementation Guide

This document is the translation layer between the abstract Design Documents (in `docs/design/`) and the concrete React codebase. 

## The Implementation Pipeline

We build the UI bottom-up, exactly like the backend architecture.
```text
Foundation (Layouts, Containers)
  ↓
Primitives (Typography, Buttons, Cards)
  ↓
Patterns (Search, Library)
  ↓
Pages
```

## The Sandbox Principle (`exp/`)

Every UI component MUST be built, validated, and perfected in the `exp/` sandbox directory before being moved into the production `/app` or `/modules` folders.
1. **Prototype first, integrate later.**
2. **Static only** (No Supabase, no Server Actions, no EventBus in the sandbox).
3. **Move, don't rewrite** (Once approved, relocate the file).

## Translation Map

| Design Concept | Implementation |
| :--- | :--- |
| **Page Container** | `<PageContainer>` component (`max-w-*`, margins) |
| **Content Area** | `<ContentArea>` component |
| **Section** | `<Section>` component (vertical rhythm, spacing) |
| **Layout Shell** | App Router `layout.tsx` (or `exp/layouts/*Shell.tsx`) |
| **Surface** | Card primitive (`shadcn/ui` Card) |
| **Elevation** | Tailwind `shadow-*` tokens |
| **Spacing Token** (e.g. Space-4) | Tailwind spacing scale (e.g. `p-4`, `gap-6`) |
| **Typography Scale** | Tailwind typography utilities (`text-3xl font-display`) |

## Spacing Token Mapping (8px Grid)

Our design tokens map perfectly to Tailwind's default spacing scale:
- **Space-1 (4px)** = `1` (e.g., `p-1`, `gap-1`)
- **Space-2 (8px)** = `2`
- **Space-3 (12px)** = `3`
- **Space-4 (16px)** = `4`
- **Space-6 (24px)** = `6`
- **Space-8 (32px)** = `8`
- **Space-12 (48px)** = `12`
- **Space-16 (64px)** = `16`
- **Space-24 (96px)** = `24`

## Implementation Checklist

A component may leave `exp/` and enter production only if:
- [ ] Matches the design specification (Spacing, Typography).
- [ ] Is responsive (Mobile, Tablet, Desktop).
- [ ] Is accessible (Keyboard navigable, Contrast compliant).
- [ ] Uses ONLY design tokens (No ad-hoc `[13px]` values).
- [ ] Has zero `TODO`s.
- [ ] Contains no mock-only APIs or fake state once wired.
- [ ] Has been approved visually.
