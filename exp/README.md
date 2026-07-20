# TomeSphere UI Sandbox (`exp/`)

This directory is the official staging area for all frontend UI architecture. It acts as the bridge between the design specification and the production application.

## Purpose

> **Validate UI architecture before wiring it into the application.**

This is **not** a second application, a component library, or a dumping ground. It is the mandatory proving ground for all UI elements.

## The Three Principles

1. **Prototype first, integrate later** — every UI element is validated in `exp/` before entering the application.
2. **Static only** — no backend integration, state management, or business logic. The focus is purely on structure, interaction, spacing, and typography.
3. **Move, don't rewrite** — once a prototype is approved, it is promoted into the production codebase (`/app`, `/modules`, `/shared`) by relocating and adapting it, not by recreating it from scratch.

## Allowed vs Not Allowed

| ✅ Allowed | ❌ Not Allowed |
| :--- | :--- |
| - Static mock data | - Supabase or Database connections |
| - Hardcoded content | - Server Actions |
| - Layout experiments | - Repositories or Domain objects |
| - Component composition | - EventBus |
| - Animation & responsive experiments | - Authentication |
| - Accessibility & typography testing | - Real Next.js routes |
| | - Business logic |

## Promotion Checklist

A component may leave `exp/` only if it passes all criteria:

- [ ] Matches the design specification exactly
- [ ] Fully responsive across breakpoints
- [ ] Keyboard & contrast accessible
- [ ] Uses ONLY design tokens (Tailwind classes) - no ad hoc pixels
- [ ] Contains NO `TODO`s
- [ ] Contains NO mock-only APIs
- [ ] Has been approved visually

## Directory Structure

```text
exp/
├── layouts/       (Macro shells like DiscoveryShell)
├── primitives/    (Structural containers like PageContainer)
├── navigation/    (Navbars, Sidebars, Menus)
├── typography/    (Headings, paragraphs)
├── cards/         (Book cards, collection cards)
├── forms/         (Inputs, selects, textareas)
└── playground/    (Scratchpad for temporary combinations)
```
