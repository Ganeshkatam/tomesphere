# Layout Primitives API Documentation

Layout primitives are reusable CSS patterns for spacing and grouping components. They are designed to prevent visual layout drift.

## General Spacing Rule

> **CRITICAL RULE**: Layout components must NEVER use bottom or top margins on children. Spacing is strictly controlled via `gap` or stack containers.

---

## 1. Stack (`.layout-stack`)

Provides vertical spacing.

- **Rules**: Never apply vertical margins to children. Always use the stack spacing classes.
- **Modifiers**:
  - `.layout-stack-xs`: `0.25rem` (4px gap)
  - `.layout-stack-sm`: `0.5rem` (8px gap)
  - `.layout-stack-md`: `1rem` (16px gap)
  - `.layout-stack-lg`: `1.5rem` (24px gap)
  - `.layout-stack-xl`: `2.5rem` (40px gap)

---

## 2. Cluster (`.layout-cluster`)

Horizontal alignment with wrapping.

- **Rules**: Wraps elements when space is insufficient. Useful for tags, action buttons, chip lists.
- **Modifiers**:
  - `.layout-cluster-xs`: `0.25rem` gap
  - `.layout-cluster-sm`: `0.5rem` gap
  - `.layout-cluster-md`: `1rem` gap
  - `.layout-cluster-lg`: `1.5rem` gap

---

## 3. Rail (`.layout-rail`)

Horizontal scroll snap carousel/slider layout.

- **Rules**: Hides scrollbars, Snaps child components starting at the left boundary.
- **Classes**:
  - `.layout-rail`: The flex row container.
  - `.layout-rail-item`: Snap item configuration.

---

## 4. Sidebar (`.layout-sidebar`)

Split layout for dual panel structures (e.g., search page, reader settings).

- **Classes**:
  - `.layout-sidebar`: Container
  - `.layout-sidebar-main`: Takes remaining space.
  - `.layout-sidebar-side`: Secondary sidebar panel (baselines at 280px wide).
