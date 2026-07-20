# ADR-005: Code Architecture Freeze

**Date:** 2026-07-19
**Status:** Accepted

## Context

TomeSphere has completed its initial foundational architecture. The boundaries, layering, database schema, event bus, outbox, read models, and cross-module communications have been established and refined using strict Domain-Driven Design (DDD) and CQRS principles.

We have achieved a stable state where the core infrastructure is capable of supporting the remaining V1 product roadmap without requiring continuous structural redesign.

## Decision

We are enacting a **Code Architecture Freeze** to pivot entirely from "architecture work" to "product delivery." 

The following rules are now enforced:

1. **No folder restructuring:** The location of shared, kernel, infrastructure, and modules must not change.
2. **No layer restructuring:** The strict hierarchy (`Presentation -> Application -> Domain -> Infrastructure`) must be preserved and never bypassed.
3. **No dependency direction changes:** Outer layers depend on inner layers. Domain remains pure.
4. **No renaming modules or bounded contexts:** The current set of modules is final for V1. No new modules unless absolutely required for a genuinely new capability that cannot fit.
5. **No architectural refactors:** We will not chase "better abstractions." Code changes should only occur to fix production defects or implement new features within the established patterns.
6. **Event names are frozen forever:** Existing domain events must not be renamed.
7. **DTOs are backward compatible only:** API Contracts and ReadModels must evolve additively.
8. **Database is additive only:** Following ADR-002 and the Database Freeze, all schema migrations are additive. Existing migrations are sealed.
9. **Routing is frozen:** The `public / hybrid / workspace` routing model is fixed.

## Consequences

* **Positive:** Development velocity will increase as we focus entirely on feature implementation (Search, Notifications, Background Processing, Auth polish).
* **Positive:** Onboarding new code or team members is easier with stable conventions.
* **Negative:** If we discover a suboptimal architectural pattern, we must work around it or live with it for V1 unless it causes critical production defects. 

## V1 Focus

From this point forward, effort is exclusively dedicated to delivering the remaining V1 features: Search & Discovery Intelligence, Authentication completion, Notifications, Background processing execution, Admin Backoffice, Testing, and Production Hardening.
