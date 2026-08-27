-- Migration: 20260828000000_frugal_schema_cleanup.sql
-- Description: Targeted cleanup of unconsumed search layers and duplicate file columns on books.
-- Constraints: Strict retention of all active consumed tables.

-- 1. Decouple search query normalization from search_synonyms
CREATE OR REPLACE FUNCTION public.normalize_search_query(p_query text)
RETURNS text
LANGUAGE plpgsql
SET search_path TO 'public', 'internal'
AS $$
BEGIN
    RETURN trim(lower(p_query));
END;
$$;

-- 2. Drop unconsumed search tables
DROP TABLE IF EXISTS public.search_synonyms CASCADE;
DROP TABLE IF EXISTS public.discovery_autocomplete_documents CASCADE;

-- 3. Canonicalize book files by dropping duplicate legacy columns from public.books
ALTER TABLE public.books 
  DROP COLUMN IF EXISTS pdf_url,
  DROP COLUMN IF EXISTS epub_url,
  DROP COLUMN IF EXISTS format,
  DROP COLUMN IF EXISTS file_size,
  DROP COLUMN IF EXISTS file_size_mb,
  DROP COLUMN IF EXISTS hash;
