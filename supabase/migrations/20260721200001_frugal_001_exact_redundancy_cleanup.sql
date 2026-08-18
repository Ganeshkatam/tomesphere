-- Frugal Migration 001: Exact Redundancy Cleanup
-- Purpose: Remove confirmed exact duplicate indexes and triggers without modifying table structures.

-- ============================================================================
-- 1. INDEX DELETIONS WITH SURVIVOR DOCUMENTATION
-- ============================================================================

-- DROP: idx_bookmarks_user_book
-- KEEP: bookmarks_user_book_idx
-- WHY: Identical B-tree index on public.bookmarks(user_id, book_id).
DROP INDEX IF EXISTS public.idx_bookmarks_user_book;

-- DROP: idx_books_featured
-- KEEP: idx_books_is_featured
-- WHY: Identical B-tree index on public.books(is_featured).
DROP INDEX IF EXISTS public.idx_books_featured;

-- DROP: discovery_search_documents_fts_idx
-- KEEP: idx_discovery_search_documents_fts
-- WHY: Identical GIN index on public.discovery_search_documents(fts_tokens).
DROP INDEX IF EXISTS public.discovery_search_documents_fts_idx;

-- DROP: idx_search_docs_fts
-- KEEP: idx_discovery_search_documents_fts
-- WHY: Identical GIN index on public.discovery_search_documents(fts_tokens).
DROP INDEX IF EXISTS public.idx_search_docs_fts;

-- DROP: discovery_search_documents_popularity_idx
-- KEEP: idx_discovery_search_documents_popularity
-- WHY: Identical B-tree index on public.discovery_search_documents(popularity_score DESC).
DROP INDEX IF EXISTS public.discovery_search_documents_popularity_idx;

-- DROP: idx_user_preferences_user_id
-- KEEP: idx_preferences_user_id
-- WHY: Identical B-tree index on public.user_preferences(user_id).
DROP INDEX IF EXISTS public.idx_user_preferences_user_id;


-- ============================================================================
-- 2. TRIGGER DELETIONS WITH SURVIVOR DOCUMENTATION
-- ============================================================================

-- DROP: update_timestamp ON public.books
-- KEEP: update_books_updated_at ON public.books
-- WHY: Both triggers execute identical updated_at timestamp setting logic on UPDATE.
DROP TRIGGER IF EXISTS update_timestamp ON public.books;
