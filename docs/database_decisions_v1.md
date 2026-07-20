# TomeSphere V1 Architecture Decision Record (ADR)

**Database Version**: V1.0  
**Status**: Frozen  

This document logs the architectural decisions that shaped the V1 schema to prevent future contributors from questioning or reverting intentional omissions.

## 1. Why `user_statistics` is a projection instead of an event store

**Decision:** We aggregate user reading metrics (books completed, pages read, current streak) into a materialized projection (`user_statistics`).
**Reason:** Querying thousands of reading progress events or session records on every page load to calculate a user's reading streak is prohibitively expensive. By making it a projection updated asynchronously via the Outbox pattern, the frontend gets instant read performance (O(1)).

## 2. Why `discovery_search_documents` is event-driven and flattened

**Decision:** The search catalog is completely flattened into a single table `discovery_search_documents` that stores title, authors (ARRAY), categories (ARRAY), and pre-computed FTS tokens.
**Reason:** Joining `books`, `authors`, `book_authors`, `genres`, and `book_genres` to execute a search query is slow and scales poorly. Search requires lightning-fast retrieval. Flattening it via projection workers creates an optimized read model. 

## 3. Why `reading_progress` replaced `reader_positions`

**Decision:** The concept of "positions" was replaced with `reading_progress` which contains a `location_anchor` (JSONB).
**Reason:** The term "progress" accurately represents the domain boundary for saving state across EPUB, PDF, and future formats. A JSONB anchor prevents the database schema from being tightly coupled to EPUB CFI strings or PDF page numbers.

## 4. Why Outbox & Jobs are generic Infrastructure

**Decision:** We maintain `outbox_events`, `job_queue`, `job_failures`, and `processed_events`.
**Reason:** Using Supabase, functions/triggers can fail due to network timeouts. Tying business logic synchronously to database triggers risks data loss. The Outbox guarantees "at least once" delivery, and generic job queues ensure we don't invent a bespoke retry mechanism for every feature (like Exports or Search Rebuilds).

## Deferred to V2

The following capabilities were explicitly designed out of the V1 database to focus entirely on a core "Public-first" reading and discovery experience. 

- **Achievements & Gamification**: Deferred to focus on core catalog and reading.
- **AI Recommendations**: Relying on simple popularity/FTS over vector embeddings for now.
- **Reading Clubs / Social Features**: Deferred; current interactions are strictly single-player.
- **Study Plans / Flashcards**: Dropped to avoid diluting the product from a reading platform into an EdTech tool too early.
- **Multi-tenancy / Publishers**: Admin dashboard supports only global administrators for V1.
- **Elasticsearch / OpenSearch**: We chose Postgres `pg_trgm` and `tsvector` FTS to reduce operational overhead for V1.

Any structural database migrations added post-V1 should introduce these *new* product capabilities, rather than structurally rewriting V1 tables.
