# ADR 0003: Repository Pattern and Persistence Isolation

## Status

Accepted

## Context & Problem

Currently, Next.js Server Actions directly query Supabase across all modules.

```text
Page
  ↓
Action
  ↓
Supabase (Direct queries: .from('books').select('*'))
```

This couples our application layer directly to the database schema, making it difficult to test, refactor, or migrate persistence layers. It also causes raw persistence types (e.g., `Database['public']['Tables']['books']['Row']`) to leak into the presentation layer, creating tight coupling across the entire codebase.

## Decision

We will introduce the **Repository Pattern** and isolate persistence logic entirely within the `infrastructure` layer.

1. **Domain Interfaces:** The `domain/repositories` folder defines interfaces in plain business language (e.g., `findById(id: BookId)`). _Repositories represent business capabilities, not database tables._ If a capability (like Recommendations) naturally diverges, it receives its own repository.
2. **Domain Entities:** Repositories must return rich `Domain Entities` or `Value Objects` (e.g., `BookId`), never raw database rows.
3. **Infrastructure Models:** Raw database types live strictly in `infrastructure/models/` (e.g., `BookRow.ts`). No persistence types may cross the repository boundary.
4. **Mappers:** The `infrastructure/mappers` layer translates database row models into domain entities bidirectionally (`toDomain()`, `toPersistence()`).
5. **Implementation:** The concrete repository lives in `infrastructure/` and uses Supabase under the hood.

### After Dependency Graph

```text
Page
  ↓
Action / Application Use Case
  ↓
Repository Interface (Domain Layer)
         ↑
Infrastructure Repository (Infrastructure Layer)
         ↓
Mapper
         ↓
Supabase
```

## Alternatives Considered

### Why not Active Record?

We explicitly reject the Active Record pattern (e.g., `BookRow.save()`). Active Record inherently couples domain business logic with database persistence mechanisms. By separating `Repository -> Mapper -> Entity`, we ensure our Domain objects remain pure and completely oblivious to Supabase.

### Direct Supabase ORM (Prisma/Drizzle)

Rejected because it still couples the application to a specific ORM schema across layers. We want pure domain objects passed to the application.

## Consequences

- **Positive:** Application layer is completely isolated from Supabase. Easy to test mapping and contract implementations independently.
- **Negative:** Requires writing boilerplate (Entities, Value Objects, Mappers, Interfaces) for every database table we want to access.
- **Composition Note:** For Phase 3, we manually instantiate repositories inside actions (e.g., `new SupabaseBookRepository(client)`). This is a temporary stepping stone. In Phase 5, we will introduce a centralized Composition Root close to the framework boundaries.
- **Rules Enforced:**
  - `application` must NOT import from `supabase`.
  - `presentation` must NOT import from `infrastructure`.
  - `domain` must NOT import from `infrastructure`.
