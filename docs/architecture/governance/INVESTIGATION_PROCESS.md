# Investigation Process

## Workflow

```text
Candidate
    ↓
Scope
    ↓
Investigation
    ↓
Evidence Collection
    ↓
Analysis
    ↓
Decision Record
    ↓
Approval
    ↓
Migration
    ↓
Verification
    ↓
Deletion (if applicable)
    ↓
Closure
```

## Decision Record Lifecycle

| State            | Meaning                          |
| :--------------- | :------------------------------- |
| **Draft**        | Investigation in progress        |
| **Under Review** | Evidence collected               |
| **Approved**     | Ready for implementation         |
| **Implemented**  | Migration completed              |
| **Verified**     | Post-migration validation passed |
| **Closed**       | Candidate resolved               |

## Verification Criteria

For every migration, verification must span three categories:

### Functional

- Feature still works.
- Navigation reaches it.
- Permissions are unchanged.
- Deep links still work.
- Redirects behave correctly.

### Technical

- Build passes.
- TypeScript passes.
- ESLint passes.
- No console/runtime errors.

### Architectural

- Ownership is clearer.
- Dependencies reduced or unchanged.
- No new cross-context coupling introduced.

## Archive Strategy

Outcomes fall into three exact buckets:

- **Delete:** No remaining value
- **Archive:** Historical value retained
- **Deprecate:** Still present but scheduled for removal

_Archived code goes into `archive/<milestone>/<domain>/` with a `README.md` explaining the outcome and referencing the Decision Record._
