-- Migration: Flexible case-insensitive & slug-resilient genre and subject matching in search RPCs
-- Allows /search?genre=aerospace%20engineering or /search?genre=vedic-mathematics to seamlessly match both genres and subjects.

CREATE OR REPLACE FUNCTION public.execute_book_search_v1(
    p_query text DEFAULT NULL::text, 
    p_page integer DEFAULT 1, 
    p_page_size integer DEFAULT 20, 
    p_sort text DEFAULT 'relevance'::text, 
    p_genres text[] DEFAULT ARRAY[]::text[], 
    p_subjects text[] DEFAULT ARRAY[]::text[], 
    p_languages text[] DEFAULT ARRAY[]::text[], 
    p_publication_years integer[] DEFAULT ARRAY[]::integer[], 
    p_include_unavailable boolean DEFAULT false
)
RETURNS TABLE(
    book_id uuid, 
    slug text, 
    title text, 
    subtitle text, 
    authors text[], 
    genres text[], 
    subjects text[], 
    language text, 
    average_rating numeric, 
    rating_count integer, 
    popularity_score numeric, 
    relevance_score numeric, 
    total_count bigint, 
    is_typo_fallback boolean, 
    suggested_query text,
    cover_url text
)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path TO 'public', 'internal', 'extensions'
AS $function$
DECLARE
    v_tsquery tsquery;
    v_offset INTEGER;
    v_normalized_query TEXT;
    v_fts_count BIGINT;
