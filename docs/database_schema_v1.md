# TomeSphere V1 Database Schema

**Database Version**: V1.0  
**Status**: Frozen  
**Date**: 2026-07-19  
**Migration**: `20260719080000_v1_database_freeze.sql`

## Naming Conventions & Constraints
- **Tables and Columns**: `snake_case`
- **Events**: namespaced paths (e.g., `catalog.book.published`)
- **DTOs and Aggregates**: `PascalCase`
- **Read Models**: `Supabase[X]ReadModel`
- **Repositories**: `[X]Repository`
- **Projections**: `[X]Indexer` or `[X]Projector`
- **Primary Keys**: Every table uses a `UUID` primary key (except for explicit join tables like `book_authors` or idempotency tables like `processed_events`).
- **Timestamps**: Every table has `created_at`. Mutable tables also have `updated_at`.
- **Foreign Keys**: Foreign keys specify explicit cascade behaviors (no implicit defaults).
- **Deletes**: Hard deletes are used by default unless soft deletes are strictly required by business logic.

---

## Domain Ownership

| Table | Owner |
|-------|-------|
| `books` | Catalog |
| `authors` | Catalog |
| `publishers` | Catalog |
| `series` | Catalog |
| `genres` | Catalog |
| `subjects` | Catalog |
| `book_authors` | Catalog |
| `book_genres` | Catalog |
| `book_subjects` | Catalog |
| `book_files` | Catalog |
| `book_assets` | Catalog |
| `discovery_search_documents` | Discovery |
| `discovery_autocomplete_documents` | Discovery |
| `featured_books_projection` | Discovery |
| `popular_books_projection` | Discovery |
| `new_arrivals_projection` | Discovery |
| `search_history` | Discovery |
| `trending_searches` | Discovery |
| `library_items` (or `library_books`) | Library |
| `shelves` | Library |
| `shelf_items` | Library |
| `reading_sessions` | Reader |
| `reading_progress` | Reader |
| `bookmarks` | Reader |
| `highlights` | Reader |
| `annotations` | Reader |
| `reading_goals` | Reader |
| `user_statistics` | Reader |
| `profiles` | Account |
| `user_preferences` | Account |
| `export_requests` | Account |
| `announcements` | Public Content |
| `faqs` | Public Content |
| `pages` | Public Content |
| `outbox_events` | Infrastructure |
| `job_queue` | Infrastructure |
| `job_failures` | Infrastructure |
| `notifications` | Infrastructure |
| `projection_checkpoints` | Infrastructure |
| `processed_events` | Infrastructure |

---

## Tables & Columns

*(For brevity, standard UUID id, created_at, updated_at are omitted unless noteworthy).*

### Catalog Domain
- **`books`**: `title`, `description`, `release_date`, `cover_url`, `isbn`, `pages`, `publisher`, `language`, `is_featured`, `is_textbook`, `edition`, `total_pages`, `hash`.
- **`authors`**: `name`, `slug`, `bio`, `avatar_url`.
- **`publishers`**: `name`, `slug`, `website`.
- **`series`**: `name`, `slug`, `description`.
- **`genres` / `subjects`**: `name`, `slug`, `description`, `icon`.
- **`book_files`**: `book_id`, `format`, `storage_path`, `checksum`, `mime_type`, `size`, `version`, `is_primary`.
- **`book_assets`**: `book_id`, `asset_type`, `asset_url`.
- Join Tables: `book_authors`, `book_genres`, `book_subjects`.

### Discovery Domain
- **`discovery_search_documents`**: `book_id`, `title`, `subtitle`, `authors`, `categories`, `language`, `description`, `keywords`, `publication_year`, `availability_status`, `popularity_score`, `rating`, `cover_url`, `download_count`, `fts_tokens`, `projection_version`, `indexed_at`, `indexed_by`, `source_updated_at`.
- **`discovery_autocomplete_documents`**: `query`, `score`, `projection_version`, `indexed_at`, `indexed_by`, `source_updated_at`.
- **Projections**: `featured_books_projection`, `popular_books_projection`, `new_arrivals_projection`.
- **`search_history`**: `user_id`, `query`, `normalized_query`, `searched_at`, `clicked_document_id`, `result_count`.
- **`trending_searches`**: `normalized_query`, `search_count`, `last_executed`.

### Library Domain
- **`library_books`**: `user_id`, `book_id`, `status` (Enum: `want_to_read`, `reading`, `read`), `queue_order`, `added_at`.
- **`shelves`**: `user_id`, `name`, `description`, `is_public`, `cover_image`.
- **`shelf_items`**: `shelf_id`, `book_id`, `position`, `added_at`.

### Reader Domain
- **`reading_sessions`**: `user_id`, `book_id`, `current_page`, `total_pages`, `percentage`, `started_at`, `last_read_at`, `finished_at`, `reading_time_minutes`.
- **`reading_progress`**: `user_id`, `book_id`, `location_anchor` (JSONB), `last_read_at`.
- **`bookmarks`**: `user_id`, `book_id`, `page_number`, `label`.
- **`highlights`**: `user_id`, `book_id`, `location_anchor` (JSONB), `selected_text`, `color`.
- **`annotations`**: `user_id`, `book_id`, `highlight_id`, `location_anchor` (JSONB), `body_markdown`.
- **`reading_goals`**: `user_id`, `goal_type`, `target_value`, `current_value`, `year`, `start_date`, `end_date`, `is_active`.
- **`user_statistics`**: `user_id`, `books_completed`, `books_started`, `pages_read`, `minutes_read`, `current_streak`, `longest_streak`.

