# Milestone 1.5 – Product Surface Audit & Consolidation

## Scope

This milestone governs the audit and consolidation of the application's product surface, including:

- Routes
- Navigation
- Reader legacy abstractions
- Shared components
- Module boundaries
- Public user experiences

**Excluded:**

- New features
- Database schema changes
- Business logic enhancements
- Recommendation algorithms
- Analytics implementation

## Success Criteria

This milestone succeeds when:

- Every retained route has a documented owner.
- Every investigated feature has an approved Decision Record.
- Duplicate user experiences have been resolved or justified.
- Navigation reflects the canonical information architecture.
- No obsolete abstractions remain active without justification.
- All verification gates defined in the Governance Framework pass.

## Milestone 1.5A — Architecture & Product Consolidation

**Focus**: Canonical product surfaces established, architectural documentation aligned with implementation, and legacy scaffolding removed.

### Completed

1. DR-001 — `/dashboard` ████████████████ 100%
2. DR-002 — `/analytics` ████████████████ 100%
3. DR-003 — `/profile` ████████████████ 100%
4. DR-008 — Reader Architecture Conformance ████████████████ 100%

---

## Milestone 1.5B — Domain Validation

**Focus**: Product-domain investigations to determine whether each capability belongs in the v1 public launch, a later version, or should be restructured based on the education-first roadmap.

### Current Investigation Queue

1. DR-004 — `/notes` (Domain Launch Validation)
2. DR-005 — `/citations` (Domain Launch Validation)
3. DR-006 — `/academic` (Domain Launch Validation)
4. DR-007 — `/exam-prep` (Domain Launch Validation)

### Progress

DR-004 ████████████████ 100%
DR-005 ████████████████ 100%
DR-006 ████████████████ 100%
DR-007 ████████████████ 100%

During this milestone:

- No feature may be rewritten without an approved Decision Record.
- No route may be deleted before replacement verification.
- Every commit must remain deployable.
- Unknown findings pause implementation and begin a new investigation.

## Architecture Metrics

| Metric                | Before | Current |
| :-------------------- | :----: | :-----: |
| Duplicate experiences |   7    |    6    |
| Redirect-only pages   |   6    |    5    |
| Closed DRs            |   0    |    1    |

## Deliverables

- Updated route structure
- Updated navigation
- Decision Records
- Traceability Matrix
- Archived legacy code
- Updated architecture documentation
- Clean application build