BEGIN
    v_offset := (p_page - 1) * p_page_size;

    IF p_query IS NOT NULL AND trim(p_query) <> '' THEN
        v_normalized_query := public.normalize_search_query(p_query);
        v_tsquery := websearch_to_tsquery('english', v_normalized_query);
    ELSE
        v_tsquery := NULL;
        v_normalized_query := '';
    END IF;

    IF v_tsquery IS NOT NULL THEN
        SELECT count(*) INTO v_fts_count
        FROM public.discovery_search_documents d
        WHERE 
            (d.fts_tokens @@ v_tsquery)
            AND (
                array_length(p_genres, 1) IS NULL 
                OR d.genres && p_genres 
                OR EXISTS (
                    SELECT 1 
                    FROM unnest(d.genres || d.subjects) g, unnest(p_genres) pg 
                    WHERE LOWER(g) = LOWER(pg) 
                       OR replace(LOWER(g), ' ', '-') = replace(LOWER(pg), ' ', '-') 
                       OR replace(LOWER(g), '-', ' ') = replace(LOWER(pg), '-', ' ')
                )
            )
            AND (
                array_length(p_subjects, 1) IS NULL 
                OR d.subjects && p_subjects 
                OR EXISTS (
                    SELECT 1 
                    FROM unnest(d.subjects || d.genres) s, unnest(p_subjects) ps 
                    WHERE LOWER(s) = LOWER(ps) 
                       OR replace(LOWER(s), ' ', '-') = replace(LOWER(ps), ' ', '-') 
                       OR replace(LOWER(s), '-', ' ') = replace(LOWER(ps), '-', ' ')
                )
            )
            AND (array_length(p_languages, 1) IS NULL OR d.language = ANY(p_languages))
            AND (array_length(p_publication_years, 1) IS NULL OR d.publication_year = ANY(p_publication_years))
            AND (p_include_unavailable = true OR d.is_public = true);
    ELSE
        v_fts_count := 1;
    END IF;

    IF v_fts_count > 0 OR v_tsquery IS NULL THEN
        RETURN QUERY
        WITH filtered_docs AS (
            SELECT 
                d.book_id, d.slug, d.title AS doc_title, d.subtitle, d.authors, d.genres, d.subjects,
                d.language, d.average_rating, d.rating_count, d.popularity_score AS doc_popularity_score,
                d.is_public, d.publication_year,
                CASE WHEN v_tsquery IS NOT NULL THEN ts_rank(array[0.01, 0.1, 0.6, 1.0]::real[], d.fts_tokens, v_tsquery) ELSE 0 END AS base_rank
            FROM public.discovery_search_documents d
            WHERE 
                (p_query IS NULL OR trim(p_query) = '' OR (v_tsquery IS NOT NULL AND d.fts_tokens @@ v_tsquery))
                AND (
                    array_length(p_genres, 1) IS NULL 
                    OR d.genres && p_genres 
                    OR EXISTS (
                        SELECT 1 
                        FROM unnest(d.genres || d.subjects) g, unnest(p_genres) pg 
                        WHERE LOWER(g) = LOWER(pg) 
                           OR replace(LOWER(g), ' ', '-') = replace(LOWER(pg), ' ', '-') 
                           OR replace(LOWER(g), '-', ' ') = replace(LOWER(pg), '-', ' ')
                    )
                )
                AND (
                    array_length(p_subjects, 1) IS NULL 
                    OR d.subjects && p_subjects 
                    OR EXISTS (
                        SELECT 1 
                        FROM unnest(d.subjects || d.genres) s, unnest(p_subjects) ps 
                        WHERE LOWER(s) = LOWER(ps) 
                           OR replace(LOWER(s), ' ', '-') = replace(LOWER(ps), ' ', '-') 
                           OR replace(LOWER(s), '-', ' ') = replace(LOWER(ps), '-', ' ')
                    )
                )
                AND (array_length(p_languages, 1) IS NULL OR d.language = ANY(p_languages))
                AND (array_length(p_publication_years, 1) IS NULL OR d.publication_year = ANY(p_publication_years))
                AND (p_include_unavailable = true OR d.is_public = true)
        ),
        scored_docs AS (
            SELECT *, (base_rank + (doc_popularity_score * 0.15))::NUMERIC AS computed_relevance
            FROM filtered_docs
            WHERE (p_query IS NULL OR trim(p_query) = '' OR base_rank >= 0.05)
        )
        SELECT 
            s.book_id::UUID, s.slug, s.doc_title, s.subtitle, s.authors, s.genres, s.subjects,
            s.language, s.average_rating, s.rating_count, s.doc_popularity_score::NUMERIC,
            s.computed_relevance,
            (SELECT count(*) FROM scored_docs)::BIGINT AS total_count,
            false AS is_typo_fallback,
            NULL::TEXT AS suggested_query,
            b.cover_url
        FROM scored_docs s
        LEFT JOIN public.books b ON b.id = s.book_id
        ORDER BY 
            CASE WHEN p_sort = 'relevance' THEN s.computed_relevance ELSE 0 END DESC,
            CASE WHEN p_sort = 'popular' THEN s.doc_popularity_score ELSE 0 END DESC,
            CASE WHEN p_sort = 'rating' THEN s.average_rating ELSE 0 END DESC,
            CASE WHEN p_sort = 'rating' THEN s.rating_count ELSE 0 END DESC,
            CASE WHEN p_sort = 'newest' THEN s.publication_year ELSE 0 END DESC,
            s.book_id DESC
        OFFSET v_offset
        LIMIT p_page_size;
    ELSE
        RETURN QUERY
        WITH filtered_docs AS (
            SELECT 
                d.book_id, d.slug, d.title AS doc_title, d.subtitle, d.authors, d.genres, d.subjects,
                d.language, d.average_rating, d.rating_count, d.popularity_score AS doc_popularity_score,
                d.is_public, d.publication_year,
                GREATEST(
                    strict_word_similarity(v_normalized_query, d.title),
                    CASE WHEN array_length(d.authors, 1) > 0 THEN strict_word_similarity(v_normalized_query, d.authors[1]) ELSE 0 END
                ) AS base_rank
            FROM public.discovery_search_documents d
            WHERE 
                (strict_word_similarity(v_normalized_query, d.title) > 0.35 
                 OR (array_length(d.authors, 1) > 0 AND strict_word_similarity(v_normalized_query, d.authors[1]) > 0.35))
                AND (
                    array_length(p_genres, 1) IS NULL 
                    OR d.genres && p_genres 
                    OR EXISTS (
                        SELECT 1 
                        FROM unnest(d.genres || d.subjects) g, unnest(p_genres) pg 
                        WHERE LOWER(g) = LOWER(pg) 
                           OR replace(LOWER(g), ' ', '-') = replace(LOWER(pg), ' ', '-') 
                           OR replace(LOWER(g), '-', ' ') = replace(LOWER(pg), '-', ' ')
                    )
                )
                AND (
                    array_length(p_subjects, 1) IS NULL 
                    OR d.subjects && p_subjects 
                    OR EXISTS (
                        SELECT 1 
                        FROM unnest(d.subjects || d.genres) s, unnest(p_subjects) ps 
                        WHERE LOWER(s) = LOWER(ps) 
                           OR replace(LOWER(s), ' ', '-') = replace(LOWER(ps), ' ', '-') 
                           OR replace(LOWER(s), '-', ' ') = replace(LOWER(ps), '-', ' ')
                    )
                )
                AND (array_length(p_languages, 1) IS NULL OR d.language = ANY(p_languages))
                AND (array_length(p_publication_years, 1) IS NULL OR d.publication_year = ANY(p_publication_years))
                AND (p_include_unavailable = true OR d.is_public = true)
        ),
        scored_docs AS (
            SELECT *, (base_rank + (doc_popularity_score * 0.15))::NUMERIC AS computed_relevance
            FROM filtered_docs
        )
        SELECT 
            s.book_id::UUID, s.slug, s.doc_title, s.subtitle, s.authors, s.genres, s.subjects,
            s.language, s.average_rating, s.rating_count, s.doc_popularity_score::NUMERIC,
            s.computed_relevance,
            (SELECT count(*) FROM scored_docs)::BIGINT AS total_count,
            true AS is_typo_fallback,
            s.doc_title::TEXT AS suggested_query,
            b.cover_url
        FROM scored_docs s
        LEFT JOIN public.books b ON b.id = s.book_id
        ORDER BY 
            CASE WHEN p_sort = 'relevance' THEN s.computed_relevance ELSE 0 END DESC,
            CASE WHEN p_sort = 'popular' THEN s.doc_popularity_score ELSE 0 END DESC,
            CASE WHEN p_sort = 'rating' THEN s.average_rating ELSE 0 END DESC,
            CASE WHEN p_sort = 'rating' THEN s.rating_count ELSE 0 END DESC,
            CASE WHEN p_sort = 'newest' THEN s.publication_year ELSE 0 END DESC,
            s.book_id DESC
        OFFSET v_offset
        LIMIT p_page_size;
    END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_search_facets_v1(
    p_query text DEFAULT NULL::text, 
    p_genres text[] DEFAULT ARRAY[]::text[], 
    p_subjects text[] DEFAULT ARRAY[]::text[], 
    p_languages text[] DEFAULT ARRAY[]::text[], 
    p_publication_years integer[] DEFAULT ARRAY[]::integer[], 
    p_include_unavailable boolean DEFAULT false
)
RETURNS TABLE(facet_key text, facet_value text, match_count bigint)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path TO 'public', 'internal', 'extensions'
AS $function$
DECLARE
    v_tsquery tsquery;
    v_normalized_query text;
