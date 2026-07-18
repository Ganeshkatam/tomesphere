# Dependency Map

This is the canonical reference for allowed and forbidden architectural dependencies within TomeSphere. It visualizes the strict boundaries enforced statically by `dependency-cruiser`.

## Domain Dependencies

Domains must remain isolated. They cannot query or command each other directly to prevent tight coupling.

### Allowed

Specific cross-domain dependencies are explicitly allowed when they model a fundamental truth of the business (e.g. tracking progress against a catalog of books).

```text
Reader
  ↓
Books
```
*(Reader may import BookId or Book metadata from the Books domain, as Books represents an immutable external catalog).*

### Forbidden

Strict isolation ensures unrelated concepts do not couple over time.

```text
Reader
  ✕
Profile
```
*(Reading experience has nothing to do with identity).*

```text
Progress
  ✕
Reader
```
*(Progress consumes generic reading activities; it does not know what a "Reader Session" or "Highlight" is).*

```text
Books
  ✕
Library
```
*(The catalog does not know whether a user has added a book to their library).*

### Cross-cutting

Shared foundational types and utilities.

```text
Reader
  ↓
Shared Kernel
```
*(All domains may depend on the Shared Kernel for primitive types and standard infrastructure).*


## Layer Dependencies

We adhere to a strict top-down structure per bounded context.

### Allowed
```text
Presentation
  ↓
Application
  ↓
Domain
  ↓
Shared Kernel
```

```text
Infrastructure
  ↓
Domain
```
*(Infrastructure implements the domain's repository interfaces).*

### Forbidden
```text
Domain
  ✕
Infrastructure
```
*(Domain is pure. It cannot import database clients or generated type schemas).*

```text
Application
  ✕
Presentation
```
*(Orchestration has no concept of React components or HTTP request formats).*

```text
Application
  ✕
Infrastructure (Supabase Client)
```
*(Application relies on Repository interfaces. Dependency injection or factory methods instantiate the infrastructure).*

## Read Models & UI

React components consume Read Models, never Aggregates.

### Allowed
```text
Presentation
  ↓
ReadModel
  ↓
Application
```

### Forbidden
```text
Presentation
  ✕
Aggregate
```
*(Aggregates should never become React props. This prevents UI code from accidentally depending on domain behavior).*

## Presentation Isolation

UI coupling is a common failure point in Next.js applications.

### Forbidden
```text
Reader Presentation
  ✕
Profile Presentation
```
*(A React component in the Reader domain must not import a React component from the Profile domain. Shared UI components must live in the platform/shared design system).*
