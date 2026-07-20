# Architectural Rules

The following rules apply to all tasks and agents working in this repository.

## Database Rules
1. **Supabase MCP is the authoritative database source.** Always verify schema against the live database through Supabase MCP; never assume the schema from TypeScript types or migration files alone.
2. **All schema changes are migration-driven.** Every schema modification must be represented as a migration and tested against the live database before applying.
3. **Generated database types are never manually edited.** Synchronize them automatically using the Supabase MCP `generate_typescript_types` tool.

## ADR-001: Application Boundary Rule
**The frontend is a presentation layer only. It must not contain business rules, domain logic, persistence logic, authorization decisions, or direct database access. All business behavior is implemented in the backend Application and Domain layers and exposed exclusively through versioned APIs or Server Actions via DTOs.**

### Frontend
**Allowed:** Rendering, Navigation, Local UI state, Form state, API invocation, Server Action invocation.
**Forbidden:** Business rules, Authorization decisions, Persistence, Domain calculations, Repository access, Direct Supabase access, Domain entities.

### Backend
**Owns:** Authentication, Authorization, Validation, Application Services, Commands, Queries, Domain logic, Repositories, Audit, Events.

### Contracts
Only DTOs cross boundaries. No domain entity may leave the backend.

## ADR-002: Database Authority
**The live Supabase database, inspected through the Supabase MCP, is the authoritative persistence model.**

**Consequences:**
- No manual database types.
- No speculative schema changes.
- Every schema change begins with MCP verification.
- Every schema change ends with regenerated types.
- Application repositories must remain synchronized with the live schema.

## ADR-003: Application Service Authority
**Every business operation must execute through an Application Service. Server Actions, REST API routes, scheduled jobs, CLI tools, and future integrations are orchestration layers only. They may not contain business rules or persistence logic.**

## Supabase Import Rule
**No React component, custom hook, or client-side utility may import `@supabase/supabase-js` or `@supabase/ssr` (unless it's the auth middleware/proxy).**
The only places that may interact with Supabase are:
- Repository implementations
- Authentication infrastructure
- Proxy/middleware for session management
- Database migration and administrative tooling

## ADR-004: Architectural Freeze
**No new bounded contexts, architectural layers, naming conventions, or dependency directions may be introduced during V1 unless required to fix a correctness or production issue. New work must integrate into the existing architecture.**

## ADR-005: Public Route Topology Freeze
**The public route topology for V1 is frozen. No new top-level routes may be introduced without architectural justification.**

**Consequences:**
- Discovery routes are canonical destinations.
- Filters belong in query parameters.
- Authentication routes are fixed.
- Workspace routes map to bounded contexts.
- Reader remains a standalone application shell.
- Admin evolves independently from the public app.
