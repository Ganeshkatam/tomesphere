# Traceability Matrix Governance

The Traceability Matrix is the master index for the milestone. It tracks all Decision Records through their lifecycle.

## Format

The index must be maintained at `docs/architecture/audits/index.md` using the following format:

```markdown
# Architecture Audits Traceability Matrix

| DR                                        | Candidate    | Status | Decision | Confidence | Implementation |
| ----------------------------------------- | ------------ | ------ | -------- | ---------- | -------------- |
| [DR-001-dashboard](./DR-001-dashboard.md) | `/dashboard` | Draft  | Unknown  | Unknown    | Pending        |
```

## Maintenance Rules

1. Every candidate must be added to the matrix before its investigation begins.
2. The `Status` column must exactly match one of the states defined in the Decision Record Lifecycle.
3. The matrix must be updated immediately upon state transitions.
4. The milestone cannot close until all records reach the "Closed" state.
