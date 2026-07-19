# TomeSphere Launch Scope

This document serves as the canonical definition of "what ships" for TomeSphere v1.0. It defines the active modules, planned modules for future versions, and retired historical experiments. The application structure, compilation pipeline, and UI entry points strictly align with this manifest.

## Active Status

**Definition**: Code that ships today. All routes, UI elements, and API endpoints are exposed and fully supported.

### Active Modules

- `analytics`
- `core`
- `discovery`
- `me`
- `platform`
- `progress`
- `reading`
- `shared`
- `user`

### Active Routes

- `/` (Landing)
- `/home`
- `/discover`
- `/library`
- `/books/[id]`
- `/read/[id]`
- `/search`
- `/me` (Dashboard)
- `/me/profile`
- `/me/security`
- `/me/preferences`
- `/me/collections`
- `/me/progress`
- `/me/reading`
- `/support`

---

## Planned Status

**Definition**: Code intentionally deferred to a planned future release (e.g., v2 Knowledge Workspace, v3 Study Platform). These modules remain in the `modules/` directory to maintain type-safety and linting compatibility, preventing code rot. However, they possess **no active routes or UI entry points** in the v1 application.

### Planned Modules

- `learning` (Deferred to v2)
- `study` (Deferred to v3)
- `planner` (Deferred to v3)

### Deferred Routes

_These routes have been removed from the active application tree and archived in `archive/deferred-routes/`._

- `/me/learning` (v2 Knowledge Workspace)
- `/me/inbox` (v2 Notifications/Inbox)
- `/me/study` (v3 Exam Prep & Study Tools)

---

## Retired Status

**Definition**: Code retired from the product vision or preserved purely for historical reference. This code resides in `archive/retired/` and is entirely decoupled from the active application.

### Retired Modules

- `community`
- `contests`
- `textbook`

### Retired Routes

- `/profile/[id]` (Public profiles are explicitly excluded from the education-first vision).

---

## Public Launch Checklist

1. [x] **No V2/V3 UI Links**: All navigation menus exclude "Learning Hub", "Notes", "Citations", "Exam Prep", and "Flashcards".
2. [x] **No Cross-Dependencies**: V1 modules do not import code from `learning`, `study`, or `planner`.
3. [x] **Strict Route Protection**: Only Active Routes resolve. Deferred routes return standard 404s.
4. [x] **Schema Stability**: The database schema and migrations remain untouched and backward/forward compatible.
5. [x] **Zero Lint Warnings**: The active module graph is warning-free.
