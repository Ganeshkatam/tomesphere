-- Frugal Migration 006: Search Consolidation
-- Purpose: Drop deprecated legacy search RPCs (search_books_fts, search_catalog) 
-- that have been fully superseded by the modern execute_book_search_v1 endpoint.
-- Zero runtime callers were verified prior to this migration.

DROP FUNCTION IF EXISTS public.search_books_fts(search_query text, genre_filter text, page_number integer, page_size integer);
DROP FUNCTION IF EXISTS public.search_catalog(search_query text, genre_filter text, page_num integer, page_size integer);
