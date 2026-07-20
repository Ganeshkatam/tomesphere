# DR-001: Post-Architecture Execution Policy

**Date:** 2026-07-19
**Status:** Enacted

## Context

TomeSphere has officially concluded its foundational architecture phase. The database schema, DDD boundaries, CQRS conventions, domain event contracts, background job infrastructure, and repository patterns are fully established and frozen (see ADR-005).

To maintain high delivery velocity and prevent architectural scope creep, we need an explicit governance policy that shifts the team's optimization target from "designing the platform" to "delivering user value on top of the platform."

## Policy

**Once Architecture Freeze is declared, proposals that introduce new architectural layers, alter bounded contexts, rename core abstractions, redefine module ownership, or change cross-module contracts should be rejected unless they:**

1. **Address a critical production defect**,
2. **Resolve a demonstrable scalability limitation**, or
3. **Enable a fundamentally new product capability** that absolutely cannot be implemented within the existing architecture.

## Consequences

- Architectural churn will be heavily penalized during code review or planning.
- Engineers are expected to build *within* the established constraints, utilizing existing generic handlers (e.g., `ProjectionRegistry`, `JobDispatcher`, `IEventBus`) rather than inventing new infrastructure.
- All development effort is forcefully directed toward completing the V1 Product Roadmap.
