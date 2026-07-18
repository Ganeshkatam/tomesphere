# Architecture Health

This document tracks the health and integrity of our architectural migration. Rather than focusing purely on raw component counts, these metrics measure how consistently we adhere to our own rules.

## Structural Health

This section tracks the integrity of our domain architecture. These metrics ensure that the established rules and boundaries are respected.

| Metric                              | Target | Current |
| :---------------------------------- | -----: | ------: |
| Circular Dependencies               |      0 |       0 |
| Forbidden Imports                   |      0 |       0 |
| Repository Contracts                |   100% |    100% |
| Aggregate Coverage                  |   100% |    100% |
| Read Model Coverage                 |   100% |    100% |

*(Note: Target is 100% for existing Level 3 domains)*

## Technical Debt

This section tracks legacy concerns and migration progress from older patterns to our standard architecture.

| Metric                              | Target | Current |
| :---------------------------------- | -----: | ------: |
| Direct Supabase imports             |      0 |      15 |
| Legacy services                     |      0 |      TBD|
| Deprecated modules                  |      0 |      TBD|
| Legacy routes remaining             |      0 |      TBD|

## Architectural Components Tracker

While absolute counts don't measure health directly, tracking them helps us understand the scale of our domain extraction effort:

| Component                    | Count |
| :--------------------------- | ----: |
| Aggregate Roots              |     4 |
| Entities                     |    10 |
| Value Objects                |    14 |
| Repository Interfaces        |     4 |
| Repository Implementations   |     4 |
| Repository Contracts         |     4 |
| Read Models                  |     4 |
| Use Cases (Commands/Queries) |    14 |
| Domain Events                |    12 |
