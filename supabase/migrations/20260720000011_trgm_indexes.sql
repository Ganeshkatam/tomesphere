-- Migration: Trigram Indexes for Search Typo Fallback
-- Adds pg_trgm GIN indexes for fast similarity search

-- Index for title similarity
CREATE INDEX IF NOT EXISTS discovery_search_documents_title_trgm_idx 
ON public.discovery_search_documents USING GIN (title gin_trgm_ops);

-- Index for primary author similarity (functional index)
CREATE INDEX IF NOT EXISTS discovery_search_documents_primary_author_trgm_idx 
ON public.discovery_search_documents USING GIN ((authors[1]) gin_trgm_ops);
