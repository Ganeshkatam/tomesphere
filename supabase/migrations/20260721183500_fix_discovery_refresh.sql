-- Fix refresh_search_document to use normalized tables
CREATE OR REPLACE FUNCTION "public"."refresh_search_document"("target_book_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    book_record RECORD;
    v_authors text[];
    v_genres text[];
    v_subjects text[];
    v_language text;
    v_publication_year integer;
    v_average_rating numeric(3,2);
    v_rating_count integer;
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
        v_language := COALESCE(book_record.language, 'Unknown');
    END IF;

    -- 6. Extract Publication Year
    IF book_record.release_date IS NOT NULL THEN
        v_publication_year := EXTRACT(YEAR FROM book_record.release_date::date);
    ELSE
        v_publication_year := NULL;
    END IF;

    -- 7. Compute Ratings
    SELECT 
        COALESCE(AVG(rating), 0),
        COUNT(rating)
    INTO 
        v_average_rating, 
        v_rating_count
    FROM public.ratings
    WHERE book_id = target_book_id;

    -- 8. Compute Popularity Score (simple heuristic)
    v_popularity_score := COALESCE(book_record.view_count, 0) + COALESCE(book_record.download_count, 0) * 2 + v_rating_count * 5;

    -- 9. Compute TSVECTOR
    v_fts_tokens := 
        setweight(to_tsvector('english', coalesce(book_record.title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(array_to_string(v_authors, ' '), '')), 'B') ||
        setweight(to_tsvector('english', coalesce(array_to_string(v_genres, ' '), '')), 'C') ||
        setweight(to_tsvector('english', coalesce(book_record.description, '')), 'D');

    -- 10. Upsert the document
    INSERT INTO public.discovery_search_documents (
        book_id,
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
        source_updated_at
    )
    VALUES (
        target_book_id,
        book_record.title,
        v_authors,
        v_genres,
        v_subjects,
        v_language,
        book_record.description,
        v_publication_year,
        book_record.is_published AND NOT book_record.is_archived,
        v_popularity_score,
        v_average_rating,
        v_rating_count,
        v_fts_tokens,
        NOW()
    )
    ON CONFLICT (book_id) DO UPDATE SET
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
        source_updated_at = NOW();

END;
$$;

-- Fix refresh_category_document to use genres
CREATE OR REPLACE FUNCTION "public"."refresh_category_document"("target_category" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
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
    WHERE target_category = ANY(genres);

    -- Get top 10 trending/popular books in this category
    SELECT array_agg(book_id) INTO top_trending
    FROM (
        SELECT book_id 
        FROM public.discovery_search_documents 
        WHERE target_category = ANY(genres)
        ORDER BY popularity_score DESC, average_rating DESC 
        LIMIT 10
    ) sub;

    -- Get top 10 new releases in this category (approximated by publication_year for now)
    SELECT array_agg(book_id) INTO new_releases
    FROM (
        SELECT book_id 
        FROM public.discovery_search_documents 
        WHERE target_category = ANY(genres)
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
