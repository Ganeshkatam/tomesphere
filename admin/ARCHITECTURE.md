# Admin Application Architecture

This application provides the backoffice editorial interface for TomeSphere.

## Cross-Application Compatibility Governance

As the codebase expands to include multiple applications (the public Next.js app and this admin Next.js app) backed by the same shared platform (`modules/` and `shared/`), the following governance principles apply:

1. **Dependency Direction**
   - Applications (`tomesphere-app/src`, `admin/src`) depend on shared modules (`modules/`, `shared/`).
   - Shared modules **must never** depend on applications. They must remain application-agnostic.
   
2. **Adapter Boundary**
   - Widespread cross-application imports (e.g., `import { CreateBookHandler } from "../../../../modules/..."`) are prohibited in UI code.
   - All imports from the shared platform must pass through the **adapter layer** located in `admin/src/lib/domain/`.
   - Adapter files are the only location where application-specific relative import paths are defined.
   - When the repository transitions to a monorepo workspace in V2, only the adapter layer needs to update its import paths to `@tomesphere/...`.

3. **Presentation Layer Responsibility**
   - UI code must never leak into shared modules.
   - Server Actions are orchestration layers only. They orchestrate application services (commands/queries); they **do not** implement business rules or persistence logic.
   - Direct database access (e.g., Supabase queries) from Server Actions is prohibited.

4. **Domain and Persistence Logic**
   - Domain behavior belongs in aggregates, domain services, or application services.
   - Repositories encapsulate all persistence logic. Even lightweight CRUD entities like Authors or Genres must route mutations through Application Services down to Repositories.

Following these rules ensures the TomeSphere platform remains stable and reusable as new applications are introduced.
