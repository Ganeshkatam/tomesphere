# TomeSphere API Error Catalogue

This catalogue defines the standard error codes returned by the TomeSphere API. All API error responses must use a code from this list.

If a new business rule requires a distinct error, it must be added here before implementation.

## Common & Infrastructure Errors

| Error Code | HTTP Status | Description |
| :--- | :--- | :--- |
| `BAD_REQUEST` | 400 | Malformed JSON or invalid request format. |
| `VALIDATION_FAILED` | 400 | Zod schema validation failed on input data. |
| `AUTH_REQUIRED` | 401 | Missing authentication token. |
| `AUTH_INVALID_TOKEN` | 401 | The provided token is expired, revoked, or invalid. |
| `AUTH_FORBIDDEN` | 403 | User lacks the required role or permission (e.g., non-admin accessing admin route). |
| `RESOURCE_FORBIDDEN` | 403 | User does not own or have access to this specific resource. |
| `NOT_FOUND` | 404 | The requested endpoint or generic resource does not exist. |
| `RATE_LIMITED` | 429 | The client has exceeded the allowed request quota. |
| `INTERNAL_ERROR` | 500 | An unexpected system error occurred. |

## Library & Reader Errors

| Error Code | HTTP Status | Description |
| :--- | :--- | :--- |
| `BOOK_NOT_FOUND` | 404 | The specified book ID does not exist. |
| `BOOK_ALREADY_EXISTS` | 409 | Attempting to add a book to the library that is already present. |
| `HIGHLIGHT_NOT_FOUND` | 404 | The specified highlight does not exist. |
| `INVALID_LOCATION` | 400 | The epub/pdf anchor location is malformed. |
| `READING_SESSION_CLOSED` | 409 | Attempting to update a reading session that has already been finished. |

## Profile & Auth Specific Errors

| Error Code | HTTP Status | Description |
| :--- | :--- | :--- |
| `ACCOUNT_LOCKED` | 403 | Account temporarily locked due to brute force attempts. |
| `EMAIL_IN_USE` | 409 | Attempting to sign up or change email to one that already exists. |
| `INVALID_CREDENTIALS` | 401 | Incorrect email or password during login. |
| `MFA_REQUIRED` | 401 | Action requires Multi-Factor Authentication completion. |

## Progress & Goals Errors

| Error Code | HTTP Status | Description |
| :--- | :--- | :--- |
| `GOAL_ALREADY_EXISTS` | 409 | A reading goal for this period/type already exists. |
| `INVALID_GOAL_TARGET` | 400 | The goal target value is zero, negative, or unachievable. |
