# TomeSphere Database Frugal Audit (Phase 0)

This document contains a complete inventory of the live PostgreSQL/Supabase database objects, including their classification for the Frugal Database Engineering refactor.

## 1. Tables & Storage Baseline

Below is the live table sizing (as of Phase 0).

| Table Name | Total Size | Table Size | Index Size | Live Rows | Classification |
| --- | --- | --- | --- | --- | --- |
| ooks | 40 kB | 8192 bytes | 24 kB | 0 | **KEEP** (Canonical Aggregate) |
| discovery_search_documents | 40 kB | 0 bytes | 32 kB | 0 | **OPTIMIZE** (Duplicate GIN indexes) |
| user_preferences | 40 kB | 0 bytes | 32 kB | 0 | **OPTIMIZE** (Duplicate PK indexes) |
| search_history | 40 kB | 0 bytes | 32 kB | 0 | **INVESTIGATE** (Implement retention horizon) |
| eading_sessions | 40 kB | 0 bytes | 32 kB | 0 | **KEEP** (Reader state) |
| ookmarks | 40 kB | 0 bytes | 32 kB | 0 | **OPTIMIZE** (Duplicate indexes) |
| library_books | 32 kB | 0 bytes | 24 kB | 0 | **KEEP** |
| outbox_events | 32 kB | 0 bytes | 24 kB | 0 | **KEEP** (EventBus infrastructure) |
| job_queue | 16 kB | 0 bytes | 8192 bytes | 0 | **KEEP** (Job infrastructure) |
| processed_events | 16 kB | 0 bytes | 8192 bytes | 0 | **KEEP** (Idempotency) |

*(Note: Live rows are near zero as this is a local/staging instance currently, but sizes indicate index overhead).*

---

## 2. Functions & RPCs

| RPC Name | Application Usage | Classification | Action Required |
| --- | --- | --- | --- |
| claim_outbox_events | outbox-relay.ts | **RESTRICT** | Revoke anon/authenticated. Internal API. |
| save_book_aggregate_with_events| SupabaseBookRepository.ts| **RESTRICT** | Revoke anon/authenticated. Internal API. |
| execute_book_search_v1 | SupabaseSearchReadModel.ts | **KEEP** | Canonical Search RPC. |
| search_books_fts | search.ts | **DEPRECATE** | Legacy search. Migrate search.ts to canonical API, then drop. |
| search_catalog | SupabaseDiscoveryReadModel.ts| **DEPRECATE** | Legacy search. Migrate, then drop. |
| save_book_action_with_events | None | **REMOVE** | P0 vulnerability (caller provides ID), completely unused. |
| save_reader_session_with_events| None | **REMOVE** | Unused. |
| sanitize_account_logs | None | **RESTRICT** | Security Definer. Audit privileges. |

---

## 3. Duplicate Indexes (Redundancy Cleanup Candidates)

| Index Name | Table | Issue | Classification |
| --- | --- | --- | --- |
| idx_bookmarks_user_book | ookmarks | Exact duplicate of ookmarks_user_book_idx. | **CONSOLIDATE** |
| idx_books_featured | ooks | Exact duplicate of idx_books_is_featured. | **CONSOLIDATE** |
| idx_search_docs_fts | discovery_search_documents | Exact duplicate of discovery_search_documents_fts_idx / idx_discovery_search_documents_fts. | **CONSOLIDATE** |
| idx_discovery_search_documents_popularity | discovery_search_documents | Exact duplicate of discovery_search_documents_popularity_idx. | **CONSOLIDATE** |
| idx_user_preferences_user_id | user_preferences | Redundant with PRIMARY KEY (user_id) and idx_preferences_user_id. | **CONSOLIDATE** |
| idx_outbox_messages_aggregate | outbox_events | Legacy name referencing old table name. | **OPTIMIZE** (Rename) |

---

## 4. Duplicate Triggers

| Trigger Name | Table | Issue | Classification |
| --- | --- | --- | --- |
| update_timestamp | ooks | Duplicates update_books_updated_at. | **CONSOLIDATE** (Drop update_timestamp) |

---

## 5. Duplicate RLS Policies

| Policy | Table | Classification |
| --- | --- | --- |
| Allow public read access | ooks | **KEEP** (Canonical) |
| Books are viewable by everyone | ooks | **CONSOLIDATE** (Drop) |
| Public can read books | ooks | **CONSOLIDATE** (Drop) |
| Anyone can read search documents | discovery_search_documents | **KEEP** (Canonical) |
| Public profiles are viewable by everyone | discovery_search_documents | **CONSOLIDATE** (Drop) |

---

## 6. Realtime Publications Audit

| Table | Published? | Active Client Usage? | Classification |
| --- | --- | --- | --- |
| ooks | YES | NO | **REMOVE** |
| profiles | YES | NO | **REMOVE** |
| 	ags | YES | NO | **REMOVE** |
| user_preferences | YES | YES | **KEEP** |
| ookmarks | YES | YES | **KEEP** |
| 
otes | YES | NO | **REMOVE** |

*(Note: Validation of active UX subscriptions required before removal).*
