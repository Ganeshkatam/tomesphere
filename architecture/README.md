# Architecture Index & Governance

Welcome to the TomeSphere architecture index. This serves as the primary entry point for understanding the system's structural governance.

## Documentation Index

- [Frontend Architecture](./frontend.md)
- [Design Philosophy](./design.md)
- [Decisions (ADRs)](./decisions/)

## Domain Ownership

To prevent concept duplication, every sub-domain has a strict owner:

| Bounded Context | Owns                                              |
| --------------- | ------------------------------------------------- |
| **`reading`**   | Books, Reader, Library                            |
| **`progress`**  | Goals, Analytics, Streaks                         |
| **`learning`**  | Notes, Flashcards, Vocabulary, Tests, Citations   |
| **`planner`**   | Schedules, Deadlines, Study Plans, Academic terms |
| **`me`**        | Personal Center composition, User aggregations    |

## Allowed Dependency Matrix

Cyclic feature dependencies are strictly prohibited. Bounded contexts should communicate solely through shared interfaces or be composed at the application layer.

| From Module | Can Depend On                                          |
| ----------- | ------------------------------------------------------ |
| `me`        | `reading`, `learning`, `progress`, `planner`, `shared` |
| `reading`   | `shared`                                               |
| `learning`  | `shared`                                               |
| `progress`  | `shared`                                               |
| `planner`   | `shared`                                               |
| `platform`  | `shared`                                               |
| `shared`    | _none_                                                 |

_Note: Any dependency that violates this matrix (e.g., `learning` importing `progress`) is an architectural regression and will fail CI._
