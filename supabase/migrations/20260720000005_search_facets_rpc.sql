-- Migration: Search Facets RPC v1
-- Computes data-driven facets over the matching discovery_search_documents

CREATE OR REPLACE FUNCTION public.get_search_facets_v1(
    p_query TEXT,
    p_genres TEXT[],
    p_subjects TEXT[],
    p_languages TEXT[],
    p_publication_years INTEGER[],
    p_include_unavailable BOOLEAN
)
RETURNS TABLE (
    facet_key TEXT,
    facet_value TEXT,
    match_count BIGINT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_tsquery tsquery;
BEGIN
    -- If query is provided, convert it to a web search tsquery
    IF p_query IS NOT NULL AND trim(p_query) <> '' THEN
        v_tsquery := websearch_to_tsquery('english', p_query);
    ELSE
        v_tsquery := NULL;
    END IF;

    RETURN QUERY
    WITH filtered_docs AS (
        SELECT 
            d.genres,
            d.subjects,
            d.language,
            d.publication_year
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
    )
    -- Aggregate Genres
    SELECT 'genres'::TEXT AS facet_key, unnested_genre AS facet_value, count(*)::BIGINT AS match_count
    FROM filtered_docs, unnest(genres) AS unnested_genre
    GROUP BY unnested_genre
    UNION ALL
    -- Aggregate Subjects
    SELECT 'subjects'::TEXT, unnested_subject, count(*)::BIGINT
    FROM filtered_docs, unnest(subjects) AS unnested_subject
    GROUP BY unnested_subject
    UNION ALL
    -- Aggregate Languages
    SELECT 'languages'::TEXT, language, count(*)::BIGINT
    FROM filtered_docs
    WHERE language IS NOT NULL
    GROUP BY language
    UNION ALL
    -- Aggregate Publication Years
    SELECT 'publicationYears'::TEXT, publication_year::TEXT, count(*)::BIGINT
    FROM filtered_docs
    WHERE publication_year IS NOT NULL
    GROUP BY publication_year;
END;
$$;
