-- Migration: Search Projection Schema
-- Creates the foundational table, indexes, and triggers for discovery search

-- Migration: Search Projection Schema
-- Creates the foundational table, indexes, and triggers for discovery search

ALTER TABLE public.discovery_search_documents
  DROP COLUMN IF EXISTS categories,
  DROP COLUMN IF EXISTS keywords,
  DROP COLUMN IF EXISTS availability_status,
  DROP COLUMN IF EXISTS cover_url,
  DROP COLUMN IF EXISTS rating,
  DROP COLUMN IF EXISTS updated_at;

ALTER TABLE public.discovery_search_documents
  ADD COLUMN IF NOT EXISTS slug TEXT NOT NULL DEFAULT 'unknown',
  ADD COLUMN IF NOT EXISTS genres TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS subjects TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS view_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS average_rating NUMERIC(3, 2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rating_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS language TEXT NOT NULL;

-- B-Tree Indexes for Filtering
CREATE INDEX IF NOT EXISTS idx_search_docs_is_public ON public.discovery_search_documents (is_public);
CREATE INDEX IF NOT EXISTS idx_search_docs_language ON public.discovery_search_documents (language);
CREATE INDEX IF NOT EXISTS idx_search_docs_pub_year ON public.discovery_search_documents (publication_year);
CREATE INDEX IF NOT EXISTS idx_search_docs_proj_version ON public.discovery_search_documents (projection_version);

-- GIN Index for FTS
CREATE INDEX IF NOT EXISTS idx_search_docs_fts ON public.discovery_search_documents USING GIN (fts_tokens);

-- Trigger Function for TSVector Update
CREATE OR REPLACE FUNCTION public.update_search_document_fts()
RETURNS TRIGGER AS $$
BEGIN
  -- Weight A: Title, Authors
  -- Weight B: Genres, Subjects
  -- Weight C: Subtitle, Description
  
  NEW.fts_tokens :=
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.authors, ' '), '')), 'A') ||
    
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.genres, ' '), '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.subjects, ' '), '')), 'B') ||
    
    setweight(to_tsvector('english', COALESCE(NEW.subtitle, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'C');
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger definition
DROP TRIGGER IF EXISTS trg_update_search_document_fts ON public.discovery_search_documents;
CREATE TRIGGER trg_update_search_document_fts
BEFORE INSERT OR UPDATE OF title, subtitle, description, authors, genres, subjects
ON public.discovery_search_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_search_document_fts();
