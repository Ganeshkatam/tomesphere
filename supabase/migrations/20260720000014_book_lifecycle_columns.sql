-- Migration: Fix legacy FTS trigger and add lifecycle columns
-- The books_fts_update trigger references removed columns (author, genre).
-- Since FTS on books is now handled by the discovery_search_documents projection,
-- this legacy trigger is defunct and should be dropped.

-- 1. Drop the broken legacy trigger and function
DROP TRIGGER IF EXISTS books_fts_update ON public.books;
DROP FUNCTION IF EXISTS public.books_fts_update();

-- 2. Add publishing lifecycle columns for the Book Aggregate Root
ALTER TABLE public.books
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_archived BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1;

-- 3. Backfill: All existing books are considered published
UPDATE public.books SET is_published = true WHERE is_published = false;

COMMENT ON COLUMN public.books.is_published IS 'Whether the book is visible to public consumers';
COMMENT ON COLUMN public.books.is_archived IS 'Soft-delete flag — archived books are hidden but preserved';
COMMENT ON COLUMN public.books.version IS 'Optimistic concurrency version for aggregate writes';
