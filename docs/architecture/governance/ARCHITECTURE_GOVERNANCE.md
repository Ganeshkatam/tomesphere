# Architecture Governance Framework

**Version:** 1.0  
**Applies to:** Milestone 1.5  
**Supersedes:** None  
**Last Updated:** 2026-07-18

> **The purpose of this milestone is not to reduce the number of files or routes. It is to ensure that every retained feature has a clear purpose, a single owner, well-defined dependencies, and documented architectural justification. Any reduction in complexity is a consequence of that process, not the objective itself.**

## Scope

This framework governs structural changes affecting:

- Routes and Navigation
- Modules and Components
- Shared abstractions
- Public APIs and Application services
- Domain ownership

**It does not govern:**

- Bug fixes
- Feature implementation
- Styling or Copy changes
- Performance tuning
- Database schema evolution (covered by Database Governance document)

## Non-Goals

This milestone does not aim to:

- Reduce file count or LOC
- Increase code coverage
- Rewrite working code
- Standardize style
- Introduce new architecture

_Any of these may occur naturally, but they are not objectives._

## Guiding Principles

1. Evidence over assumptions.
2. Product intent over implementation history.
3. One capability, one owner.
4. Prefer migration over recreation.
5. Every architectural decision is documented.
6. Every change is reversible until verified.
7. Reduce coupling, increase cohesion.
8. The application must remain deployable after every commit.

## 5. Decision Record Types

Not all decisions have the same scope. When investigating, classify the DR:

| Type                           | Example      | Scope                        |
| :----------------------------- | :----------- | :--------------------------- |
| **Presentation Consolidation** | `/dashboard` | UI cleanup, duplicate views  |
| **Route Consolidation**        | `/analytics` | Redirect shells, dead routes |
| **Product Capability**         | `/profile`   | Missing features, UX flows   |
| **Domain Boundary**            | Reader       | Module encapsulation         |
| **Infrastructure**             | Outbox       | Data flow, messaging         |

## 6. Standard Consolidation Pattern

For standard duplicate/redirect features, the canonical execution pattern is:

1. **Investigate**: Document static, runtime, and capability parity evidence.
2. **Produce Decision Record**: Create DR artifact using the standard template.
3. **Approve**: Obtain sign-off based on evidence.
4. **Remove inbound navigation**: Update footers, menus, and fallback links.
5. **Verify replacement**: Add 308 redirects to `next.config.js`.
6. **Archive legacy implementation**: Move orphaned components to the milestone archive.
7. **Delete route**: Remove the candidate route folder.
8. **Build**: Run full production build verification.
9. **Close Decision Record**: Update Traceability Matrix and milestone metrics.

**Note:** If a candidate has active consumers or shared logic, do not force it into this pattern. Let the investigation determine the appropriate migration strategy.

## Architecture Invariants

The following must remain true throughout the milestone:

- One route has one owner.
- One capability belongs to one bounded context.
- Platform owns navigation.
- Business modules own business logic.
- Reader remains contextual.
- Discovery owns recommendations.
- Analytics owns projections.
- Domain logic never moves into UI.
- Infrastructure never owns policy.

## Migration Constraints

**Must NOT:**

- Change business behavior
- Change permissions
- Change URLs without redirects
- Change ownership without documentation
- Introduce new coupling

**May:**

- Simplify implementation
- Reduce duplication
- Clarify ownership
- Improve cohesion

## Stop Conditions

**Pause immediately if:**

- Ownership becomes ambiguous.
- Two Decision Records conflict.
- New duplicate functionality is discovered.
- Hidden consumers appear.
- Build breaks unexpectedly.
- Migration changes business behavior.
- Investigation confidence drops.
