# Tomesphere API Lifecycle

This document defines the lifecycle, versioning, and stability guarantees for the Tomesphere Platform APIs.

## 1. API Versioning
- All REST APIs are versioned using URL path versioning (e.g., `/api/v1/`).
- The version number indicates the major version (e.g., `v1`, `v2`).
- Minor additive changes do not increment the version number.

## 2. Backward Compatibility
The following changes are considered **backward-compatible** and may be introduced in the current version at any time:
- Adding new endpoints.
- Adding new optional request parameters.
- Adding new properties to response payloads.
- Changing the order of properties in JSON responses.
- Changing error message text (but not the underlying error codes).

## 3. Breaking-Change Policy
The following changes are considered **breaking** and require a new major version (e.g., `v2`):
- Removing or renaming an endpoint.
- Removing or renaming a request parameter or response property.
- Changing the data type of a parameter or property (e.g., from integer to string).
- Adding a new **required** request parameter.
- Changing authentication mechanisms.

## 4. Deprecation Policy
- Before an endpoint or feature is removed, it must be officially deprecated for a minimum of **6 months**.
- Deprecated endpoints must include a `Deprecation` header in responses.
- Documentation (OpenAPI) must clearly mark the endpoint as `deprecated: true`.

## 5. Endpoint Naming
- Use lowercase names, separated by hyphens (kebab-case) for paths.
- Use plural nouns for collections (e.g., `/users`, `/books`).
- Do not use verbs in resource paths (e.g., use `POST /books`, not `/create-book`), except for specific actions (e.g., `/auth/login`).

## 6. Release Process
1. **Design**: Draft OpenAPI schema changes.
2. **Implementation**: Code changes via PR.
3. **Validation**: CI runs `tsc`, `npm run build`, and `npm run test` (including OpenAPI generation).
4. **Deployment**: Deployed via CI/CD pipelines. Ensure zero-downtime database migrations are executed beforehand.

