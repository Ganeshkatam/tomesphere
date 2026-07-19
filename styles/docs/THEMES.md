# Semantic Themes Documentation

Themes map raw palette tokens to semantic context-specific variables. Components must reference ONLY semantic variable names.

## Semantic Variables Mappings

| Variable Name        | Purpose                        | Dark Theme Value            | Light Theme Value     |
| -------------------- | ------------------------------ | --------------------------- | --------------------- |
| `--surface-canvas`   | Main body/page background      | `var(--slate-950)`          | `#ffffff`             |
| `--surface-default`  | Default card/panel surface     | `var(--slate-900)`          | `var(--slate-50)`     |
| `--surface-raised`   | Raised card/popover surface    | `var(--slate-800)`          | `var(--slate-100)`    |
| `--surface-overlay`  | Modal/overlay/dropdown surface | `var(--slate-700)`          | `var(--slate-200)`    |
| `--surface-floating` | Tooltip/floating surface       | `var(--slate-600)`          | `var(--slate-300)`    |
| `--border-subtle`    | Low contrast borders           | `rgba(255, 255, 255, 0.08)` | `rgba(0, 0, 0, 0.08)` |
| `--border-default`   | Standard component border      | `rgba(255, 255, 255, 0.12)` | `rgba(0, 0, 0, 0.12)` |
| `--border-strong`    | High contrast border/focus     | `rgba(255, 255, 255, 0.2)`  | `rgba(0, 0, 0, 0.2)`  |
| `--text-primary`     | Standard heading/body text     | `var(--slate-50)`           | `var(--slate-900)`    |
| `--text-secondary`   | Low emphasis descriptive text  | `var(--slate-300)`          | `var(--slate-600)`    |
| `--text-tertiary`    | Muted/placeholder text         | `var(--slate-400)`          | `var(--slate-500)`    |
| `--text-disabled`    | Inactive component text        | `var(--slate-500)`          | `var(--slate-400)`    |

## Using Theme Classes

To toggle themes, add or remove the `.light` class on the `<html>` root element.

```typescript
// Example: Toggling themes in React
document.documentElement.classList.toggle("light", isLightMode);
```
