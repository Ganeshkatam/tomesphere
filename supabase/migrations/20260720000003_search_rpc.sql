-- Migration: Search RPC v1
-- Encapsulates the entire Ranking Strategy, Filtering, and Pagination inside PostgreSQL

CREATE OR REPLACE FUNCTION public.execute_book_search_v1(
    p_query TEXT,
    p_page INTEGER,
    p_page_size INTEGER,
    p_sort TEXT,
    p_genres TEXT[],
    p_subjects TEXT[],
    p_languages TEXT[],
    p_publication_years INTEGER[],
    p_include_unavailable BOOLEAN
)
RETURNS TABLE (
    book_id UUID,
    slug TEXT,
    title TEXT,
    subtitle TEXT,
    authors TEXT[],
    genres TEXT[],
    subjects TEXT[],
    language TEXT,
    average_rating NUMERIC,
    rating_count INTEGER,
    popularity_score NUMERIC,
    relevance_score NUMERIC,
    total_count BIGINT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_tsquery tsquery;
    v_offset INTEGER;
BEGIN
    v_offset := (p_page - 1) * p_page_size;

    -- If query is provided, convert it to a web search tsquery
    IF p_query IS NOT NULL AND trim(p_query) <> '' THEN
        v_tsquery := websearch_to_tsquery('english', p_query);
    ELSE
        v_tsquery := NULL;
    END IF;

    RETURN QUERY
    WITH filtered_docs AS (
        SELECT 
            d.book_id,
            d.slug,
            d.title,
            d.subtitle,
            d.authors,
            d.genres,
            d.subjects,
            d.language,
            d.average_rating,
            d.rating_count,
            d.popularity_score,
            d.is_public,
            d.publication_year,
            CASE 
                WHEN v_tsquery IS NOT NULL THEN ts_rank(d.fts_tokens, v_tsquery)
                ELSE 0
            END AS base_rank
        FROM public.discovery_search_documents d
        WHERE 
            -- Query Match
            (v_tsquery IS NULL OR d.fts_tokens @@ v_tsquery)
            -- Filters
            AND (array_length(p_genres, 1) IS NULL OR d.genres && p_genres)
            AND (array_length(p_subjects, 1) IS NULL OR d.subjects && p_subjects)
            AND (array_length(p_languages, 1) IS NULL OR d.language = ANY(p_languages))
            AND (array_length(p_publication_years, 1) IS NULL OR d.publication_year = ANY(p_publication_years))
            -- Visibility
            AND (p_include_unavailable = true OR d.is_public = true)
    ),
    scored_docs AS (
        SELECT 
            *,
            (base_rank + (popularity_score * 0.15))::NUMERIC AS computed_relevance
        FROM filtered_docs
    )
    SELECT 
        s.book_id::UUID,
        s.slug,
        s.title,
        s.subtitle,
        s.authors,
        s.genres,
        s.subjects,
        s.language,
        s.average_rating,
        s.rating_count,
        s.popularity_score::NUMERIC,
        s.computed_relevance,
        (SELECT count(*) FROM scored_docs)::BIGINT AS total_count
    FROM scored_docs s
    ORDER BY 
        CASE WHEN p_sort = 'relevance' THEN s.computed_relevance ELSE 0 END DESC,
        CASE WHEN p_sort = 'popular' THEN s.popularity_score ELSE 0 END DESC,
        CASE WHEN p_sort = 'rating' THEN s.average_rating ELSE 0 END DESC,
        CASE WHEN p_sort = 'rating' THEN s.rating_count ELSE 0 END DESC,
        CASE WHEN p_sort = 'newest' THEN s.publication_year ELSE 0 END DESC,
        s.book_id DESC -- Deterministic tie-breaker
    OFFSET v_offset
    LIMIT p_page_size;
END;
$$;
