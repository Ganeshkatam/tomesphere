# ADR-0005: Event-Driven Bounded Context Integration

## Status

Approved

## Context

TomeSphere is a modular monolith. Bounded contexts need to communicate with one another (e.g. Catalog changes need to update Search indices; Reader actions need to trigger XP awards in Progress and update affinity signals in Recommendations). Direct inter-context orchestration leads to high coupling and circular dependencies. We need a decoupled event-driven integration mechanism that is robust, testable, and preserves modular boundary safety.

## Decision

We introduce an internal, in-process Event Bus and Event Dispatcher in the Shared Kernel. Bounded contexts communicate purely by emitting and subscribing to immutable `DomainEvent` objects, replacing direct inter-context coordination for event-driven integration.

```text
Aggregate
    │
    ├── record(DomainEvent)
    │
    ▼
Repository.save() (Persistence only)
    │
    ▼
Database Commit (Publishing invariant: Only committed state may generate published events)
    │
    ▼
DomainEventPublisher.publish(aggregate)
    │
    ├── collectDomainEvents()
    ├── EventBus.publish()
    └── clearDomainEvents()
                │
                ▼
         InProcessEventBus
                │
                ▼
         EventDispatcher (resolves handlers from EventRegistry)
                │
         EventEnvelope (metadata, tracing)
                │
                ▼
         EventModule Handlers (Search, Recommendations, Progress)
```

### Architectural Invariants

1. Aggregates record domain events only.
2. Repositories never publish events.
3. Only committed state may generate published events.
4. Domain events never depend on infrastructure.
5. Projection builders are deterministic and side-effect free.
6. Event handlers never communicate directly with other bounded contexts.
7. Event publication is synchronous and sequential during Phase 8B.
8. Event transport may change without modifying domain or application contracts.

### Core Design Rules

1. **Purity of Bounded Contexts**: Bounded contexts emit events and do not know about their subscribers. Bounded context domain layers only know about `DomainEvent`s; transport/messaging structures (`EventBus`, `EventEnvelope`, `EventHandler`) reside in the Shared Kernel's Application layer.
2. **Persistence Isolation**: Repositories only handle persistence. A dedicated `DomainEventPublisher` application service collects, dispatches, and clears events from the aggregate _only_ after a successful database transaction commit.
3. **Immutability & Generic IDs**: `DomainEvent` is generic over `<TAggregateId = string>` and is entirely read-only.
4. **Envelopes and Metadata**: Raw events are wrapped in an `EventEnvelope` containing operational/tracing metadata (`correlationId`, `causationId`, `publishedAt`) without polluting the domain.
5. **Stateless Projection Builders**: Handlers delegate to stateless `ProjectionBuilder` instances that transform events to read models, keeping query/read models cleanly detached.
6. **Execution Semantics**:
   - Execution is **synchronous** and **sequential** within the same in-process thread.
   - FIFO ordering is guaranteed for events emitted by a single aggregate within the same transaction.
   - Handlers execute sequentially in registration order.
   - Diagnostics are **observational only**. Handlers return `Promise<void>` and the dispatcher handles telemetry/timing record-keeping asynchronously.
7. **Error Propagation**:
   - Handler exceptions halt execution of subsequent handlers.
   - The exception propagates back to `DomainEventPublisher`.
   - The failure is logged with diagnostics.
   - Previously committed database state is **not** rolled back (as publishing happens post-commit).
8. **Module Registry & Lifecycles**: Every context implements `EventModule` exposing `registerEventHandlers(registry)`. The `EventRegistry` is frozen after modules register their handlers during application startup.

## Consequences

- **Loose Coupling**: Contexts are fully decoupled. Adding notifications or analytics in future phases requires subscribing to existing events without altering producing aggregates.
- **Outbox Preparedness**: The decoupling of `DomainEventPublisher` and `EventBus` provides a direct migration path to Outbox patterns and external brokers (Kafka, RabbitMQ) in the future without changing domain logic.
