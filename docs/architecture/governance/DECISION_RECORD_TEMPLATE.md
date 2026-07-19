# Formal Decision Record Template

_Copy this template for each candidate under `docs/architecture/audits/DR-XXX-name.md`_

## Scope & Ownership

- **Candidate:** (e.g., `/dashboard`)
- **Included:** (Route, Screen, Components, Navigation)
- **Excluded:** (e.g., Analytics module)
- **Primary Owner:** (e.g., Reading)
- **Secondary Consumers:** (e.g., Discovery, Progress) _(If ownership is unclear, investigation pauses)_

## Product Investigation

- **Purpose:** Why does the user visit this page?
- **User Journey:** Path through the application
- **Business Capability:** What domain does this serve?
- **UX Overlap:** Is the destination actually better?
- **Replacement Target:** Where does this functionality belong?

## Technical Investigation

- **Entry Points:** `href`, `router.push`, `redirect`, `Navbar`, etc.
- **Inbound Dependencies:** (Navigation, Redirect, Dynamic import, Component, Hook, Service, Repository, RPC, Database)
- **Outbound Dependencies:** (UI, Application, Domain, Infrastructure, External)
- **Components & Services:** Actions, hooks, utilities, CQRS endpoints
- **Event Analysis:**
  - [ ] Publishes events
  - [ ] Consumes projections
  - [ ] Starts commands
  - [ ] Reads queries
  - [ ] Triggers analytics
  - [ ] Affects recommendations
  - [ ] Affects progress
- **Database:** Tables and views accessed

## Analysis & Evidence

**Evidence Inventory**

- [ ] Static Evidence (Search results, Dependency graph, Import graph)
- [ ] Runtime Evidence (Navigation, Redirect, User flow)
- [ ] Historical Evidence (Roadmap, Architecture docs)
- [ ] Verification Evidence (Build, TypeScript, ESLint)

- **Facts:** Concrete facts gathered from evidence
- **Findings:** Synthesized observations

## Decision

- **Options:** 1. Keep, 2. Merge, 3. Delete
- **Alternatives Considered:**
  - _Keep existing route:_ Rejected because...
  - _Merge into Home:_ Accepted because...
- **Migration Strategy:** Redirect | Extract and reuse | Copy then replace | Shared implementation | Archive then remove
- **Rollback Strategy:** Exactly how do we undo this if verification fails?
- **Success Criteria:** (e.g., Users can still reach feature, No navigation regressions, Build succeeds)
- **Decision:** KEEP | MERGE | MOVE | DELETE | UNKNOWN

## Confidence Rule

| Confidence  | Requirement                              | Action                            |
| :---------- | :--------------------------------------- | :-------------------------------- |
| **High**    | Static + Runtime + Verification evidence | May implement                     |
| **Medium**  | Static + Runtime                         | Requires additional investigation |
| **Low**     | Static only                              | No changes allowed                |
| **Unknown** | Missing evidence                         | Investigation remains open        |

## Architecture Delta

- **Before:** Owners (X), Route Aliases (Y), Dependencies (Z)
- **After:** Owners (X), Route Aliases (Y), Dependencies (Z)