BEGIN
    IF p_query IS NOT NULL AND trim(p_query) <> '' THEN
        v_normalized_query := public.normalize_search_query(p_query);
        v_tsquery := websearch_to_tsquery('english', v_normalized_query);
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
            (v_tsquery IS NULL OR d.fts_tokens @@ v_tsquery)
            AND (
                array_length(p_genres, 1) IS NULL 
                OR d.genres && p_genres 
                OR EXISTS (
                    SELECT 1 
                    FROM unnest(d.genres || d.subjects) g, unnest(p_genres) pg 
                    WHERE LOWER(g) = LOWER(pg) 
                       OR replace(LOWER(g), ' ', '-') = replace(LOWER(pg), ' ', '-') 
                       OR replace(LOWER(g), '-', ' ') = replace(LOWER(pg), '-', ' ')
                )
            )
            AND (
                array_length(p_subjects, 1) IS NULL 
                OR d.subjects && p_subjects 
                OR EXISTS (
                    SELECT 1 
                    FROM unnest(d.subjects || d.genres) s, unnest(p_subjects) ps 
                    WHERE LOWER(s) = LOWER(ps) 
                       OR replace(LOWER(s), ' ', '-') = replace(LOWER(ps), ' ', '-') 
                       OR replace(LOWER(s), '-', ' ') = replace(LOWER(ps), '-', ' ')
                )
            )
            AND (array_length(p_languages, 1) IS NULL OR d.language = ANY(p_languages))
            AND (array_length(p_publication_years, 1) IS NULL OR d.publication_year = ANY(p_publication_years))
            AND (p_include_unavailable = true OR d.is_public = true)
    )
    SELECT 'genres'::TEXT AS facet_key, unnested_genre AS facet_value, count(*)::BIGINT AS match_count
    FROM filtered_docs, unnest(genres) AS unnested_genre
    GROUP BY unnested_genre
    UNION ALL
    SELECT 'subjects'::TEXT, unnested_subject, count(*)::BIGINT
    FROM filtered_docs, unnest(subjects) AS unnested_subject
    GROUP BY unnested_subject
    UNION ALL
    SELECT 'languages'::TEXT, language, count(*)::BIGINT
    FROM filtered_docs
    WHERE language IS NOT NULL
    GROUP BY language
    UNION ALL
    SELECT 'publicationYears'::TEXT, publication_year::TEXT, count(*)::BIGINT
    FROM filtered_docs
    WHERE publication_year IS NOT NULL
    GROUP BY publication_year;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.execute_book_search_v1(text, integer, integer, text, text[], text[], text[], integer[], boolean) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_search_facets_v1(text, text[], text[], text[], integer[], boolean) TO anon, authenticated, service_role;
