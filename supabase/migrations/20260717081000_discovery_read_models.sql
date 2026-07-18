-- Migration: Discovery Read Models (Phase 10C.2)

-- 1. Create discovery_search_documents
CREATE TABLE IF NOT EXISTS public.discovery_search_documents (
    book_id UUID PRIMARY KEY REFERENCES public.books(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    subtitle TEXT,
    authors TEXT[] NOT NULL DEFAULT '{}',
    categories TEXT[] NOT NULL DEFAULT '{}',
    language TEXT NOT NULL DEFAULT 'en',
    description TEXT,
    keywords TEXT[] NOT NULL DEFAULT '{}',
    publication_year INTEGER,
    availability_status TEXT NOT NULL DEFAULT 'available',
    popularity_score NUMERIC DEFAULT 0,
    rating NUMERIC DEFAULT 0,
    fts_tokens TSVECTOR,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for full text search
CREATE INDEX IF NOT EXISTS idx_discovery_search_documents_fts ON public.discovery_search_documents USING GIN (fts_tokens);
-- Index for filtering by language
CREATE INDEX IF NOT EXISTS idx_discovery_search_documents_lang ON public.discovery_search_documents(language);
-- Index for sorting by popularity
CREATE INDEX IF NOT EXISTS idx_discovery_search_documents_popularity ON public.discovery_search_documents(popularity_score DESC);

-- Enable RLS
ALTER TABLE public.discovery_search_documents ENABLE ROW LEVEL SECURITY;

-- Everyone can read search documents
CREATE POLICY "Anyone can read search documents" ON public.discovery_search_documents
    FOR SELECT USING (true);


-- 2. Create discovery_category_documents
CREATE TABLE IF NOT EXISTS public.discovery_category_documents (
    category TEXT PRIMARY KEY,
    book_count INTEGER DEFAULT 0,
    trending_book_ids UUID[] DEFAULT '{}',
    new_release_book_ids UUID[] DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.discovery_category_documents ENABLE ROW LEVEL SECURITY;

-- Everyone can read category documents
CREATE POLICY "Anyone can read category documents" ON public.discovery_category_documents
    FOR SELECT USING (true);


-- 3. Create reconciliation function for search documents
CREATE OR REPLACE FUNCTION public.refresh_search_document(target_book_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    book_record RECORD;
    feature_record RECORD;
BEGIN
    -- 1. Get raw book data (we assume books table still has the primary metadata for now)
    SELECT * INTO book_record FROM public.books WHERE id = target_book_id;
    
    IF NOT FOUND THEN
        -- If book is deleted, delete the document
        DELETE FROM public.discovery_search_documents WHERE book_id = target_book_id;
        RETURN;
    END IF;

    -- 2. Get dynamic features from discovery_book_features
    SELECT * INTO feature_record FROM public.discovery_book_features WHERE book_id = target_book_id;

    -- 3. Upsert the document
    INSERT INTO public.discovery_search_documents (
        book_id,
        title,
        subtitle,
        authors,
        categories,
        language,
        description,
        keywords,
        publication_year,
        availability_status,
        popularity_score,
        rating,
        fts_tokens,
        updated_at
    )
    VALUES (
        target_book_id,
        book_record.title,
        book_record.subtitle,
        book_record.authors, -- Assumes it's an array
        book_record.categories, -- Assumes it's an array
        book_record.language,
        book_record.description,
        book_record.keywords,
        book_record.publication_year,
        book_record.availability_status,
        COALESCE(feature_record.popularity_score, 0),
        book_record.average_rating, -- From transactional table
        
        -- Compute TSVECTOR
        setweight(to_tsvector('english', coalesce(book_record.title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(array_to_string(book_record.authors, ' '), '')), 'B') ||
        setweight(to_tsvector('english', coalesce(array_to_string(book_record.categories, ' '), '')), 'C') ||
        setweight(to_tsvector('english', coalesce(book_record.description, '')), 'D'),
        
        NOW()
    )
    ON CONFLICT (book_id) DO UPDATE SET
        title = EXCLUDED.title,
        subtitle = EXCLUDED.subtitle,
        authors = EXCLUDED.authors,
        categories = EXCLUDED.categories,
        language = EXCLUDED.language,
        description = EXCLUDED.description,
        keywords = EXCLUDED.keywords,
        publication_year = EXCLUDED.publication_year,
        availability_status = EXCLUDED.availability_status,
        popularity_score = EXCLUDED.popularity_score,
        rating = EXCLUDED.rating,
        fts_tokens = EXCLUDED.fts_tokens,
        updated_at = NOW();

END;
$$;


-- 4. Create reconciliation function for category documents
CREATE OR REPLACE FUNCTION public.refresh_category_document(target_category TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    total_count INTEGER;
    top_trending UUID[];
    new_releases UUID[];
BEGIN
    -- This function aggregates data from discovery_search_documents
    -- Count total books
    SELECT COUNT(*) INTO total_count 
    FROM public.discovery_search_documents 
    WHERE target_category = ANY(categories);

    -- Get top 10 trending/popular books in this category
    SELECT array_agg(book_id) INTO top_trending
    FROM (
        SELECT book_id 
        FROM public.discovery_search_documents 
        WHERE target_category = ANY(categories)
        ORDER BY popularity_score DESC, rating DESC 
        LIMIT 10
    ) sub;

    -- Get top 10 new releases in this category (approximated by publication_year for now)
    SELECT array_agg(book_id) INTO new_releases
    FROM (
        SELECT book_id 
        FROM public.discovery_search_documents 
        WHERE target_category = ANY(categories)
        ORDER BY publication_year DESC NULLS LAST, popularity_score DESC 
        LIMIT 10
    ) sub;

    -- Upsert the category document
    INSERT INTO public.discovery_category_documents (
        category,
        book_count,
        trending_book_ids,
        new_release_book_ids,
        updated_at
    )
    VALUES (
        target_category,
        total_count,
        COALESCE(top_trending, '{}'),
        COALESCE(new_releases, '{}'),
        NOW()
    )
    ON CONFLICT (category) DO UPDATE SET
        book_count = EXCLUDED.book_count,
        trending_book_ids = EXCLUDED.trending_book_ids,
        new_release_book_ids = EXCLUDED.new_release_book_ids,
        updated_at = NOW();

END;
$$;
