-- Migration: Search Projection Metadata
-- Adds operational metadata to discovery_search_documents for observability

ALTER TABLE public.discovery_search_documents
  ADD COLUMN IF NOT EXISTS last_index_reason TEXT CHECK (last_index_reason IN ('CREATE', 'UPDATE', 'DELETE', 'REBUILD')),
  ADD COLUMN IF NOT EXISTS last_index_duration_ms INTEGER,
  ADD COLUMN IF NOT EXISTS last_projection_version INTEGER;
