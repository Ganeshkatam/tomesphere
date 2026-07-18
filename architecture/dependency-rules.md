# Dependency Rules & Rationale

This document defines the rationale behind our architectural rules. It provides a durable reference for future contributors to understand *why* these boundaries exist, not just *what* they are.

## Domain Isolation

### Why `Books` cannot depend on `Library`
The `Books` domain represents our global, immutable catalog of literature. It exists independently of any user. The `Library` domain represents a specific user's relationship with books (e.g., "Want to Read", "Currently Reading"). If `Books` depended on `Library`, the global catalog would become coupled to user-specific states, violating the Single Responsibility Principle and making the catalog uncacheable and complex.

### Why `Progress` cannot import `Reader`
The `Progress` domain is responsible for calculating XP, maintaining streaks, and awarding achievements based on generic reading activity. It is designed to be agnostic to *how* that activity occurred. The `Reader` domain tracks specific sessions, highlights, and focus intervals. By keeping `Progress` decoupled from `Reader`, we can easily add new sources of activity (e.g., an audiobook player, or a physical book logger) without ever modifying the `Progress` domain.

### When introducing a new cross-domain dependency is acceptable
Cross-domain dependencies should only be introduced when they reflect a fundamental, unbreakable truth of the business domain. For example, `Library` depends on `Books` because a user cannot add a non-existent book to their library. When a new dependency is proposed, ask: "Can Domain A exist logically without Domain B?" If yes, they should communicate via Domain Events (eventual consistency) or an Application layer orchestrator, rather than a direct import.

## Layer Isolation

### Why Repositories return Aggregates instead of persistence rows
Aggregates enforce business invariants (e.g., "A reading session cannot end before it begins"). If repositories returned raw database rows or Data Transfer Objects (DTOs), the application or presentation layers would be forced to recreate the Aggregate or, worse, implement business logic themselves. By returning Aggregates, the repository guarantees that any data loaded from the database is immediately in a valid, behavior-rich state.

### Why Aggregates should never be passed to the Presentation layer
Aggregates encapsulate state and expose behavior. React components should be purely declarative, rendering data and dispatching actions. If a React component receives an Aggregate, it might accidentally invoke domain logic (e.g., `aggregate.start()`) directly from the UI, bypassing the Application layer (CQRS). Read Models are simple, immutable data structures designed specifically for the UI's needs, preventing this leakage.

### Why UI components cannot be shared across domains
If `Reader`'s presentation layer imports a component from `Profile`'s presentation layer, the UI becomes a monolithic web of dependencies. Changes to how the Profile looks could inadvertently break the Reader experience. Shared components (buttons, cards, layout primitives) must live in a neutral `Shared Kernel` or `Platform/Design System` layer to ensure domains remain modular and independently deployable.

## Shared Kernel Governance

The Shared Kernel is a globally accessible module that all domains can depend on. Because of its global nature, it must be strictly governed to prevent it from becoming a dumping ground for domain logic.

### Allowed in Shared Kernel
- Base structural types (`Entity`, `AggregateRoot`, `ValueObject`, `DomainEvent`)
- Globally unique primitives (`UserId`)
- Infrastructure abstractions (`EventDispatcher`, `Logger`)
- Reusable UI atoms (`Button`, `Card`, `Typography`)

### Forbidden in Shared Kernel
- Domain-specific entities (`Book`, `LibraryBook`, `ReaderSession`)
- Use cases or business processes
- Domain-specific UI layouts

No domain concepts should ever migrate into the kernel. The kernel exists only to provide the foundational tools necessary to build domains, not the business logic itself.
