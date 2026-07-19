# Module Lifecycle

To prevent over-engineering, TomeSphere adopts a progressive enhancement lifecycle for modules. Not every feature needs to be a fully isolated Domain-Driven Design bounded context (Level 3). Modules should naturally evolve through these levels based on their technical requirements.

## Level 0: Pure UI (Component)

A feature that exists entirely in the presentation layer and has no persistence or complex state.

- **Criteria**: Needs persistence? **No**.
- **Example**: A dynamic theme toggle, a complex animation, or a local state calculator.
- **Structure**: Just React components and hooks in `components/` or `app/`.

## Level 1: Platform Service (CRUD)

A feature that needs basic persistence but involves no complex business logic. It's essentially a UI form saving data to the database.

- **Criteria**: Needs complex validation or cross-entity rules? **No**.
- **Example**: User settings (dark/light mode), basic notifications, or a simple contact form.
- **Structure**:
  - `presentation/` (UI Components)
  - `actions/` (Next.js Server Actions calling Supabase directly)
  - No domain models; relies directly on `types/database.ts`.

## Level 2: Application Service (Integration)

A feature that orchestrates multiple external systems or requires infrastructure abstraction, but still lacks rich internal domain logic.

- **Criteria**: Needs external integrations or complex orchestration? **Yes**.
- **Criteria**: Has complex invariant rules protecting state? **No**.
- **Example**: Sending an email via SendGrid, uploading processing files to S3, or integrating with Stripe.
- **Structure**:
  - `application/` (Service Classes/Functions)
  - `infrastructure/` (SendGridClient, StripeClient)
  - `presentation/`
  - Still no strict Domain layer, just data transfer objects.

## Level 3: Bounded Context (Domain-Driven Design)

A feature where the primary complexity is business logic, state mutations, and rule invariants. The database is merely an implementation detail to store the domain state.

- **Criteria**: Are there complex business rules that must never be violated? **Yes**.
- **Criteria**: Do multiple actions mutate the same underlying conceptual state? **Yes**.
- **Example**: `Books`, `Library`, `Profile`, `Progress`, `Reader`.
- **Structure**:
  - `domain/` (Aggregates, Entities, Value Objects, Policies)
  - `application/` (CQRS: Commands/Queries orchestrating the domain)
  - `infrastructure/` (Repositories wrapping the database)
  - `presentation/` (UI strictly consuming Read Models and dispatching Commands)

## Evolution Example

**User Profiles**:

1. Started as Level 1 (Directly updating `profiles` table from a settings page).
2. Upgraded to Level 3 when we realized `UserProfile` identity needed to be decoupled from gamification (`UserProgress`) and strictly validated, requiring an Aggregate Root to protect its invariants.
