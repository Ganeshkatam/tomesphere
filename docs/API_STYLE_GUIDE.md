# TomeSphere API Style Guide

This document defines the conventions for designing and implementing the TomeSphere REST API. All endpoints must adhere to these rules to ensure a consistent experience across clients (Web, Mobile, Desktop, CLI).

## URL Conventions

1.  **Base Path:** All API routes must be versioned and placed under `/api/v1/`.
2.  **Resource Naming:** Use plural nouns for resources (e.g., `/books`, `/highlights`).
3.  **Kebab Case:** Use kebab-case for URL segments (e.g., `/api/v1/reading-sessions`).
4.  **Hierarchy:** Nest resources only when they strictly belong to the parent (e.g., `/books/[id]/highlights`). Avoid nesting deeper than two levels.
5.  **Actions:** For non-CRUD operations, treat the action as a sub-resource or use verbs sparingly (e.g., `POST /api/v1/auth/login`).

## HTTP Verbs

-   **GET:** Retrieve a resource or list of resources. Must be idempotent and safe.
-   **POST:** Create a new resource or execute a complex command.
-   **PUT:** Fully replace an existing resource (requires full payload).
-   **PATCH:** Partially update an existing resource (requires only changed fields).
-   **DELETE:** Remove a resource.

## Standardized Responses

All endpoints must return a standardized JSON envelope. No endpoint may invent its own response format.

### Success Response (2xx)
```json
{
  "success": true,
  "data": { ... } // Or an array []
}
```

### Error Response (4xx, 5xx)
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

## Status Codes

-   `200 OK`: Successful GET, PUT, PATCH, or DELETE.
-   `201 Created`: Successful POST that created a resource.
-   `204 No Content`: Successful request with no body (often used for DELETE).
-   `400 Bad Request`: Validation failure or malformed request.
-   `401 Unauthorized`: Missing or invalid authentication token.
-   `403 Forbidden`: Authenticated, but lacks permission for the resource.
-   `404 Not Found`: Resource does not exist.
-   `409 Conflict`: Business rule violation (e.g., resource already exists).
-   `429 Too Many Requests`: Rate limit exceeded.
-   `500 Internal Server Error`: Unexpected backend failure.

## Authentication

External API clients must authenticate using a Bearer token:
`Authorization: Bearer <Supabase_JWT>`

The API platform will extract and validate this token using the shared Application Services.

## Versioning Governance

1.  **Current Version:** `/api/v1`
2.  **No Breaking Changes:** Once an endpoint is in `v1`, we only allow additive changes (e.g., adding new optional fields to the request or new fields to the response).
3.  **Next Version:** Any breaking change (removing a field, changing a type, altering core behavior) requires creating `/api/v2`.

## Pagination, Filtering, and Sorting

-   **Pagination:** Use `?limit=20&offset=0` for offset pagination or `?cursor=xyz&limit=20` for cursor pagination.
-   **Filtering:** Use query parameters matching the field name (e.g., `?genre=fantasy`).
-   **Sorting:** Use `?sort=created_at&order=desc`.

## Request Validation

All API request bodies and query parameters must be validated using **Zod** before hitting the Application Layer. Validation failures should return a `400 Bad Request` with an array of specific field errors in the standard error envelope (if applicable).
