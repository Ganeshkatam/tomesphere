-- Migration: 20260824000004_align_discovery_refresh_popularity.sql
-- Description: Align discovery search document refresh popularity calculation to pure view_count and rating metrics

CREATE OR REPLACE FUNCTION public.refresh_search_document(target_book_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, internal, extensions
AS $$
DECLARE
    book_record RECORD;
    v_authors text[];
    v_genres text[];
    v_subjects text[];
    v_language text;
    v_publication_year integer;
    v_average_rating numeric(3,2) := 0.00;
    v_rating_count integer := 0;
    v_popularity_score numeric;
    v_fts_tokens tsvector;
BEGIN
    -- 1. Get raw book data
    SELECT * INTO book_record FROM public.books WHERE id = target_book_id;
    
    IF NOT FOUND THEN
        -- If book is deleted, delete the document
        DELETE FROM public.discovery_search_documents WHERE book_id = target_book_id;
        RETURN;
    END IF;

    -- 2. Aggregate Authors
    SELECT COALESCE(array_agg(a.name ORDER BY ba.position ASC), '{}'::text[]) INTO v_authors
    FROM public.book_authors ba
    JOIN public.authors a ON ba.author_id = a.id
    WHERE ba.book_id = target_book_id;

    -- 3. Aggregate Genres
    SELECT COALESCE(array_agg(g.name), '{}'::text[]) INTO v_genres
    FROM public.book_genres bg
    JOIN public.genres g ON bg.genre_id = g.id
    WHERE bg.book_id = target_book_id;

    -- 4. Aggregate Subjects
    SELECT COALESCE(array_agg(s.name), '{}'::text[]) INTO v_subjects
    FROM public.book_subjects bs
    JOIN public.subjects s ON bs.subject_id = s.id
    WHERE bs.book_id = target_book_id;

    -- 5. Get Language name
    IF book_record.language_id IS NOT NULL THEN
        SELECT name INTO v_language
        FROM public.languages
        WHERE id = book_record.language_id;
    ELSE
        v_language := COALESCE(book_record.language, 'English');
    END IF;

    -- 6. Extract Publication Year
    IF book_record.release_date IS NOT NULL THEN
        v_publication_year := EXTRACT(YEAR FROM book_record.release_date::date);
    ELSE
        v_publication_year := NULL;
    END IF;

    -- 7. Compute Popularity Score from view_count and rating metrics
    v_popularity_score := COALESCE(book_record.view_count, 0) + (v_rating_count * 5);

    -- 8. Compute TSVECTOR
    v_fts_tokens := 
        setweight(to_tsvector('english', coalesce(book_record.title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(array_to_string(v_authors, ' '), '')), 'B') ||
        setweight(to_tsvector('english', coalesce(array_to_string(v_genres, ' '), '')), 'C') ||
        setweight(to_tsvector('english', coalesce(book_record.description, '')), 'D');

    -- 9. Upsert the document
    INSERT INTO public.discovery_search_documents (
        book_id,
        slug,
        title,
        authors,
        genres,
        subjects,
        language,
        description,
        publication_year,
        is_public,
        popularity_score,
        average_rating,
        rating_count,
        fts_tokens,
        source_updated_at,
        indexed_at
    )
    VALUES (
        target_book_id,
        target_book_id::text,
        book_record.title,
        v_authors,
        v_genres,
        v_subjects,
        v_language,
        book_record.description,
        v_publication_year,
        COALESCE(book_record.is_published, true) AND NOT COALESCE(book_record.is_archived, false),
        v_popularity_score,
        v_average_rating,
        v_rating_count,
        v_fts_tokens,
        NOW(),
        NOW()
    )
    ON CONFLICT (book_id) DO UPDATE SET
        slug = EXCLUDED.slug,
        title = EXCLUDED.title,
        authors = EXCLUDED.authors,
        genres = EXCLUDED.genres,
        subjects = EXCLUDED.subjects,
        language = EXCLUDED.language,
        description = EXCLUDED.description,
        publication_year = EXCLUDED.publication_year,
        is_public = EXCLUDED.is_public,
        popularity_score = EXCLUDED.popularity_score,
        average_rating = EXCLUDED.average_rating,
        rating_count = EXCLUDED.rating_count,
        fts_tokens = EXCLUDED.fts_tokens,
        source_updated_at = NOW(),
        indexed_at = NOW();

END;
$$;
