-- Migration: Search Autocomplete RPC
-- Provides fast, deterministic prefix matching for autocomplete suggestions

CREATE OR REPLACE FUNCTION public.get_search_autocomplete_v1(p_query TEXT)
RETURNS TABLE (
    book_id uuid,
    slug text,
    title text,
    author text,
    reason text
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_prefix text;
    v_tsquery tsquery;
BEGIN
    IF p_query IS NULL OR trim(p_query) = '' OR length(trim(p_query)) < 2 THEN
        RETURN;
    END IF;

    v_prefix := trim(p_query) || '%';
    
    -- Try to convert the query into a prefix search.
    -- websearch_to_tsquery is safer, but doesn't easily append ':*' to the last word.
    -- For autocomplete, we will manually append ':*' to the raw words.
    BEGIN
        v_tsquery := to_tsquery('english', array_to_string(regexp_split_to_array(trim(p_query), '\s+'), ' & ') || ':*');
    EXCEPTION WHEN OTHERS THEN
        v_tsquery := NULL;
    END;

    RETURN QUERY
    WITH ranked_suggestions AS (
        -- 1. Title prefix match
        SELECT 
            d.book_id, d.slug, d.title, d.authors[1] AS author,
            'PREFIX_TITLE'::text AS reason,
            1 AS rank_order,
            d.popularity_score
        FROM public.discovery_search_documents d
        WHERE d.title ILIKE v_prefix AND d.is_public = true

        UNION ALL

        -- 2. Author prefix match
        SELECT 
            d.book_id, d.slug, d.title, d.authors[1] AS author,
            'PREFIX_AUTHOR'::text AS reason,
            2 AS rank_order,
            d.popularity_score
        FROM public.discovery_search_documents d
        WHERE d.is_public = true 
          AND EXISTS (SELECT 1 FROM unnest(d.authors) a WHERE a ILIKE v_prefix)
          AND d.title NOT ILIKE v_prefix

        UNION ALL

        -- 3. FTS prefix match
        SELECT 
            d.book_id, d.slug, d.title, d.authors[1] AS author,
            'PREFIX_FTS'::text AS reason,
            3 AS rank_order,
            d.popularity_score
        FROM public.discovery_search_documents d
        WHERE d.is_public = true 
          AND v_tsquery IS NOT NULL
          AND d.fts_tokens @@ v_tsquery
          AND d.title NOT ILIKE v_prefix
          AND NOT EXISTS (SELECT 1 FROM unnest(d.authors) a WHERE a ILIKE v_prefix)
    )
    SELECT 
        s.book_id, s.slug, s.title, s.author, s.reason
    FROM ranked_suggestions s
    ORDER BY s.rank_order ASC, s.popularity_score DESC
    LIMIT 5;
END;
$$;
