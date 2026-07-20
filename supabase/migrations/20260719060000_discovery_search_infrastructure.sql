-- Migration: 20260719060000_discovery_search_infrastructure
-- Description: Sets up the pg_trgm extension, the search projection table, search history, and trending searches.

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. Immutable wrapper for array_to_string (needed for GIN indexes)
CREATE OR REPLACE FUNCTION public.immutable_array_to_string(arr text[], sep text)
RETURNS text
LANGUAGE sql IMMUTABLE PARALLEL SAFE AS
$$SELECT array_to_string(arr, sep)$$;

-- 3. Discovery Search Documents (Event-Driven Projection)
CREATE TABLE IF NOT EXISTS public.discovery_search_documents (
  book_id uuid PRIMARY KEY REFERENCES public.books(id) ON DELETE CASCADE,
  title text NOT NULL,
  subtitle text,
  authors text[] DEFAULT '{}',
  categories text[] DEFAULT '{}',
  language text DEFAULT 'en',
  description text,
  cover_url text,
  keywords text[] DEFAULT '{}',
  publication_year integer,
  availability_status text DEFAULT 'available',
  popularity_score numeric DEFAULT 0,
  rating numeric DEFAULT 0,
  download_count integer DEFAULT 0,
  fts_tokens tsvector,
  projection_version integer DEFAULT 1,
  indexed_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ensure columns exist if table was created by an earlier migration
ALTER TABLE public.discovery_search_documents ADD COLUMN IF NOT EXISTS cover_url text;
ALTER TABLE public.discovery_search_documents ADD COLUMN IF NOT EXISTS download_count integer DEFAULT 0;
ALTER TABLE public.discovery_search_documents ADD COLUMN IF NOT EXISTS projection_version integer DEFAULT 1;
ALTER TABLE public.discovery_search_documents ADD COLUMN IF NOT EXISTS indexed_at timestamptz DEFAULT now();

-- RLS
ALTER TABLE public.discovery_search_documents ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'discovery_search_documents' AND policyname = 'Public profiles are viewable by everyone') THEN
    CREATE POLICY "Public profiles are viewable by everyone" ON public.discovery_search_documents FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'discovery_search_documents' AND policyname = 'Only admins/workers can modify search documents') THEN
    CREATE POLICY "Only admins/workers can modify search documents" ON public.discovery_search_documents FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

-- Full Text Search Index
CREATE INDEX IF NOT EXISTS discovery_search_documents_fts_idx ON public.discovery_search_documents USING GIN (fts_tokens);

-- Trigram Indexes for typo-tolerant Autocomplete
CREATE INDEX IF NOT EXISTS discovery_search_documents_title_trgm_idx ON public.discovery_search_documents USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS discovery_search_documents_authors_trgm_idx ON public.discovery_search_documents USING gin (public.immutable_array_to_string(authors, ' ') gin_trgm_ops);
CREATE INDEX IF NOT EXISTS discovery_search_documents_categories_trgm_idx ON public.discovery_search_documents USING gin (public.immutable_array_to_string(categories, ' ') gin_trgm_ops);

-- Standard Indexes
CREATE INDEX IF NOT EXISTS discovery_search_documents_popularity_idx ON public.discovery_search_documents (popularity_score DESC);
CREATE INDEX IF NOT EXISTS discovery_search_documents_rating_idx ON public.discovery_search_documents (rating DESC);

-- 4. Search History (Authenticated Users)
CREATE TABLE IF NOT EXISTS public.search_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  query text NOT NULL,
  normalized_query text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'search_history' AND policyname = 'Users can view their own search history') THEN
    CREATE POLICY "Users can view their own search history" ON public.search_history FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'search_history' AND policyname = 'Users can insert their own search history') THEN
    CREATE POLICY "Users can insert their own search history" ON public.search_history FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'search_history' AND policyname = 'Users can delete their own search history') THEN
    CREATE POLICY "Users can delete their own search history" ON public.search_history FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS search_history_user_id_idx ON public.search_history (user_id);
CREATE INDEX IF NOT EXISTS search_history_normalized_query_idx ON public.search_history (normalized_query);

-- 5. Trending Searches (Projection)
CREATE TABLE IF NOT EXISTS public.trending_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  normalized_query text NOT NULL UNIQUE,
  search_count integer DEFAULT 1,
  last_executed timestamptz DEFAULT now()
);

ALTER TABLE public.trending_searches ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'trending_searches' AND policyname = 'Trending searches are public') THEN
    CREATE POLICY "Trending searches are public" ON public.trending_searches FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'trending_searches' AND policyname = 'Only service role can modify trending searches') THEN
    CREATE POLICY "Only service role can modify trending searches" ON public.trending_searches FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS trending_searches_count_idx ON public.trending_searches (search_count DESC);
