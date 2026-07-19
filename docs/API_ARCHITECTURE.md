# Tomesphere API Architecture

This document serves as the canonical engineering specification for the Tomesphere Platform. All contributors must adhere to these rules.

## 1. Purpose
This specification defines the strict architectural boundaries, data flows, and design principles required for the Tomesphere V1 API-first platform.

## 2. Architectural Principles
- **API-First**: The frontend is a consumer of the API, just like any third-party mobile or web client would be.
- **Strict Boundaries**: Layers must not leak into each other.
- **Predictable State**: All state mutations are handled explicitly by Application Services.

## 3. ADR-001: Application Boundary Rule
**The frontend is a presentation layer only.**
- **Allowed**: Rendering, Navigation, Local UI state, API/Server Action invocation.
- **Forbidden**: Business rules, Authorization decisions, Persistence, Domain calculations, Direct Supabase client imports outside auth proxy.

## 4. ADR-002: Database Authority Rule
**The live Supabase database is the authoritative persistence model.**
- All schema changes must be driven by migrations.
- Database types are never manually edited; they must be generated via `supabase gen types typescript`.

## 5. ADR-003: Application Service Authority Rule
**Business operations execute exclusively through an Application Service.**
- Server Actions, REST APIs, and background jobs are orchestration layers. They must not contain domain logic or direct repository access.

## 6. Layer Responsibilities
- **Presentation**: UI rendering and user interaction (React components, Pages).
- **Orchestration**: REST API Routes (`app/api/**`) and Server Actions. Handles HTTP, authentication, and request parsing.
- **Application**: Use cases, commands, queries, and transaction boundaries.
- **Domain**: Business entities, value objects, and pure domain rules.
- **Infrastructure**: Database access, Supabase clients, third-party services.

## 7. CQRS (Command Query Responsibility Segregation)
- **Commands**: Mutate state. Typically map to `POST`, `PUT`, `PATCH`, `DELETE`. Returned data should be minimal (e.g., success status, new ID).
- **Queries**: Read state without mutating. Represented via Read Model Repositories.

## 8. Repository Pattern
- All database access is encapsulated behind Repository interfaces.
- Repositories return DTOs or Domain Entities, never raw database types (unless entirely localized).

## 9. DTO Rules
- Only DTOs cross layer boundaries to the Presentation or Orchestration layers.
- Domain Entities must never be returned directly in an API response.

## 10. Mapper Rules
- Mappers translate between Database Models, Domain Entities, and DTOs.
- They must reside in the Application or Infrastructure layers.

## 11. REST API Rules
- Endpoints must be versioned (e.g., `/api/v1/`).
- Use standard HTTP methods and status codes.
- Follow Resource-oriented naming (e.g., `/api/v1/profile`, `/api/v1/library/books`).

## 12. Server Action Rules
- Server Actions must strictly wrap Application Services.
- They must not execute raw SQL or Supabase queries directly.
- They should handle standard application `UseCaseResult` types and map them to UI state.

## 13. Authentication
- Managed via Supabase Auth.
- Endpoints under `/api/v1/auth/` provide the full authentication surface.
- Frontend must exclusively use REST API auth endpoints or a secure auth-proxy, rather than raw Supabase JS auth flows.

## 14. Authorization
- Enforced at the Application Service layer, NOT in the presentation or orchestration layers.
- Row Level Security (RLS) acts as a secondary defense, not a primary application authorization mechanism.

## 15. OpenAPI Generation
- Generated via `@asteasolutions/zod-to-openapi`.
- The `openapi.yaml` file is a **build artifact**. Do not edit it manually.
- Add components (schemas, security) via `registry.registerComponent(...)`.

## 16. Error Handling
- Use a standardized error mapper for API responses.
- Application Services return `UseCaseResult` objects containing explicit error states, which are then mapped to HTTP standard codes (400, 401, 403, 404, 500).

## 17. Versioning
- Major versions are represented in the URL path (`/v1/`).
- Refer to API_LIFECYCLE.md for detailed versioning policies.

## 18. Testing Strategy
- **Unit Tests**: Domain entities and application services.
- **Integration Tests**: Repositories against test databases, REST APIs via supertest.
- **E2E Tests**: Critical user flows.