### Account Domain
- **`profiles`**: `id` (matches auth.users), `display_name`, `avatar_url`, `bio`, `location`.
- **`user_preferences`**: `user_id`, `theme`, `reader_theme`, `font_family`, `font_size`, `line_height`, `dictionary_language`.
- **`export_requests`**: `user_id`, `status` (Enum), `download_url`, `requested_at`, `queued_at`, `completed_at`, `expires_at`, `error_message`.

### Public Content
- **`announcements`**: `title`, `content`, `type`, `link_url`, `link_text`, `is_dismissible`, `is_active`, `starts_at`, `ends_at`.
- **`faqs`**: `question`, `answer`, `category`, `display_order`.
- **`pages`**: `slug`, `title`, `content`, `published_at`.

### Infrastructure Domain
- **`outbox_events`**: `aggregate_type`, `aggregate_id`, `event_type`, `event_version`, `payload` (JSONB), `occurred_at`, `status`, `retry_count`, `last_error`, `processed_at`.
- **`job_queue`**: `job_type`, `payload` (JSONB), `status`, `attempts`, `scheduled_at`, `started_at`, `completed_at`, `last_error`.
- **`job_failures`**: `job_type`, `payload` (JSONB), `error`, `failed_at`, `retry_count`, `worker`, `stack_trace`.
- **`notifications`**: `user_id`, `type`, `title`, `body`, `metadata` (JSONB), `read_at`.
- **`projection_checkpoints`**: `projection_name`, `last_processed_event_id`.
- **`processed_events`**: `event_id`, `handler`, `processed_at`, `duration_ms` (Primary Key: `event_id, handler`).

---

## RLS Matrix (Security Contract)

| Domain | SELECT | INSERT | UPDATE | DELETE |
|--------|--------|--------|--------|--------|
| **Catalog** | Public Read | Service Role | Service Role | Service Role |
| **Discovery** | Public Read | Service Role | Service Role | Service Role |
| **Public Content** | Public Read | Service Role | Service Role | Service Role |
| **Profiles** | Public Read | Owner | Owner | Service Role |
| **Library** | Owner | Owner | Owner | Owner |
| **Reader** | Owner | Owner | Owner | Owner |
| **Preferences** | Owner | Owner | Owner | Owner |
| **Notifications** | Owner | Service Role | Owner | Owner |
| **Export Requests** | Owner | Owner | Service Role | Service Role |
| **Infrastructure** | Service Role | Service Role | Service Role | Service Role |

*(Note: "Owner" implies `auth.uid() = user_id`. "Service Role" implies `auth.role() = 'service_role'`.)*

---

## Standardized Event Contracts

Events emitted via `outbox_events`:
- `catalog.book.published`
- `catalog.book.updated`
- `reader.progress.updated`
- `reader.session.completed`
- `reader.highlight.created`
- `library.book.added`
- `account.export.requested`

---

## Enums & Extensions

### Enums
- `reading_status`: `want_to_read`, `reading`, `read`
- `export_request_status`: `requested`, `processing`, `completed`, `failed`

### Extensions
- `pg_trgm`: Text search and fuzzy matching.
- `pgcrypto`: Generating hashes and UUIDs.
- `uuid-ossp`: Advanced UUID generation.
- `unaccent`: Removing accents for robust text search.
- `vector` (Reserved): Installed for potential V2 semantic search/recommendation workloads.

---

## Index Inventory

| Table | Index | Columns | Purpose |
|-------|-------|---------|---------|
| `books` | `idx_books_title_trgm` | `title` | Autocomplete & Fuzzy Search |
| `discovery_search_documents` | `idx_discovery_search_fts` | `fts_tokens` | Full Text Search Ranking |
| `reading_progress` | `idx_reading_progress_user_book` | `user_id`, `book_id` | Fast progress lookups for Library UI |
| `outbox_events` | `idx_outbox_status_occurred` | `status`, `occurred_at` | Efficient polling by outbox relay |
| `job_queue` | `idx_job_queue_status_scheduled` | `status`, `scheduled_at` | Efficient polling by background workers |
| `search_history` | `idx_search_history_user_time` | `user_id`, `searched_at` | Recent searches for Discovery |

---

## Trigger Inventory

| Trigger | Table | Purpose | Function |
|---------|-------|---------|----------|
| `on_auth_user_created` | `auth.users` | Create profile and preferences on sign up | `handle_new_user()` |
| `after_book_publish` | `books` | Emit `catalog.book.published` event to outbox | `emit_book_event()` |

---

## RPC / Function API Surface

The Database API is strictly categorized to prevent coupling.

### Public RPCs (Exposed to Client)
- `search_catalog(query text, filters jsonb)`: Executes FTS query against search documents.
- `autocomplete(query text)`: Fast prefix matching against autocomplete documents.
- `request_export()`: Enqueues a user data export request.
- `delete_account()`: Securely cascades user deletion.

### Internal RPCs (Service Role / Workers Only)
- `refresh_search_projection()`: Materializes complex joins into `discovery_search_documents`.
- `build_statistics_projection()`: Rolls up user reading events into `user_statistics`.
- `update_reading_progress(user_id uuid, book_id uuid, anchor jsonb)`: Atomic upsert for reader progress.
- `complete_reading_session(session_id uuid)`: Finalizes session and updates streaks.
