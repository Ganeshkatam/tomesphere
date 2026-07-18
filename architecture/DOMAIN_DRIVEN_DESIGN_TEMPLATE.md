# Domain-Driven Design Module Template

This document defines the canonical architecture for all bounded contexts (modules) in TomeSphere. It explains **why** we structure code this way. For a practical starting point, copy the `templates/bounded-context/` directory.

## Dependency Graph

The golden rule of our architecture is that dependencies point inward toward the Domain.

```text
Presentation
    ↓
Application
    ↓
Domain
    ↑
Infrastructure
```

- **Presentation (UI)** can depend on Application and Domain, but never Infrastructure.
- **Application** depends on Domain. It orchestrates use cases.
- **Domain** depends on *nothing*. It contains pure business logic and interfaces.
- **Infrastructure** depends on Domain. It implements the interfaces defined by the Domain.

> [!CAUTION]
> **Never import Supabase, database types, or network libraries into the Domain or Application layers.**

## Module Maturity Levels

Not every feature needs a full DDD implementation on day one. We use a maturity model to prevent overengineering:

- **Level 0 (UI Only)**: Just Presentation components.
- **Level 1 (Smart UI)**: Presentation + inline logic (e.g., direct Supabase calls in Server Actions). Acceptable for prototypes.
- **Level 2 (Transaction Script)**: Presentation + Application (Use Cases). Good for orchestrating complex API calls without rich domain behavior.
- **Level 3 (Full DDD)**: Presentation + Application + Domain + Infrastructure. Required for core business domains (e.g., Books, Library, Reader) where invariants and business rules must be protected.

## Checklists

Use these checklists to design your building blocks correctly.

### 1. Aggregate Root Checklist
Does this entity deserve to be an Aggregate Root?
- [ ] Does it own business invariants that must be protected?
- [ ] Does it own transactional consistency for a boundary?
- [ ] Does it raise domain events?
- [ ] Are its parts always persisted together?
*If yes → Aggregate Root. If no → Entity or Value Object.*

### 2. Repository Checklist
Are you designing a Repository interface correctly?
- [ ] Is it named after a business capability (e.g. `BookRepository`), not a table?
- [ ] Are persistence details (e.g., Supabase) completely hidden?
- [ ] Does it take and return Domain Models (Entities/Aggregates), never database rows?
- [ ] Are query parameters encapsulated in request objects instead of exposing SQL concepts?

### 3. Use Case Checklist
Are you writing a clean Application Use Case?
- [ ] Is it a pure function (or class) with a single public method?
- [ ] Does it only orchestrate (validate -> fetch -> act -> save)?
- [ ] Is it completely free of persistence logic or SQL?
- [ ] Does it return application-specific Outputs instead of leaking Domain Models directly to the UI?
