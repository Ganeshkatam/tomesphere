


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "pg_catalog";


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";


CREATE EXTENSION IF NOT EXISTS "pgsodium";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "hypopg" WITH SCHEMA "extensions";


CREATE EXTENSION IF NOT EXISTS "index_advisor" WITH SCHEMA "extensions";



CREATE EXTENSION IF NOT EXISTS "insert_username" WITH SCHEMA "extensions";



CREATE EXTENSION IF NOT EXISTS "ltree" WITH SCHEMA "extensions";


CREATE EXTENSION IF NOT EXISTS "pg_hashids" WITH SCHEMA "extensions";


CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";


CREATE EXTENSION IF NOT EXISTS "pg_trgm" WITH SCHEMA "extensions";


CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";


CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";


CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";


CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";


CREATE EXTENSION IF NOT EXISTS "vector" WITH SCHEMA "extensions";


CREATE EXTENSION IF NOT EXISTS "wrappers" WITH SCHEMA "extensions";


CREATE TYPE "public"."academic_subject_type" AS ENUM (
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Engineering',
    'Business',
    'Economics',
    'Psychology',
    'History',
    'Literature',
    'Philosophy',
    'Medicine',
    'Law',
    'Education'
);


ALTER TYPE "public"."academic_subject_type" OWNER TO "postgres";


CREATE TYPE "public"."export_request_status" AS ENUM (
    'requested',
    'queued',
    'processing',
    'completed',
    'failed'
);


ALTER TYPE "public"."export_request_status" OWNER TO "postgres";


CREATE TYPE "public"."reading_status" AS ENUM (
    'want_to_read',
    'currently_reading',
    'finished'
);


ALTER TYPE "public"."reading_status" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."audit_role_change"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$ BEGIN IF (
        OLD.role IS DISTINCT
        FROM NEW.role
    ) THEN
INSERT INTO public.user_audit_logs (user_id, action, metadata)
VALUES (
        NEW.id,
        'role.changed',
        jsonb_build_object(
            'old_role',
            OLD.role,
            'new_role',
            NEW.role,
            'changed_by',
            auth.uid()
        )
    );
END IF;
RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."audit_role_change"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."outbox_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "aggregate_type" "text" NOT NULL,
    "aggregate_id" "uuid" NOT NULL,
    "event_type" "text" NOT NULL,
    "event_version" integer DEFAULT 1 NOT NULL,
    "payload" "jsonb" NOT NULL,
    "occurred_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "retry_count" integer DEFAULT 0 NOT NULL,
    "last_error" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "processed_at" timestamp with time zone,
    CONSTRAINT "outbox_messages_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'processing'::"text", 'processed'::"text", 'failed'::"text", 'failed_permanent'::"text"])))
);


ALTER TABLE "public"."outbox_events" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."claim_outbox_events"("limit_count" integer) RETURNS SETOF "public"."outbox_events"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    UPDATE public.outbox_events
    SET status = 'processing'
    WHERE id IN (
        SELECT id
        FROM public.outbox_events
        WHERE status = 'pending'
           OR (status = 'failed' AND retry_count < 3)
        ORDER BY created_at ASC
        FOR UPDATE SKIP LOCKED
        LIMIT limit_count
    )
    RETURNING *;
END;
$$;


ALTER FUNCTION "public"."claim_outbox_events"("limit_count" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."cleanup_expired_rate_limits"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  DELETE FROM auth_rate_limits
  WHERE created_at < now() - INTERVAL '24 hours';
END;
$$;


ALTER FUNCTION "public"."cleanup_expired_rate_limits"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."execute_book_search_v1"("p_query" "text", "p_page" integer, "p_page_size" integer, "p_sort" "text", "p_genres" "text"[], "p_subjects" "text"[], "p_languages" "text"[], "p_publication_years" integer[], "p_include_unavailable" boolean) RETURNS TABLE("book_id" "uuid", "slug" "text", "title" "text", "subtitle" "text", "authors" "text"[], "genres" "text"[], "subjects" "text"[], "language" "text", "average_rating" numeric, "rating_count" integer, "popularity_score" numeric, "relevance_score" numeric, "total_count" bigint, "is_typo_fallback" boolean, "suggested_query" "text")
    LANGUAGE "plpgsql"
    AS $$
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
            AND (array_length(p_genres, 1) IS NULL OR d.genres && p_genres)
            AND (array_length(p_subjects, 1) IS NULL OR d.subjects && p_subjects)
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
                CASE WHEN v_tsquery IS NOT NULL THEN ts_rank(d.fts_tokens, v_tsquery) ELSE 0 END AS base_rank
            FROM public.discovery_search_documents d
            WHERE 
                (v_tsquery IS NULL OR d.fts_tokens @@ v_tsquery)
                AND (array_length(p_genres, 1) IS NULL OR d.genres && p_genres)
                AND (array_length(p_subjects, 1) IS NULL OR d.subjects && p_subjects)
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
            false AS is_typo_fallback,
            NULL::TEXT AS suggested_query
        FROM scored_docs s
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
                    strict_word_similarity(v_normalized_query, d.authors[1])
                ) AS base_rank
            FROM public.discovery_search_documents d
            WHERE 
                (strict_word_similarity(v_normalized_query, d.title) > 0.25 
                 OR strict_word_similarity(v_normalized_query, d.authors[1]) > 0.25)
                AND (array_length(p_genres, 1) IS NULL OR d.genres && p_genres)
                AND (array_length(p_subjects, 1) IS NULL OR d.subjects && p_subjects)
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
            s.doc_title::TEXT AS suggested_query
        FROM scored_docs s
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
$$;


ALTER FUNCTION "public"."execute_book_search_v1"("p_query" "text", "p_page" integer, "p_page_size" integer, "p_sort" "text", "p_genres" "text"[], "p_subjects" "text"[], "p_languages" "text"[], "p_publication_years" integer[], "p_include_unavailable" boolean) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."format_file_size"("size_bytes" bigint) RETURNS "text"
    LANGUAGE "plpgsql" IMMUTABLE
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
BEGIN
  IF size_bytes IS NULL THEN
    RETURN 'Unknown';
  ELSIF size_bytes < 1024 THEN
    RETURN size_bytes || ' B';
  ELSIF size_bytes < 1024 * 1024 THEN
    RETURN ROUND(size_bytes / 1024.0, 1) || ' KB';
  ELSIF size_bytes < 1024 * 1024 * 1024 THEN
    RETURN ROUND(size_bytes / (1024.0 * 1024), 1) || ' MB';
  ELSE
    RETURN ROUND(size_bytes / (1024.0 * 1024 * 1024), 1) || ' GB';
  END IF;
END;
$$;


ALTER FUNCTION "public"."format_file_size"("size_bytes" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_active_announcements"("p_user_role" "text" DEFAULT 'user'::"text") RETURNS TABLE("id" "uuid", "title" "text", "content" "text", "type" "text", "starts_at" timestamp with time zone, "ends_at" timestamp with time zone)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.title,
        a.content,
        a.type,
        a.starts_at,
        a.ends_at
    FROM announcements a
    WHERE a.is_active = true
    AND (a.starts_at IS NULL OR a.starts_at <= NOW())
    AND (a.ends_at IS NULL OR a.ends_at >= NOW())
    AND ('all' = ANY(a.target_audience) OR p_user_role = ANY(a.target_audience))
    ORDER BY a.created_at DESC;
END;
$$;


ALTER FUNCTION "public"."get_active_announcements"("p_user_role" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_recent_searches_v1"("p_user_id" "uuid") RETURNS TABLE("query" "text", "searched_at" timestamp with time zone)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT q.query, q.searched_at
    FROM (
        SELECT DISTINCT ON (sh.normalized_query)
            sh.query,
            sh.searched_at
        FROM public.search_history sh
        WHERE sh.user_id = p_user_id
        ORDER BY sh.normalized_query, sh.searched_at DESC
    ) q
    ORDER BY q.searched_at DESC
    LIMIT 5;
END;
$$;


ALTER FUNCTION "public"."get_recent_searches_v1"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_search_autocomplete_v1"("p_query" "text") RETURNS TABLE("book_id" "uuid", "slug" "text", "title" "text", "author" "text", "reason" "text")
    LANGUAGE "plpgsql"
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
    BEGIN
        v_tsquery := to_tsquery('english', array_to_string(regexp_split_to_array(trim(p_query), '\s+'), ' & ') || ':*');
    EXCEPTION WHEN OTHERS THEN
        v_tsquery := NULL;
    END;

    RETURN QUERY
    WITH ranked_suggestions AS (
        SELECT 
            d.book_id, d.slug, d.title, d.authors[1] AS author,
            'PREFIX_TITLE'::text AS reason,
            1 AS rank_order,
            d.popularity_score
        FROM public.discovery_search_documents d
        WHERE d.title ILIKE v_prefix AND d.is_public = true

        UNION ALL

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


ALTER FUNCTION "public"."get_search_autocomplete_v1"("p_query" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_search_facets_v1"("p_query" "text", "p_genres" "text"[], "p_subjects" "text"[], "p_languages" "text"[], "p_publication_years" integer[], "p_include_unavailable" boolean) RETURNS TABLE("facet_key" "text", "facet_value" "text", "match_count" bigint)
    LANGUAGE "plpgsql"
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


ALTER FUNCTION "public"."get_search_facets_v1"("p_query" "text", "p_genres" "text"[], "p_subjects" "text"[], "p_languages" "text"[], "p_publication_years" integer[], "p_include_unavailable" boolean) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_genre_distribution"("matches_user_id" "uuid") RETURNS TABLE("genre" "text", "count" bigint)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$ BEGIN RETURN QUERY
SELECT b.genre,
    COUNT(rl.id) as count
FROM reading_list rl
    JOIN books b ON rl.book_id = b.id
WHERE rl.user_id = matches_user_id
    AND rl.status = 'finished' -- Only count finished books for "Read" distribution
GROUP BY b.genre
ORDER BY count DESC;
END;
$$;


ALTER FUNCTION "public"."get_user_genre_distribution"("matches_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_permissions"("p_user_id" "uuid") RETURNS TABLE("permission" character varying)
    LANGUAGE "sql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
    SELECT DISTINCT rp.permission
    FROM user_roles ur
    JOIN role_permissions rp ON ur.role = rp.role
    WHERE ur.user_id = p_user_id;
$$;


ALTER FUNCTION "public"."get_user_permissions"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', 'User'));

    INSERT INTO public.user_preferences (user_id) VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING;
    INSERT INTO public.user_progress (user_id) VALUES (NEW.id);
    INSERT INTO public.user_private (user_id) VALUES (NEW.id);

    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."has_permission"("p_user_id" "uuid", "p_permission" character varying) RETURNS boolean
    LANGUAGE "sql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
    SELECT EXISTS (
        SELECT 1
        FROM user_roles ur
        JOIN role_permissions rp ON ur.role = rp.role
        WHERE ur.user_id = p_user_id
        AND rp.permission = p_permission
    );
$$;


ALTER FUNCTION "public"."has_permission"("p_user_id" "uuid", "p_permission" character varying) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."immutable_array_to_string"("arr" "text"[], "sep" "text") RETURNS "text"
    LANGUAGE "sql" IMMUTABLE PARALLEL SAFE
    AS $$SELECT array_to_string(arr, sep)$$;


ALTER FUNCTION "public"."immutable_array_to_string"("arr" "text"[], "sep" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."increment_analytics_book_completed"("p_book_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO public.analytics_book_statistics (book_id, completions)
    VALUES (p_book_id, 1)
    ON CONFLICT (book_id) DO UPDATE SET
        completions = analytics_book_statistics.completions + 1;
END;
$$;


ALTER FUNCTION "public"."increment_analytics_book_completed"("p_book_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."increment_analytics_book_pages"("p_book_id" "uuid", "p_pages" integer) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO public.analytics_book_statistics (book_id, pages_read_total)
    VALUES (p_book_id, p_pages)
    ON CONFLICT (book_id) DO UPDATE SET
        pages_read_total = analytics_book_statistics.pages_read_total + p_pages;
END;
$$;


ALTER FUNCTION "public"."increment_analytics_book_pages"("p_book_id" "uuid", "p_pages" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."increment_analytics_book_reads"("p_book_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO public.analytics_book_statistics (book_id, total_reads)
    VALUES (p_book_id, 1)
    ON CONFLICT (book_id) DO UPDATE SET
        total_reads = analytics_book_statistics.total_reads + 1;
END;
$$;


ALTER FUNCTION "public"."increment_analytics_book_reads"("p_book_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."increment_analytics_daily_completed"("p_user_id" "uuid", "p_date" "date") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO public.analytics_user_daily (user_id, date, books_completed)
    VALUES (p_user_id, p_date, 1)
    ON CONFLICT (user_id, date) DO UPDATE SET
        books_completed = analytics_user_daily.books_completed + 1;
END;
$$;


ALTER FUNCTION "public"."increment_analytics_daily_completed"("p_user_id" "uuid", "p_date" "date") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."increment_analytics_daily_pages"("p_user_id" "uuid", "p_date" "date", "p_pages" integer) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO public.analytics_user_daily (user_id, date, pages_read, streak_active)
    VALUES (p_user_id, p_date, p_pages, true)
    ON CONFLICT (user_id, date) DO UPDATE SET
        pages_read = analytics_user_daily.pages_read + p_pages;
END;
$$;


ALTER FUNCTION "public"."increment_analytics_daily_pages"("p_user_id" "uuid", "p_date" "date", "p_pages" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."increment_analytics_genre_completed"("p_user_id" "uuid", "p_genre" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO public.analytics_user_genres (user_id, genre, books_completed)
    VALUES (p_user_id, p_genre, 1)
    ON CONFLICT (user_id, genre) DO UPDATE SET
        books_completed = analytics_user_genres.books_completed + 1;
END;
$$;


ALTER FUNCTION "public"."increment_analytics_genre_completed"("p_user_id" "uuid", "p_genre" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."increment_analytics_genre_likes"("p_user_id" "uuid", "p_genre" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO public.analytics_user_genres (user_id, genre, likes_count)
    VALUES (p_user_id, p_genre, 1)
    ON CONFLICT (user_id, genre) DO UPDATE SET
        likes_count = analytics_user_genres.likes_count + 1;
END;
$$;


ALTER FUNCTION "public"."increment_analytics_genre_likes"("p_user_id" "uuid", "p_genre" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."increment_analytics_genre_pages"("p_user_id" "uuid", "p_genre" "text", "p_pages" integer) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO public.analytics_user_genres (user_id, genre, pages_read)
    VALUES (p_user_id, p_genre, p_pages)
    ON CONFLICT (user_id, genre) DO UPDATE SET
        pages_read = analytics_user_genres.pages_read + p_pages;
END;
$$;


ALTER FUNCTION "public"."increment_analytics_genre_pages"("p_user_id" "uuid", "p_genre" "text", "p_pages" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."increment_analytics_genre_rating"("p_user_id" "uuid", "p_genre" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO public.analytics_user_genres (user_id, genre, ratings_count)
    VALUES (p_user_id, p_genre, 1)
    ON CONFLICT (user_id, genre) DO UPDATE SET
        ratings_count = analytics_user_genres.ratings_count + 1;
END;
$$;


ALTER FUNCTION "public"."increment_analytics_genre_rating"("p_user_id" "uuid", "p_genre" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."increment_analytics_genre_started"("p_user_id" "uuid", "p_genre" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO public.analytics_user_genres (user_id, genre, books_started)
    VALUES (p_user_id, p_genre, 1)
    ON CONFLICT (user_id, genre) DO UPDATE SET
        books_started = analytics_user_genres.books_started + 1;
END;
$$;


ALTER FUNCTION "public"."increment_analytics_genre_started"("p_user_id" "uuid", "p_genre" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."increment_analytics_monthly_completed"("p_user_id" "uuid", "p_month" character varying) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO public.analytics_user_monthly (user_id, month, books_completed)
    VALUES (p_user_id, p_month, 1)
    ON CONFLICT (user_id, month) DO UPDATE SET
        books_completed = analytics_user_monthly.books_completed + 1;
END;
$$;


ALTER FUNCTION "public"."increment_analytics_monthly_completed"("p_user_id" "uuid", "p_month" character varying) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."increment_analytics_monthly_pages"("p_user_id" "uuid", "p_month" character varying, "p_pages" integer) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO public.analytics_user_monthly (user_id, month, pages_read)
    VALUES (p_user_id, p_month, p_pages)
    ON CONFLICT (user_id, month) DO UPDATE SET
        pages_read = analytics_user_monthly.pages_read + p_pages;
END;
$$;


ALTER FUNCTION "public"."increment_analytics_monthly_pages"("p_user_id" "uuid", "p_month" character varying, "p_pages" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."increment_download_count"("target_book_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    UPDATE public.books
    SET download_count = COALESCE(download_count, 0) + 1
    WHERE id = target_book_id;
END;
$$;


ALTER FUNCTION "public"."increment_download_count"("target_book_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."match_books"("query_embedding" "extensions"."vector", "match_threshold" double precision, "match_count" integer) RETURNS TABLE("id" "uuid", "title" "text", "author" "text", "cover_url" "text", "similarity" double precision)
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public', 'extensions'
    AS $$ BEGIN RETURN QUERY
SELECT books.id,
    books.title,
    books.author,
    books.cover_url,
    1 - (books.embedding <=> query_embedding) as similarity
FROM books
WHERE 1 - (books.embedding <=> query_embedding) > match_threshold
ORDER BY books.embedding <=> query_embedding
LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."match_books"("query_embedding" "extensions"."vector", "match_threshold" double precision, "match_count" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."normalize_search_query"("p_query" "text") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    v_words text[];
    v_word text;
    v_normalized text := '';
    v_canonical text;
BEGIN
    v_words := regexp_split_to_array(lower(trim(p_query)), '\s+');
    
    FOREACH v_word IN ARRAY v_words
    LOOP
        SELECT canonical INTO v_canonical
        FROM public.search_synonyms
        WHERE synonym = v_word;
        
        IF v_canonical IS NOT NULL THEN
            v_normalized := v_normalized || ' ' || v_canonical;
        ELSE
            v_normalized := v_normalized || ' ' || v_word;
        END IF;
    END LOOP;
    
    RETURN trim(v_normalized);
END;
$$;


ALTER FUNCTION "public"."normalize_search_query"("p_query" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."prune_system_logs"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
    -- Automatically delete system logs that are older than 30 days
    DELETE FROM public.system_logs 
    WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$;


ALTER FUNCTION "public"."prune_system_logs"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."recalculate_analytics_book_rating"("p_book_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    v_avg NUMERIC;
    v_count INTEGER;
BEGIN
    SELECT COALESCE(AVG(rating), 0), COUNT(rating)
    INTO v_avg, v_count
    FROM public.ratings
    WHERE book_id = p_book_id;

    INSERT INTO public.analytics_book_statistics (book_id, average_rating, rating_count)
    VALUES (p_book_id, v_avg, v_count)
    ON CONFLICT (book_id) DO UPDATE SET
        average_rating = v_avg,
        rating_count = v_count;
END;
$$;


ALTER FUNCTION "public"."recalculate_analytics_book_rating"("p_book_id" "uuid") OWNER TO "postgres";


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


ALTER FUNCTION "public"."refresh_category_document"("target_category" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."refresh_recommendation_signals"("target_user_id" "uuid" DEFAULT NULL::"uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    -- This function reconciles facts from canonical tables to the discovery projection.
    
    INSERT INTO public.discovery_recommendation_signals (
        user_id, book_id, liked, rating, completion_percent, interaction_count, last_activity_at, updated_at
    )
    SELECT 
        COALESCE(l.user_id, r.user_id, s.user_id),
        COALESCE(l.book_id, r.book_id, s.book_id),
        l.id IS NOT NULL as liked,
        r.rating,
        COALESCE(s.percentage, 0) as completion_percent,
        (CASE WHEN l.id IS NOT NULL THEN 1 ELSE 0 END) + 
        (CASE WHEN r.id IS NOT NULL THEN 1 ELSE 0 END) + 
        (CASE WHEN s.id IS NOT NULL THEN 1 ELSE 0 END) as interaction_count,
        GREATEST(l.created_at, r.created_at, s.last_read_at) as last_activity_at,
        NOW() as updated_at
    FROM 
        (SELECT id, user_id, book_id, created_at FROM public.book_likes WHERE (target_user_id IS NULL OR user_id = target_user_id)) l
    FULL OUTER JOIN 
        (SELECT id, user_id, book_id, rating, created_at FROM public.ratings WHERE (target_user_id IS NULL OR user_id = target_user_id)) r
    ON l.user_id = r.user_id AND l.book_id = r.book_id
    FULL OUTER JOIN 
        (SELECT id, user_id, book_id, percentage, last_read_at FROM public.reader_sessions WHERE (target_user_id IS NULL OR user_id = target_user_id)) s
    ON COALESCE(l.user_id, r.user_id) = s.user_id AND COALESCE(l.book_id, r.book_id) = s.book_id
    ON CONFLICT (user_id, book_id) DO UPDATE SET
        liked = EXCLUDED.liked,
        rating = EXCLUDED.rating,
        completion_percent = EXCLUDED.completion_percent,
        interaction_count = EXCLUDED.interaction_count,
        last_activity_at = EXCLUDED.last_activity_at,
        updated_at = EXCLUDED.updated_at;
END;
$$;


ALTER FUNCTION "public"."refresh_recommendation_signals"("target_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."refresh_search_document"("target_book_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
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


ALTER FUNCTION "public"."refresh_search_document"("target_book_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."refresh_trending_searches_v1"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.trending_searches_v1;
END;
$$;


ALTER FUNCTION "public"."refresh_trending_searches_v1"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sanitize_account_logs"("target_user_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    -- 1. Sanitize Audit Logs (actor_id becomes NULL automatically, but PII remains)
    -- We record an ACCOUNT_DELETED event without PII first, then nullify PII on the user's historical actions.
    
    INSERT INTO public.audit_logs (
        id, 
        action, 
        actor_id, 
        ip_address, 
        user_agent, 
        correlation_id, 
        metadata, 
        created_at
    ) VALUES (
        gen_random_uuid(),
        'ACCOUNT_DELETED',
        target_user_id,
        NULL,
        NULL,
        NULL,
        jsonb_build_object('reason', 'user_requested_deletion', 'target_user_id', target_user_id),
        now()
    );

    UPDATE public.audit_logs
    SET 
        ip_address = NULL,
        user_agent = NULL,
        metadata = jsonb_build_object(
            'redacted', true, 
            'deletedAt', now(), 
            'reason', 'account_deleted'
        )
    WHERE actor_id = target_user_id;

    -- 2. Sanitize System Logs (No foreign key on user_id)
    UPDATE public.system_logs
    SET 
        ip_address = NULL,
        metadata = jsonb_build_object(
            'redacted', true, 
            'deletedAt', now(), 
            'reason', 'account_deleted'
        )
    WHERE user_id = target_user_id;

    -- 3. Cancel Pending Outbox Messages (No foreign key on aggregate_id)
    -- We assume aggregate_id corresponds to the user_id for user-centric aggregates
    UPDATE public.outbox_messages
    SET 
        status = 'cancelled',
        payload = '{}'::jsonb,
        processed_at = now()
    WHERE aggregate_id = target_user_id AND status = 'pending';

END;
$$;


ALTER FUNCTION "public"."sanitize_account_logs"("target_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."save_book_action_with_events"("p_action_type" "text", "p_user_id" "uuid", "p_book_id" "uuid", "p_action_data" "jsonb", "p_events" "jsonb") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    v_event JSONB;
BEGIN
    IF p_action_type = 'like' THEN
        INSERT INTO public.book_likes (book_id, user_id) VALUES (p_book_id, p_user_id) ON CONFLICT DO NOTHING;
    ELSIF p_action_type = 'unlike' THEN
        DELETE FROM public.book_likes WHERE book_id = p_book_id AND user_id = p_user_id;
    ELSIF p_action_type = 'rate' THEN
        INSERT INTO public.ratings (book_id, user_id, rating) 
        VALUES (p_book_id, p_user_id, (p_action_data->>'rating')::int)
        ON CONFLICT (book_id, user_id) DO UPDATE SET rating = EXCLUDED.rating;
    ELSIF p_action_type = 'review' THEN
        INSERT INTO public.reviews (book_id, user_id, content)
        VALUES (p_book_id, p_user_id, p_action_data->>'content');
    END IF;

    IF p_events IS NOT NULL AND jsonb_array_length(p_events) > 0 THEN
        FOR v_event IN SELECT * FROM jsonb_array_elements(p_events)
        LOOP
            INSERT INTO public.outbox_messages (
                aggregate_type, aggregate_id, event_type, event_version, payload, occurred_at
            ) VALUES (
                v_event->>'aggregate_type',
                (v_event->>'aggregate_id')::uuid,
                v_event->>'event_type',
                COALESCE((v_event->>'event_version')::int, 1),
                v_event->'payload',
                COALESCE((v_event->>'occurred_at')::timestamptz, NOW())
            );
        END LOOP;
    END IF;
END;
$$;


ALTER FUNCTION "public"."save_book_action_with_events"("p_action_type" "text", "p_user_id" "uuid", "p_book_id" "uuid", "p_action_data" "jsonb", "p_events" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."save_book_aggregate_with_events"("p_book" "jsonb", "p_events" "jsonb") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    v_event JSONB;
    v_book_id UUID;
    v_expected_version INTEGER;
    v_rows_affected INTEGER;
    v_is_new BOOLEAN;
BEGIN
    v_book_id := (p_book->>'id')::UUID;
    v_expected_version := COALESCE((p_book->>'version')::INTEGER, 1);

    SELECT NOT EXISTS(SELECT 1 FROM public.books WHERE id = v_book_id) INTO v_is_new;

    IF v_is_new THEN
        INSERT INTO public.books (
            id, title, description, is_textbook, is_published, is_archived, version, created_at, updated_at
        ) VALUES (
            v_book_id,
            p_book->>'title',
            p_book->>'description',
            COALESCE((p_book->>'is_textbook')::BOOLEAN, false),
            COALESCE((p_book->>'is_published')::BOOLEAN, false),
            COALESCE((p_book->>'is_archived')::BOOLEAN, false),
            v_expected_version,
            COALESCE((p_book->>'created_at')::TIMESTAMPTZ, NOW()),
            COALESCE((p_book->>'updated_at')::TIMESTAMPTZ, NOW())
        );
    ELSE
        UPDATE public.books
        SET
            title = p_book->>'title',
            description = p_book->>'description',
            is_textbook = COALESCE((p_book->>'is_textbook')::BOOLEAN, false),
            is_published = COALESCE((p_book->>'is_published')::BOOLEAN, false),
            is_archived = COALESCE((p_book->>'is_archived')::BOOLEAN, false),
            version = v_expected_version,
            updated_at = COALESCE((p_book->>'updated_at')::TIMESTAMPTZ, NOW())
        WHERE id = v_book_id
          AND version = v_expected_version - 1;

        GET DIAGNOSTICS v_rows_affected = ROW_COUNT;

        IF v_rows_affected = 0 THEN
            RAISE EXCEPTION 'Concurrency conflict: book % was modified by another editor (expected version %)',
                v_book_id, v_expected_version - 1
                USING ERRCODE = 'serialization_failure';
        END IF;
    END IF;

    IF p_events IS NOT NULL AND jsonb_array_length(p_events) > 0 THEN
        FOR v_event IN SELECT * FROM jsonb_array_elements(p_events)
        LOOP
            INSERT INTO public.outbox_events (
                aggregate_type, aggregate_id, event_type, event_version, payload, occurred_at
            ) VALUES (
                v_event->>'aggregate_type',
                (v_event->>'aggregate_id')::uuid,
                v_event->>'event_type',
                COALESCE((v_event->>'event_version')::int, 1),
                v_event->'payload',
                COALESCE((v_event->>'occurred_at')::timestamptz, NOW())
            );
        END LOOP;
    END IF;
END;
$$;


ALTER FUNCTION "public"."save_book_aggregate_with_events"("p_book" "jsonb", "p_events" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."save_reader_session_with_events"("p_user_id" "uuid", "p_book_id" "uuid", "p_current_page" integer, "p_percentage" numeric, "p_library_status" "text", "p_events" "jsonb") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    v_event JSONB;
BEGIN
    INSERT INTO public.reader_sessions (user_id, book_id, current_page, percentage, last_read_at)
    VALUES (p_user_id, p_book_id, p_current_page, p_percentage, NOW())
    ON CONFLICT (user_id, book_id) DO UPDATE SET
        current_page = EXCLUDED.current_page,
        percentage = EXCLUDED.percentage,
        last_read_at = EXCLUDED.last_read_at;

    INSERT INTO public.library_books (user_id, book_id, status, updated_at)
    VALUES (p_user_id, p_book_id, p_library_status::reading_status, NOW())
    ON CONFLICT (user_id, book_id) DO UPDATE SET
        status = EXCLUDED.status,
        updated_at = EXCLUDED.updated_at;

    IF p_events IS NOT NULL AND jsonb_array_length(p_events) > 0 THEN
        FOR v_event IN SELECT * FROM jsonb_array_elements(p_events)
        LOOP
            INSERT INTO public.outbox_messages (
                aggregate_type, aggregate_id, event_type, event_version, payload, occurred_at
            ) VALUES (
                v_event->>'aggregate_type',
                (v_event->>'aggregate_id')::uuid,
                v_event->>'event_type',
                COALESCE((v_event->>'event_version')::int, 1),
                v_event->'payload',
                COALESCE((v_event->>'occurred_at')::timestamptz, NOW())
            );
        END LOOP;
    END IF;
END;
$$;


ALTER FUNCTION "public"."save_reader_session_with_events"("p_user_id" "uuid", "p_book_id" "uuid", "p_current_page" integer, "p_percentage" numeric, "p_library_status" "text", "p_events" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."search_books_fts"("search_query" "text", "genre_filter" "text" DEFAULT NULL::"text", "page_number" integer DEFAULT 1, "page_size" integer DEFAULT 12) RETURNS TABLE("id" "uuid", "title" "text", "author" "text", "cover_url" "text", "genre" "text", "similarity" real)
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
DECLARE
  ts_query tsquery;
  offset_val integer;
BEGIN
  offset_val := (page_number - 1) * page_size;
  
  IF search_query IS NULL OR length(trim(search_query)) = 0 THEN
    RETURN QUERY SELECT b.id, b.title, b.author, b.cover_url, b.genre, 0::real FROM books b LIMIT page_size OFFSET offset_val;
    RETURN;
  END IF;

  BEGIN
    ts_query := plainto_tsquery('english', search_query);
  EXCEPTION WHEN others THEN
    RAISE NOTICE 'Invalid tsquery: %', search_query;
    ts_query := NULL;
  END;

  IF ts_query IS NULL THEN
     RETURN QUERY SELECT b.id, b.title, b.author, b.cover_url, b.genre, 0::real FROM books b WHERE false;
  ELSE
     RETURN QUERY SELECT b.id, b.title, b.author, b.cover_url, b.genre, ts_rank(b.fts, ts_query)::real AS similarity 
     FROM books b 
     WHERE b.fts @@ ts_query AND (genre_filter IS NULL OR b.genre = genre_filter)
     ORDER BY similarity DESC LIMIT page_size OFFSET offset_val;
  END IF;
END;
$$;


ALTER FUNCTION "public"."search_books_fts"("search_query" "text", "genre_filter" "text", "page_number" integer, "page_size" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."search_catalog"("search_query" "text", "genre_filter" "text" DEFAULT 'all'::"text", "page_num" integer DEFAULT 1, "page_size" integer DEFAULT 20) RETURNS TABLE("id" "uuid", "title" "text", "description" "text", "cover_url" "text", "language" "text", "release_date" "date", "publisher" "text", "isbn" "text", "pages" integer, "is_featured" boolean, "created_at" timestamp with time zone, "updated_at" timestamp with time zone, "total_count" bigint)
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  start_idx int := (page_num - 1) * page_size;
BEGIN
  RETURN QUERY
  WITH filtered_books AS (
    SELECT b.id
    FROM books b
    LEFT JOIN book_authors ba ON b.id = ba.book_id
    LEFT JOIN authors a ON ba.author_id = a.id
    LEFT JOIN book_genres bg ON b.id = bg.book_id
    LEFT JOIN genres g ON bg.genre_id = g.id
    LEFT JOIN book_subjects bs ON b.id = bs.book_id
    LEFT JOIN subjects s ON bs.subject_id = s.id
    WHERE 
      (search_query = '' OR search_query IS NULL OR 
       b.title ILIKE '%' || search_query || '%' OR 
       a.name ILIKE '%' || search_query || '%' OR 
       s.name ILIKE '%' || search_query || '%')
      AND (genre_filter = 'all' OR genre_filter IS NULL OR g.slug = genre_filter OR g.name = genre_filter)
    GROUP BY b.id
  ),
  counted AS (
    SELECT count(*) AS total FROM filtered_books
  )
  SELECT 
    b.id,
    b.title,
    b.description,
    b.cover_url,
    b.language,
    b.release_date,
    b.publisher,
    b.isbn,
    b.pages,
    b.is_featured,
    b.created_at,
    b.updated_at,
    c.total::bigint
  FROM books b
  JOIN filtered_books fb ON b.id = fb.id
  CROSS JOIN counted c
  ORDER BY b.title ASC
  LIMIT page_size OFFSET start_idx;
END;
$$;


ALTER FUNCTION "public"."search_catalog"("search_query" "text", "genre_filter" "text", "page_num" integer, "page_size" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."toggle_maintenance_mode"("p_enabled" boolean, "p_message" "text" DEFAULT NULL::"text") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  v_config jsonb;
BEGIN
  IF p_enabled IS NULL THEN RAISE EXCEPTION 'enabled cannot be null'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  v_config := jsonb_build_object(
    'enabled', p_enabled,
    'message', COALESCE(p_message, 'We are currently performing maintenance. Please check back soon.')
  );

  INSERT INTO public.site_config (key, value, updated_by)
  VALUES ('maintenance_mode', v_config, auth.uid())
  ON CONFLICT (key) DO UPDATE
  SET value = EXCLUDED.value, updated_by = EXCLUDED.updated_by, updated_at = NOW();

  INSERT INTO public.system_logs (actor_id, action, metadata)
  VALUES (auth.uid(), 'maintenance.toggle', jsonb_build_object('enabled', p_enabled));

  RETURN v_config;
END;
$$;


ALTER FUNCTION "public"."toggle_maintenance_mode"("p_enabled" boolean, "p_message" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_citations_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_citations_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_modified_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public', 'pg_catalog'
    AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_modified_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_reading_queue_order"("updates" "jsonb") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE item jsonb;
BEGIN FOR item IN
SELECT *
FROM jsonb_array_elements(updates) LOOP
UPDATE reading_list
SET queue_order = (item->>'order')::int
WHERE id = (item->>'id')::uuid
    AND user_id = auth.uid();
END LOOP;
END;
$$;


ALTER FUNCTION "public"."update_reading_queue_order"("updates" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_search_document_fts"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Weight A: Title, Authors
  -- Weight B: Genres, Subjects
  -- Weight C: Subtitle, Description
  
  NEW.fts_tokens :=
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.authors, ' '), '')), 'A') ||
    
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.genres, ' '), '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.subjects, ' '), '')), 'B') ||
    
    setweight(to_tsvector('english', COALESCE(NEW.subtitle, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'C');
    
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_search_document_fts"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_user_settings_timestamp"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$ BEGIN NEW.updated_at = now();
RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_user_settings_timestamp"() OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."annotations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "book_id" "uuid" NOT NULL,
    "highlight_id" "uuid",
    "location_anchor" "jsonb" NOT NULL,
    "body_markdown" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."annotations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."announcements" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "content" "text" NOT NULL,
    "type" "text" DEFAULT 'info'::"text" NOT NULL,
    "link_url" "text",
    "link_text" "text",
    "is_dismissible" boolean DEFAULT true,
    "is_active" boolean DEFAULT true,
    "starts_at" timestamp with time zone NOT NULL,
    "ends_at" timestamp with time zone NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "language" "text" DEFAULT 'en'::"text" NOT NULL
);


ALTER TABLE "public"."announcements" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."authors" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "bio" "text",
    "avatar_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."authors" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."book_assets" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "book_id" "uuid",
    "asset_type" "text" NOT NULL,
    "asset_url" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."book_assets" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."book_authors" (
    "book_id" "uuid" NOT NULL,
    "author_id" "uuid" NOT NULL,
    "position" integer DEFAULT 0 NOT NULL,
    CONSTRAINT "book_authors_position_nonnegative" CHECK (("position" >= 0))
);


ALTER TABLE "public"."book_authors" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."book_files" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "book_id" "uuid",
    "format" "text" NOT NULL,
    "size" bigint,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "storage_path" "text",
    "checksum" "text",
    "mime_type" "text",
    "version" integer DEFAULT 1,
    "is_primary" boolean DEFAULT false,
    "language" "text" DEFAULT 'en'::"text" NOT NULL
);


ALTER TABLE "public"."book_files" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."book_genres" (
    "book_id" "uuid" NOT NULL,
    "genre_id" "uuid" NOT NULL
);


ALTER TABLE "public"."book_genres" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."book_subjects" (
    "book_id" "uuid" NOT NULL,
    "subject_id" "uuid" NOT NULL
);


ALTER TABLE "public"."book_subjects" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bookmarks" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "book_id" "uuid" NOT NULL,
    "page_number" integer NOT NULL,
    "label" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."bookmarks" OWNER TO "postgres";


COMMENT ON TABLE "public"."bookmarks" IS 'User bookmarks for specific pages in books';



CREATE TABLE IF NOT EXISTS "public"."books" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "release_date" "date",
    "cover_url" "text",
    "isbn" "text",
    "pages" integer,
    "publisher" "text",
    "language" "text" DEFAULT 'English'::"text",
    "is_featured" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "pdf_url" "text",
    "epub_url" "text",
    "format" "text" DEFAULT 'pdf'::"text",
    "file_size_mb" numeric,
    "download_count" integer DEFAULT 0,
    "view_count" integer DEFAULT 0,
    "file_size" bigint,
    "series" character varying(255),
    "series_order" integer,
    "is_textbook" boolean DEFAULT false,
    "edition" "text",
    "total_pages" integer DEFAULT 100,
    "fts" "tsvector",
    "embedding" "extensions"."vector"(1536),
    "hash" "text",
    "is_published" boolean DEFAULT false NOT NULL,
    "is_archived" boolean DEFAULT false NOT NULL,
    "version" integer DEFAULT 1 NOT NULL,
    "language_id" "uuid",
    CONSTRAINT "books_format_check" CHECK (("format" = ANY (ARRAY['pdf'::"text", 'epub'::"text", 'both'::"text"])))
);


ALTER TABLE "public"."books" OWNER TO "postgres";


COMMENT ON COLUMN "public"."books"."pdf_url" IS 'URL to the PDF file in storage';



COMMENT ON COLUMN "public"."books"."epub_url" IS 'URL to the EPUB file in storage';



COMMENT ON COLUMN "public"."books"."file_size" IS 'PDF file size in bytes';



CREATE TABLE IF NOT EXISTS "public"."collection_books" (
    "collection_id" "uuid" NOT NULL,
    "book_id" "uuid" NOT NULL,
    "position" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."collection_books" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."collections" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "description" "text",
    "cover_url" "text",
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."collections" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."discovery_autocomplete_documents" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "query" "text" NOT NULL,
    "score" numeric DEFAULT 0,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "source_updated_at" timestamp with time zone,
    "indexed_by" "text"
);


ALTER TABLE "public"."discovery_autocomplete_documents" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."discovery_search_documents" (
    "book_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "subtitle" "text",
    "authors" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "language" "text" NOT NULL,
    "description" "text",
    "publication_year" integer,
    "popularity_score" numeric DEFAULT 0,
    "fts_tokens" "tsvector",
    "download_count" integer DEFAULT 0,
    "projection_version" integer DEFAULT 1,
    "indexed_at" timestamp with time zone DEFAULT "now"(),
    "source_updated_at" timestamp with time zone,
    "indexed_by" "text",
    "slug" "text" DEFAULT 'unknown'::"text" NOT NULL,
    "genres" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "subjects" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "is_public" boolean DEFAULT true NOT NULL,
    "view_count" integer DEFAULT 0 NOT NULL,
    "average_rating" numeric(3,2) DEFAULT 0 NOT NULL,
    "rating_count" integer DEFAULT 0 NOT NULL,
    "last_index_reason" "text",
    "last_index_duration_ms" integer,
    "last_projection_version" integer,
    CONSTRAINT "discovery_search_documents_last_index_reason_check" CHECK (("last_index_reason" = ANY (ARRAY['CREATE'::"text", 'UPDATE'::"text", 'DELETE'::"text", 'REBUILD'::"text"])))
);


ALTER TABLE "public"."discovery_search_documents" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."export_requests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "status" "public"."export_request_status" DEFAULT 'requested'::"public"."export_request_status" NOT NULL,
    "download_url" "text",
    "requested_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "queued_at" timestamp with time zone,
    "completed_at" timestamp with time zone,
    "expires_at" timestamp with time zone,
    "error_message" "text"
);


ALTER TABLE "public"."export_requests" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."faqs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "question" "text" NOT NULL,
    "answer" "text" NOT NULL,
    "category" "text" DEFAULT 'General'::"text",
    "display_order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "language" "text" DEFAULT 'en'::"text" NOT NULL
);


ALTER TABLE "public"."faqs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."featured_books" (
    "book_id" "uuid" NOT NULL,
    "position" integer DEFAULT 0 NOT NULL,
    "starts_at" timestamp with time zone,
    "ends_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."featured_books" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."featured_books_projection" (
    "book_id" "uuid" NOT NULL,
    "featured_order" integer NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."featured_books_projection" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."genres" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "description" "text",
    "icon" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."genres" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."highlights" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "book_id" "uuid" NOT NULL,
    "location_anchor" "jsonb" NOT NULL,
    "selected_text" "text" NOT NULL,
    "color" character varying(20) DEFAULT 'yellow'::character varying,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."highlights" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."job_failures" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "job_type" "text" NOT NULL,
    "payload" "jsonb" NOT NULL,
    "error" "text" NOT NULL,
    "failed_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "retry_count" integer DEFAULT 0 NOT NULL,
    "worker" "text",
    "stack_trace" "text"
);


ALTER TABLE "public"."job_failures" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."job_queue" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "job_type" "text" NOT NULL,
    "payload" "jsonb" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "attempts" integer DEFAULT 0 NOT NULL,
    "scheduled_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "started_at" timestamp with time zone,
    "completed_at" timestamp with time zone,
    "last_error" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."job_queue" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."languages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "code" "text" NOT NULL,
    "name" "text" NOT NULL,
    "native_name" "text" NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."languages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."library_books" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "book_id" "uuid" NOT NULL,
    "status" "public"."reading_status" DEFAULT 'want_to_read'::"public"."reading_status" NOT NULL,
    "queue_order" integer DEFAULT 0,
    "added_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."library_books" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."new_arrivals_projection" (
    "book_id" "uuid" NOT NULL,
    "arrival_date" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."new_arrivals_projection" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notes" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "book_id" "uuid",
    "title" "text" NOT NULL,
    "content" "text",
    "tags" "text"[],
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."notes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "event_name" "text" NOT NULL,
    "aggregate_id" "text" NOT NULL,
    "aggregate_type" "text" NOT NULL,
    "type" "text" NOT NULL,
    "title" "text" NOT NULL,
    "body" "text" NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "read_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    CONSTRAINT "notifications_type_check" CHECK (("type" = ANY (ARRAY['INFO'::"text", 'SUCCESS'::"text", 'WARNING'::"text", 'ERROR'::"text"])))
);


ALTER TABLE "public"."notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."pages" (
    "slug" "text" NOT NULL,
    "title" "text" NOT NULL,
    "content" "text" NOT NULL,
    "published_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "language" "text" DEFAULT 'en'::"text" NOT NULL
);


ALTER TABLE "public"."pages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."popular_books_projection" (
    "book_id" "uuid" NOT NULL,
    "popularity_score" numeric DEFAULT 0,
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."popular_books_projection" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."processed_events" (
    "event_id" "uuid" NOT NULL,
    "handler" "text" NOT NULL,
    "processed_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "duration_ms" integer
);


ALTER TABLE "public"."processed_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "display_name" "text",
    "avatar_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "bio" "text",
    "location" "text"
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."projection_checkpoints" (
    "projection_name" "text" NOT NULL,
    "last_processed_event_id" "uuid",
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."projection_checkpoints" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reading_goals" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "goal_type" "text" NOT NULL,
    "target_value" integer NOT NULL,
    "current_value" integer DEFAULT 0,
    "year" integer,
    "start_date" "date",
    "end_date" "date",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "reading_goals_goal_type_check" CHECK (("goal_type" = ANY (ARRAY['books_per_year'::"text", 'books_per_month'::"text", 'pages_per_day'::"text", 'pages_per_week'::"text", 'custom'::"text"])))
);


ALTER TABLE "public"."reading_goals" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reading_progress" (
    "user_id" "uuid" NOT NULL,
    "book_id" "uuid" NOT NULL,
    "location_anchor" "jsonb" NOT NULL,
    "last_read_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."reading_progress" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reading_sessions" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "book_id" "uuid" NOT NULL,
    "current_page" integer DEFAULT 0,
    "total_pages" integer,
    "percentage" numeric DEFAULT 0,
    "started_at" timestamp with time zone DEFAULT "now"(),
    "last_read_at" timestamp with time zone DEFAULT "now"(),
    "finished_at" timestamp with time zone,
    "reading_time_minutes" integer DEFAULT 0
);


ALTER TABLE "public"."reading_sessions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."search_history" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "query" "text" NOT NULL,
    "normalized_query" "text" NOT NULL,
    "searched_at" timestamp with time zone DEFAULT "now"(),
    "clicked_document_id" "uuid",
    "result_count" integer DEFAULT 0,
    "execution_time_ms" integer,
    "is_zero_result" boolean DEFAULT false,
    "is_slow_query" boolean DEFAULT false,
    "filters" "jsonb",
    "sort_strategy" "text"
);


ALTER TABLE "public"."search_history" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."search_synonyms" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "canonical" "text" NOT NULL,
    "synonym" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."search_synonyms" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."shelf_items" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "shelf_id" "uuid" NOT NULL,
    "book_id" "uuid" NOT NULL,
    "position" integer,
    "added_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."shelf_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."shelves" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "is_public" boolean DEFAULT false,
    "cover_image" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."shelves" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."subjects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."subjects" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tags" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "usage_count" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."tags" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."trending_books_projection" (
    "book_id" "uuid" NOT NULL,
    "daily_score" integer DEFAULT 0 NOT NULL,
    "weekly_score" integer DEFAULT 0 NOT NULL,
    "monthly_score" integer DEFAULT 0 NOT NULL,
    "all_time_score" integer DEFAULT 0 NOT NULL,
    "daily_rank" integer,
    "weekly_rank" integer,
    "monthly_rank" integer,
    "all_time_rank" integer,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."trending_books_projection" OWNER TO "postgres";


CREATE MATERIALIZED VIEW "public"."trending_searches_v1" AS
 SELECT "normalized_query",
    "count"(*) AS "search_count",
    "max"("searched_at") AS "last_searched_at"
   FROM "public"."search_history" "sh"
  WHERE (("searched_at" >= ("now"() - '7 days'::interval)) AND ("is_zero_result" = false))
  GROUP BY "normalized_query"
 HAVING ("count"(*) > 1)
  ORDER BY ("count"(*)) DESC, ("max"("searched_at")) DESC
 LIMIT 50
  WITH NO DATA;


ALTER MATERIALIZED VIEW "public"."trending_searches_v1" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_preferences" (
    "user_id" "uuid" NOT NULL,
    "theme" "text" DEFAULT 'dark'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "reader_theme" "text" DEFAULT 'light'::"text",
    "font_family" "text" DEFAULT 'inter'::"text",
    "font_size" integer DEFAULT 16,
    "line_height" numeric DEFAULT 1.5,
    "dictionary_language" "text" DEFAULT 'en'::"text",
    "ui_language" "text" DEFAULT 'en'::"text" NOT NULL,
    "content_languages" "text"[] DEFAULT '{en}'::"text"[] NOT NULL,
    CONSTRAINT "user_preferences_theme_check" CHECK (("theme" = ANY (ARRAY['light'::"text", 'dark'::"text", 'auto'::"text"])))
);


ALTER TABLE "public"."user_preferences" OWNER TO "postgres";


COMMENT ON TABLE "public"."user_preferences" IS 'Stores non-critical user settings like theme and notifications.';



CREATE TABLE IF NOT EXISTS "public"."user_statistics" (
    "user_id" "uuid" NOT NULL,
    "books_completed" integer DEFAULT 0,
    "books_started" integer DEFAULT 0,
    "pages_read" integer DEFAULT 0,
    "minutes_read" integer DEFAULT 0,
    "current_streak" integer DEFAULT 0,
    "longest_streak" integer DEFAULT 0,
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_statistics" OWNER TO "postgres";


ALTER TABLE ONLY "public"."announcements"
    ADD CONSTRAINT "announcements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."authors"
    ADD CONSTRAINT "authors_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."authors"
    ADD CONSTRAINT "authors_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."authors"
    ADD CONSTRAINT "authors_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."book_assets"
    ADD CONSTRAINT "book_assets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."book_authors"
    ADD CONSTRAINT "book_authors_pkey" PRIMARY KEY ("book_id", "author_id");



ALTER TABLE ONLY "public"."book_files"
    ADD CONSTRAINT "book_formats_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."book_genres"
    ADD CONSTRAINT "book_genres_pkey" PRIMARY KEY ("book_id", "genre_id");



ALTER TABLE ONLY "public"."book_subjects"
    ADD CONSTRAINT "book_subjects_pkey" PRIMARY KEY ("book_id", "subject_id");



ALTER TABLE ONLY "public"."bookmarks"
    ADD CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bookmarks"
    ADD CONSTRAINT "bookmarks_user_id_book_id_page_number_key" UNIQUE ("user_id", "book_id", "page_number");



ALTER TABLE ONLY "public"."books"
    ADD CONSTRAINT "books_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."collection_books"
    ADD CONSTRAINT "collection_books_pkey" PRIMARY KEY ("collection_id", "book_id");



ALTER TABLE ONLY "public"."collections"
    ADD CONSTRAINT "collections_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."collections"
    ADD CONSTRAINT "collections_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."discovery_autocomplete_documents"
    ADD CONSTRAINT "discovery_autocomplete_documents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."discovery_autocomplete_documents"
    ADD CONSTRAINT "discovery_autocomplete_documents_query_key" UNIQUE ("query");



ALTER TABLE ONLY "public"."discovery_search_documents"
    ADD CONSTRAINT "discovery_search_documents_pkey" PRIMARY KEY ("book_id");



ALTER TABLE ONLY "public"."export_requests"
    ADD CONSTRAINT "export_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."faqs"
    ADD CONSTRAINT "faqs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."featured_books"
    ADD CONSTRAINT "featured_books_pkey" PRIMARY KEY ("book_id");



ALTER TABLE ONLY "public"."featured_books_projection"
    ADD CONSTRAINT "featured_books_projection_pkey" PRIMARY KEY ("book_id");



ALTER TABLE ONLY "public"."genres"
    ADD CONSTRAINT "genres_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."genres"
    ADD CONSTRAINT "genres_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."genres"
    ADD CONSTRAINT "genres_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."job_failures"
    ADD CONSTRAINT "job_failures_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."job_queue"
    ADD CONSTRAINT "job_queue_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."languages"
    ADD CONSTRAINT "languages_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."languages"
    ADD CONSTRAINT "languages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."library_books"
    ADD CONSTRAINT "library_books_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."library_books"
    ADD CONSTRAINT "library_books_user_id_book_id_key" UNIQUE ("user_id", "book_id");



ALTER TABLE ONLY "public"."new_arrivals_projection"
    ADD CONSTRAINT "new_arrivals_projection_pkey" PRIMARY KEY ("book_id");



ALTER TABLE ONLY "public"."notes"
    ADD CONSTRAINT "notes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."outbox_events"
    ADD CONSTRAINT "outbox_messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pages"
    ADD CONSTRAINT "pages_pkey" PRIMARY KEY ("slug");



ALTER TABLE ONLY "public"."popular_books_projection"
    ADD CONSTRAINT "popular_books_projection_pkey" PRIMARY KEY ("book_id");



ALTER TABLE ONLY "public"."processed_events"
    ADD CONSTRAINT "processed_events_pkey" PRIMARY KEY ("event_id", "handler");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_new_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."projection_checkpoints"
    ADD CONSTRAINT "projection_checkpoints_pkey" PRIMARY KEY ("projection_name");



ALTER TABLE ONLY "public"."highlights"
    ADD CONSTRAINT "reader_highlights_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."annotations"
    ADD CONSTRAINT "reader_notes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reading_progress"
    ADD CONSTRAINT "reader_positions_pkey" PRIMARY KEY ("user_id", "book_id");



ALTER TABLE ONLY "public"."reading_sessions"
    ADD CONSTRAINT "reader_sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reading_sessions"
    ADD CONSTRAINT "reader_sessions_user_id_book_id_key" UNIQUE ("user_id", "book_id");



ALTER TABLE ONLY "public"."reading_goals"
    ADD CONSTRAINT "reading_goals_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."search_history"
    ADD CONSTRAINT "search_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."search_synonyms"
    ADD CONSTRAINT "search_synonyms_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."shelf_items"
    ADD CONSTRAINT "shelf_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."shelf_items"
    ADD CONSTRAINT "shelf_items_shelf_id_book_id_key" UNIQUE ("shelf_id", "book_id");



ALTER TABLE ONLY "public"."shelves"
    ADD CONSTRAINT "shelves_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."subjects"
    ADD CONSTRAINT "subjects_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."subjects"
    ADD CONSTRAINT "subjects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."subjects"
    ADD CONSTRAINT "subjects_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."tags"
    ADD CONSTRAINT "tags_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."tags"
    ADD CONSTRAINT "tags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tags"
    ADD CONSTRAINT "tags_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."trending_books_projection"
    ADD CONSTRAINT "trending_books_pkey" PRIMARY KEY ("book_id");



ALTER TABLE ONLY "public"."user_preferences"
    ADD CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."user_statistics"
    ADD CONSTRAINT "user_statistics_pkey" PRIMARY KEY ("user_id");



CREATE INDEX "bookmarks_user_book_idx" ON "public"."bookmarks" USING "btree" ("user_id", "book_id");



CREATE INDEX "discovery_search_documents_authors_trgm_idx" ON "public"."discovery_search_documents" USING "gin" ("public"."immutable_array_to_string"("authors", ' '::"text") "extensions"."gin_trgm_ops");



CREATE INDEX "discovery_search_documents_fts_idx" ON "public"."discovery_search_documents" USING "gin" ("fts_tokens");



CREATE INDEX "discovery_search_documents_popularity_idx" ON "public"."discovery_search_documents" USING "btree" ("popularity_score" DESC);



CREATE INDEX "discovery_search_documents_primary_author_trgm_idx" ON "public"."discovery_search_documents" USING "gin" (("authors"[1]) "extensions"."gin_trgm_ops");



CREATE INDEX "discovery_search_documents_title_trgm_idx" ON "public"."discovery_search_documents" USING "gin" ("title" "extensions"."gin_trgm_ops");



CREATE INDEX "export_requests_requested_at_idx" ON "public"."export_requests" USING "btree" ("requested_at" DESC);



CREATE INDEX "export_requests_user_id_status_idx" ON "public"."export_requests" USING "btree" ("user_id", "status");



CREATE INDEX "idx_book_authors_author_id" ON "public"."book_authors" USING "btree" ("author_id");



CREATE UNIQUE INDEX "idx_book_authors_unique_position" ON "public"."book_authors" USING "btree" ("book_id", "position");



CREATE INDEX "idx_bookmarks_user_book" ON "public"."bookmarks" USING "btree" ("user_id", "book_id");



CREATE INDEX "idx_books_created_at" ON "public"."books" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_books_embedding_ivfflat" ON "public"."books" USING "ivfflat" ("embedding" "extensions"."vector_cosine_ops") WITH ("lists"='100');



CREATE INDEX "idx_books_featured" ON "public"."books" USING "btree" ("is_featured");



CREATE INDEX "idx_books_format" ON "public"."books" USING "btree" ("format");



CREATE INDEX "idx_books_fts" ON "public"."books" USING "gin" ("fts");



CREATE UNIQUE INDEX "idx_books_hash_unique" ON "public"."books" USING "btree" ("hash") WHERE ("hash" IS NOT NULL);



CREATE INDEX "idx_books_is_featured" ON "public"."books" USING "btree" ("is_featured");



CREATE INDEX "idx_books_is_textbook" ON "public"."books" USING "btree" ("is_textbook");



CREATE INDEX "idx_books_pdf_url" ON "public"."books" USING "btree" ("pdf_url") WHERE ("pdf_url" IS NOT NULL);



CREATE INDEX "idx_books_title" ON "public"."books" USING "btree" ("title");



CREATE INDEX "idx_books_title_trgm" ON "public"."books" USING "gin" ("title" "extensions"."gin_trgm_ops");



CREATE INDEX "idx_discovery_search_documents_fts" ON "public"."discovery_search_documents" USING "gin" ("fts_tokens");



CREATE INDEX "idx_discovery_search_documents_lang" ON "public"."discovery_search_documents" USING "btree" ("language");



CREATE INDEX "idx_discovery_search_documents_popularity" ON "public"."discovery_search_documents" USING "btree" ("popularity_score" DESC);



CREATE INDEX "idx_library_books_book" ON "public"."library_books" USING "btree" ("book_id");



CREATE INDEX "idx_library_books_user" ON "public"."library_books" USING "btree" ("user_id");



CREATE INDEX "idx_library_books_user_status" ON "public"."library_books" USING "btree" ("user_id", "status");



CREATE INDEX "idx_notes_book_id" ON "public"."notes" USING "btree" ("book_id");



CREATE INDEX "idx_notes_user_id" ON "public"."notes" USING "btree" ("user_id");



CREATE UNIQUE INDEX "idx_notifications_idempotency" ON "public"."notifications" USING "btree" ("user_id", "event_name", "aggregate_id");



CREATE INDEX "idx_notifications_user_created" ON "public"."notifications" USING "btree" ("user_id", "created_at" DESC);



CREATE INDEX "idx_outbox_messages_aggregate" ON "public"."outbox_events" USING "btree" ("aggregate_type", "aggregate_id");



CREATE INDEX "idx_outbox_messages_status" ON "public"."outbox_events" USING "btree" ("status", "created_at");



CREATE INDEX "idx_preferences_user_id" ON "public"."user_preferences" USING "btree" ("user_id");



CREATE INDEX "idx_reader_highlights_user_book" ON "public"."highlights" USING "btree" ("user_id", "book_id");



CREATE INDEX "idx_reader_notes_user_book" ON "public"."annotations" USING "btree" ("user_id", "book_id");



CREATE INDEX "idx_reader_sessions_book" ON "public"."reading_sessions" USING "btree" ("book_id");



CREATE INDEX "idx_reader_sessions_user" ON "public"."reading_sessions" USING "btree" ("user_id");



CREATE INDEX "idx_reader_sessions_user_book" ON "public"."reading_sessions" USING "btree" ("user_id", "book_id");



CREATE INDEX "idx_reading_goals_active" ON "public"."reading_goals" USING "btree" ("is_active");



CREATE INDEX "idx_reading_goals_user_id" ON "public"."reading_goals" USING "btree" ("user_id");



CREATE INDEX "idx_search_docs_fts" ON "public"."discovery_search_documents" USING "gin" ("fts_tokens");



CREATE INDEX "idx_search_docs_is_public" ON "public"."discovery_search_documents" USING "btree" ("is_public");



CREATE INDEX "idx_search_docs_language" ON "public"."discovery_search_documents" USING "btree" ("language");



CREATE INDEX "idx_search_docs_proj_version" ON "public"."discovery_search_documents" USING "btree" ("projection_version");



CREATE INDEX "idx_search_docs_pub_year" ON "public"."discovery_search_documents" USING "btree" ("publication_year");



CREATE INDEX "idx_shelf_items_book" ON "public"."shelf_items" USING "btree" ("book_id");



CREATE INDEX "idx_shelf_items_shelf" ON "public"."shelf_items" USING "btree" ("shelf_id");



CREATE INDEX "idx_shelves_user" ON "public"."shelves" USING "btree" ("user_id");



CREATE INDEX "idx_tags_name" ON "public"."tags" USING "btree" ("name");



CREATE INDEX "idx_tags_slug" ON "public"."tags" USING "btree" ("slug");



CREATE INDEX "idx_trending_books_alltime" ON "public"."trending_books_projection" USING "btree" ("all_time_score" DESC);



CREATE INDEX "idx_trending_books_daily" ON "public"."trending_books_projection" USING "btree" ("daily_score" DESC);



CREATE INDEX "idx_trending_books_monthly" ON "public"."trending_books_projection" USING "btree" ("monthly_score" DESC);



CREATE INDEX "idx_trending_books_weekly" ON "public"."trending_books_projection" USING "btree" ("weekly_score" DESC);



CREATE INDEX "idx_user_preferences_user_id" ON "public"."user_preferences" USING "btree" ("user_id");



CREATE INDEX "search_history_normalized_query_idx" ON "public"."search_history" USING "btree" ("normalized_query");



CREATE INDEX "search_history_slow_query_idx" ON "public"."search_history" USING "btree" ("is_slow_query") WHERE ("is_slow_query" = true);



CREATE INDEX "search_history_user_id_idx" ON "public"."search_history" USING "btree" ("user_id");



CREATE INDEX "search_history_zero_result_idx" ON "public"."search_history" USING "btree" ("is_zero_result") WHERE ("is_zero_result" = true);



CREATE UNIQUE INDEX "search_synonyms_synonym_idx" ON "public"."search_synonyms" USING "btree" ("synonym");



CREATE UNIQUE INDEX "trending_searches_v1_query_idx" ON "public"."trending_searches_v1" USING "btree" ("normalized_query");



CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."library_books" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."shelves" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "trg_update_search_document_fts" BEFORE INSERT OR UPDATE OF "title", "subtitle", "description", "authors", "genres", "subjects" ON "public"."discovery_search_documents" FOR EACH ROW EXECUTE FUNCTION "public"."update_search_document_fts"();



CREATE OR REPLACE TRIGGER "update_books_updated_at" BEFORE UPDATE ON "public"."books" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_reader_notes_updated_at" BEFORE UPDATE ON "public"."annotations" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_timestamp" BEFORE UPDATE ON "public"."books" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_timestamp" BEFORE UPDATE ON "public"."notes" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_timestamp" BEFORE UPDATE ON "public"."reading_goals" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_timestamp" BEFORE UPDATE ON "public"."user_preferences" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."book_assets"
    ADD CONSTRAINT "book_assets_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."book_authors"
    ADD CONSTRAINT "book_authors_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."book_authors"
    ADD CONSTRAINT "book_authors_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."book_files"
    ADD CONSTRAINT "book_formats_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."book_genres"
    ADD CONSTRAINT "book_genres_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."book_genres"
    ADD CONSTRAINT "book_genres_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "public"."genres"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."book_subjects"
    ADD CONSTRAINT "book_subjects_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."book_subjects"
    ADD CONSTRAINT "book_subjects_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bookmarks"
    ADD CONSTRAINT "bookmarks_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bookmarks"
    ADD CONSTRAINT "bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."books"
    ADD CONSTRAINT "books_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "public"."languages"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."collection_books"
    ADD CONSTRAINT "collection_books_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."collection_books"
    ADD CONSTRAINT "collection_books_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."discovery_search_documents"
    ADD CONSTRAINT "discovery_search_documents_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."export_requests"
    ADD CONSTRAINT "export_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."featured_books"
    ADD CONSTRAINT "featured_books_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."featured_books_projection"
    ADD CONSTRAINT "featured_books_projection_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."library_books"
    ADD CONSTRAINT "library_books_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."library_books"
    ADD CONSTRAINT "library_books_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."new_arrivals_projection"
    ADD CONSTRAINT "new_arrivals_projection_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."popular_books_projection"
    ADD CONSTRAINT "popular_books_projection_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_new_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."highlights"
    ADD CONSTRAINT "reader_highlights_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."highlights"
    ADD CONSTRAINT "reader_highlights_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."annotations"
    ADD CONSTRAINT "reader_notes_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."annotations"
    ADD CONSTRAINT "reader_notes_highlight_id_fkey" FOREIGN KEY ("highlight_id") REFERENCES "public"."highlights"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."annotations"
    ADD CONSTRAINT "reader_notes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reading_progress"
    ADD CONSTRAINT "reader_positions_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reading_progress"
    ADD CONSTRAINT "reader_positions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reading_sessions"
    ADD CONSTRAINT "reader_sessions_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reading_sessions"
    ADD CONSTRAINT "reader_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reading_goals"
    ADD CONSTRAINT "reading_goals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."search_history"
    ADD CONSTRAINT "search_history_clicked_document_id_fkey" FOREIGN KEY ("clicked_document_id") REFERENCES "public"."discovery_search_documents"("book_id");



ALTER TABLE ONLY "public"."search_history"
    ADD CONSTRAINT "search_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."shelf_items"
    ADD CONSTRAINT "shelf_items_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."shelf_items"
    ADD CONSTRAINT "shelf_items_shelf_id_fkey" FOREIGN KEY ("shelf_id") REFERENCES "public"."shelves"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."shelves"
    ADD CONSTRAINT "shelves_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."trending_books_projection"
    ADD CONSTRAINT "trending_books_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_preferences"
    ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_statistics"
    ADD CONSTRAINT "user_statistics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



CREATE POLICY "Allow public read access" ON "public"."books" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Anyone can read search documents" ON "public"."discovery_search_documents" FOR SELECT USING (true);



CREATE POLICY "Books are viewable by everyone" ON "public"."books" FOR SELECT USING (true);



CREATE POLICY "FAQs are viewable by everyone" ON "public"."faqs" FOR SELECT USING (true);



CREATE POLICY "Only admins/workers can modify search documents" ON "public"."discovery_search_documents" USING (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Public can read books" ON "public"."books" FOR SELECT USING (true);



CREATE POLICY "Public can view active announcements" ON "public"."announcements" FOR SELECT USING ((("is_active" = true) AND ("starts_at" <= "now"()) AND ("ends_at" >= "now"())));



CREATE POLICY "Public profiles are viewable by everyone" ON "public"."discovery_search_documents" FOR SELECT USING (true);



CREATE POLICY "Public read access for authors" ON "public"."authors" FOR SELECT USING (true);



CREATE POLICY "Public read access for book_authors" ON "public"."book_authors" FOR SELECT USING (true);



CREATE POLICY "Public read access for book_genres" ON "public"."book_genres" FOR SELECT USING (true);



CREATE POLICY "Public read access for book_subjects" ON "public"."book_subjects" FOR SELECT USING (true);



CREATE POLICY "Public read access for genres" ON "public"."genres" FOR SELECT USING (true);



CREATE POLICY "Public read access for subjects" ON "public"."subjects" FOR SELECT USING (true);



CREATE POLICY "Public read collection_books" ON "public"."collection_books" FOR SELECT USING (true);



CREATE POLICY "Public read collections" ON "public"."collections" FOR SELECT USING (true);



CREATE POLICY "Public read featured_books" ON "public"."featured_books" FOR SELECT USING (true);



CREATE POLICY "Public read for book_files" ON "public"."book_files" FOR SELECT USING (true);



CREATE POLICY "Public read languages" ON "public"."languages" FOR SELECT USING (true);



CREATE POLICY "Public shelves are viewable by everyone" ON "public"."shelves" FOR SELECT USING (("is_public" = true));



CREATE POLICY "Service role full access for book_files" ON "public"."book_files" USING (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Service role manages notifications" ON "public"."notifications" USING (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Service role only for job_failures" ON "public"."job_failures" USING (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Service role only for job_queue" ON "public"."job_queue" USING (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Service role only for processed_events" ON "public"."processed_events" USING (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "System can manage export requests" ON "public"."export_requests" TO "service_role" USING (true) WITH CHECK (true);



CREATE POLICY "Tags viewable by everyone" ON "public"."tags" FOR SELECT USING (true);



CREATE POLICY "Users can create own bookmarks" ON "public"."bookmarks" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete own bookmarks" ON "public"."bookmarks" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own notes" ON "public"."notes" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own search history" ON "public"."search_history" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own bookmarks" ON "public"."bookmarks" FOR INSERT WITH CHECK (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Users can insert their own notes" ON "public"."notes" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own search history" ON "public"."search_history" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage items in their own shelves" ON "public"."shelf_items" USING ((EXISTS ( SELECT 1
   FROM "public"."shelves" "s"
  WHERE (("s"."id" = "shelf_items"."shelf_id") AND ("s"."user_id" = "auth"."uid"()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."shelves" "s"
  WHERE (("s"."id" = "shelf_items"."shelf_id") AND ("s"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can manage own bookmarks" ON "public"."bookmarks" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Users can manage own goals" ON "public"."reading_goals" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Users can manage own preferences" ON "public"."user_preferences" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage own reader highlights" ON "public"."highlights" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage own reader notes" ON "public"."annotations" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage own reader positions" ON "public"."reading_progress" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their own library books" ON "public"."library_books" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their own reader sessions" ON "public"."reading_sessions" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their own shelves" ON "public"."shelves" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own notifications" ON "public"."notifications" FOR UPDATE USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own notes" ON "public"."notes" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view items in public shelves" ON "public"."shelf_items" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."shelves" "s"
  WHERE (("s"."id" = "shelf_items"."shelf_id") AND ("s"."is_public" = true)))));



CREATE POLICY "Users can view own bookmarks" ON "public"."bookmarks" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own notifications" ON "public"."notifications" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own export requests" ON "public"."export_requests" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own notes" ON "public"."notes" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own search history" ON "public"."search_history" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."annotations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."announcements" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."authors" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."book_authors" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."book_files" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."book_genres" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."book_subjects" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bookmarks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."books" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."collection_books" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."collections" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."discovery_search_documents" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."export_requests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."faqs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."featured_books" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."genres" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."highlights" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."job_failures" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."job_queue" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."languages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."library_books" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."outbox_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."processed_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "profiles_owner" ON "public"."profiles" USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "profiles_public_read" ON "public"."profiles" FOR SELECT USING (true);



ALTER TABLE "public"."reading_goals" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."reading_progress" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."reading_sessions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."search_history" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."shelf_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."shelves" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."subjects" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tags" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."trending_books_projection" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_preferences" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."bookmarks";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."books";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."notes";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."profiles";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."reading_goals";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."tags";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."user_preferences";









GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



REVOKE ALL ON FUNCTION "public"."audit_role_change"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."audit_role_change"() TO "service_role";



GRANT ALL ON TABLE "public"."outbox_events" TO "anon";
GRANT ALL ON TABLE "public"."outbox_events" TO "authenticated";
GRANT ALL ON TABLE "public"."outbox_events" TO "service_role";



GRANT ALL ON FUNCTION "public"."claim_outbox_events"("limit_count" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."claim_outbox_events"("limit_count" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."claim_outbox_events"("limit_count" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."cleanup_expired_rate_limits"() TO "anon";
GRANT ALL ON FUNCTION "public"."cleanup_expired_rate_limits"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."cleanup_expired_rate_limits"() TO "service_role";



GRANT ALL ON FUNCTION "public"."execute_book_search_v1"("p_query" "text", "p_page" integer, "p_page_size" integer, "p_sort" "text", "p_genres" "text"[], "p_subjects" "text"[], "p_languages" "text"[], "p_publication_years" integer[], "p_include_unavailable" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."execute_book_search_v1"("p_query" "text", "p_page" integer, "p_page_size" integer, "p_sort" "text", "p_genres" "text"[], "p_subjects" "text"[], "p_languages" "text"[], "p_publication_years" integer[], "p_include_unavailable" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."execute_book_search_v1"("p_query" "text", "p_page" integer, "p_page_size" integer, "p_sort" "text", "p_genres" "text"[], "p_subjects" "text"[], "p_languages" "text"[], "p_publication_years" integer[], "p_include_unavailable" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."format_file_size"("size_bytes" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."format_file_size"("size_bytes" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."format_file_size"("size_bytes" bigint) TO "service_role";



REVOKE ALL ON FUNCTION "public"."get_active_announcements"("p_user_role" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_active_announcements"("p_user_role" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_recent_searches_v1"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_recent_searches_v1"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_recent_searches_v1"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_search_autocomplete_v1"("p_query" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_search_autocomplete_v1"("p_query" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_search_autocomplete_v1"("p_query" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_search_facets_v1"("p_query" "text", "p_genres" "text"[], "p_subjects" "text"[], "p_languages" "text"[], "p_publication_years" integer[], "p_include_unavailable" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."get_search_facets_v1"("p_query" "text", "p_genres" "text"[], "p_subjects" "text"[], "p_languages" "text"[], "p_publication_years" integer[], "p_include_unavailable" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_search_facets_v1"("p_query" "text", "p_genres" "text"[], "p_subjects" "text"[], "p_languages" "text"[], "p_publication_years" integer[], "p_include_unavailable" boolean) TO "service_role";



REVOKE ALL ON FUNCTION "public"."get_user_genre_distribution"("matches_user_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_user_genre_distribution"("matches_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_permissions"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_permissions"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_permissions"("p_user_id" "uuid") TO "service_role";



REVOKE ALL ON FUNCTION "public"."handle_new_user"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."has_permission"("p_user_id" "uuid", "p_permission" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."has_permission"("p_user_id" "uuid", "p_permission" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."has_permission"("p_user_id" "uuid", "p_permission" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."immutable_array_to_string"("arr" "text"[], "sep" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."immutable_array_to_string"("arr" "text"[], "sep" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."immutable_array_to_string"("arr" "text"[], "sep" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."increment_analytics_book_completed"("p_book_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."increment_analytics_book_completed"("p_book_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_analytics_book_completed"("p_book_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."increment_analytics_book_pages"("p_book_id" "uuid", "p_pages" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."increment_analytics_book_pages"("p_book_id" "uuid", "p_pages" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_analytics_book_pages"("p_book_id" "uuid", "p_pages" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."increment_analytics_book_reads"("p_book_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."increment_analytics_book_reads"("p_book_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_analytics_book_reads"("p_book_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."increment_analytics_daily_completed"("p_user_id" "uuid", "p_date" "date") TO "anon";
GRANT ALL ON FUNCTION "public"."increment_analytics_daily_completed"("p_user_id" "uuid", "p_date" "date") TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_analytics_daily_completed"("p_user_id" "uuid", "p_date" "date") TO "service_role";



GRANT ALL ON FUNCTION "public"."increment_analytics_daily_pages"("p_user_id" "uuid", "p_date" "date", "p_pages" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."increment_analytics_daily_pages"("p_user_id" "uuid", "p_date" "date", "p_pages" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_analytics_daily_pages"("p_user_id" "uuid", "p_date" "date", "p_pages" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."increment_analytics_genre_completed"("p_user_id" "uuid", "p_genre" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."increment_analytics_genre_completed"("p_user_id" "uuid", "p_genre" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_analytics_genre_completed"("p_user_id" "uuid", "p_genre" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."increment_analytics_genre_likes"("p_user_id" "uuid", "p_genre" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."increment_analytics_genre_likes"("p_user_id" "uuid", "p_genre" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_analytics_genre_likes"("p_user_id" "uuid", "p_genre" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."increment_analytics_genre_pages"("p_user_id" "uuid", "p_genre" "text", "p_pages" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."increment_analytics_genre_pages"("p_user_id" "uuid", "p_genre" "text", "p_pages" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_analytics_genre_pages"("p_user_id" "uuid", "p_genre" "text", "p_pages" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."increment_analytics_genre_rating"("p_user_id" "uuid", "p_genre" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."increment_analytics_genre_rating"("p_user_id" "uuid", "p_genre" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_analytics_genre_rating"("p_user_id" "uuid", "p_genre" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."increment_analytics_genre_started"("p_user_id" "uuid", "p_genre" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."increment_analytics_genre_started"("p_user_id" "uuid", "p_genre" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_analytics_genre_started"("p_user_id" "uuid", "p_genre" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."increment_analytics_monthly_completed"("p_user_id" "uuid", "p_month" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."increment_analytics_monthly_completed"("p_user_id" "uuid", "p_month" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_analytics_monthly_completed"("p_user_id" "uuid", "p_month" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."increment_analytics_monthly_pages"("p_user_id" "uuid", "p_month" character varying, "p_pages" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."increment_analytics_monthly_pages"("p_user_id" "uuid", "p_month" character varying, "p_pages" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_analytics_monthly_pages"("p_user_id" "uuid", "p_month" character varying, "p_pages" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."increment_download_count"("target_book_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."increment_download_count"("target_book_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_download_count"("target_book_id" "uuid") TO "service_role";






GRANT ALL ON FUNCTION "public"."normalize_search_query"("p_query" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."normalize_search_query"("p_query" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."normalize_search_query"("p_query" "text") TO "service_role";



REVOKE ALL ON FUNCTION "public"."prune_system_logs"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."prune_system_logs"() TO "service_role";



GRANT ALL ON FUNCTION "public"."recalculate_analytics_book_rating"("p_book_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."recalculate_analytics_book_rating"("p_book_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."recalculate_analytics_book_rating"("p_book_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."refresh_category_document"("target_category" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."refresh_category_document"("target_category" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."refresh_category_document"("target_category" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."refresh_recommendation_signals"("target_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."refresh_recommendation_signals"("target_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."refresh_recommendation_signals"("target_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."refresh_search_document"("target_book_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."refresh_search_document"("target_book_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."refresh_search_document"("target_book_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."refresh_trending_searches_v1"() TO "anon";
GRANT ALL ON FUNCTION "public"."refresh_trending_searches_v1"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."refresh_trending_searches_v1"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sanitize_account_logs"("target_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."sanitize_account_logs"("target_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."sanitize_account_logs"("target_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."save_book_action_with_events"("p_action_type" "text", "p_user_id" "uuid", "p_book_id" "uuid", "p_action_data" "jsonb", "p_events" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."save_book_action_with_events"("p_action_type" "text", "p_user_id" "uuid", "p_book_id" "uuid", "p_action_data" "jsonb", "p_events" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."save_book_action_with_events"("p_action_type" "text", "p_user_id" "uuid", "p_book_id" "uuid", "p_action_data" "jsonb", "p_events" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."save_book_aggregate_with_events"("p_book" "jsonb", "p_events" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."save_book_aggregate_with_events"("p_book" "jsonb", "p_events" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."save_book_aggregate_with_events"("p_book" "jsonb", "p_events" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."save_reader_session_with_events"("p_user_id" "uuid", "p_book_id" "uuid", "p_current_page" integer, "p_percentage" numeric, "p_library_status" "text", "p_events" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."save_reader_session_with_events"("p_user_id" "uuid", "p_book_id" "uuid", "p_current_page" integer, "p_percentage" numeric, "p_library_status" "text", "p_events" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."save_reader_session_with_events"("p_user_id" "uuid", "p_book_id" "uuid", "p_current_page" integer, "p_percentage" numeric, "p_library_status" "text", "p_events" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."search_books_fts"("search_query" "text", "genre_filter" "text", "page_number" integer, "page_size" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."search_books_fts"("search_query" "text", "genre_filter" "text", "page_number" integer, "page_size" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_books_fts"("search_query" "text", "genre_filter" "text", "page_number" integer, "page_size" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."search_catalog"("search_query" "text", "genre_filter" "text", "page_num" integer, "page_size" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."search_catalog"("search_query" "text", "genre_filter" "text", "page_num" integer, "page_size" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_catalog"("search_query" "text", "genre_filter" "text", "page_num" integer, "page_size" integer) TO "service_role";



REVOKE ALL ON FUNCTION "public"."toggle_maintenance_mode"("p_enabled" boolean, "p_message" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."toggle_maintenance_mode"("p_enabled" boolean, "p_message" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_citations_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_citations_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_citations_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_modified_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_modified_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_modified_column"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."update_reading_queue_order"("updates" "jsonb") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."update_reading_queue_order"("updates" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_search_document_fts"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_search_document_fts"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_search_document_fts"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."update_updated_at_column"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_user_settings_timestamp"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_user_settings_timestamp"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_user_settings_timestamp"() TO "service_role";



GRANT ALL ON TABLE "public"."annotations" TO "anon";
GRANT ALL ON TABLE "public"."annotations" TO "authenticated";
GRANT ALL ON TABLE "public"."annotations" TO "service_role";



GRANT ALL ON TABLE "public"."announcements" TO "anon";
GRANT ALL ON TABLE "public"."announcements" TO "authenticated";
GRANT ALL ON TABLE "public"."announcements" TO "service_role";



GRANT ALL ON TABLE "public"."authors" TO "anon";
GRANT ALL ON TABLE "public"."authors" TO "authenticated";
GRANT ALL ON TABLE "public"."authors" TO "service_role";



GRANT ALL ON TABLE "public"."book_assets" TO "anon";
GRANT ALL ON TABLE "public"."book_assets" TO "authenticated";
GRANT ALL ON TABLE "public"."book_assets" TO "service_role";



GRANT ALL ON TABLE "public"."book_authors" TO "anon";
GRANT ALL ON TABLE "public"."book_authors" TO "authenticated";
GRANT ALL ON TABLE "public"."book_authors" TO "service_role";



GRANT ALL ON TABLE "public"."book_files" TO "anon";
GRANT ALL ON TABLE "public"."book_files" TO "authenticated";
GRANT ALL ON TABLE "public"."book_files" TO "service_role";



GRANT ALL ON TABLE "public"."book_genres" TO "anon";
GRANT ALL ON TABLE "public"."book_genres" TO "authenticated";
GRANT ALL ON TABLE "public"."book_genres" TO "service_role";



GRANT ALL ON TABLE "public"."book_subjects" TO "anon";
GRANT ALL ON TABLE "public"."book_subjects" TO "authenticated";
GRANT ALL ON TABLE "public"."book_subjects" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,MAINTAIN,UPDATE ON TABLE "public"."bookmarks" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,MAINTAIN,UPDATE ON TABLE "public"."bookmarks" TO "authenticated";
GRANT ALL ON TABLE "public"."bookmarks" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,MAINTAIN,UPDATE ON TABLE "public"."books" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,MAINTAIN,UPDATE ON TABLE "public"."books" TO "authenticated";
GRANT ALL ON TABLE "public"."books" TO "service_role";



GRANT ALL ON TABLE "public"."collection_books" TO "anon";
GRANT ALL ON TABLE "public"."collection_books" TO "authenticated";
GRANT ALL ON TABLE "public"."collection_books" TO "service_role";



GRANT ALL ON TABLE "public"."collections" TO "anon";
GRANT ALL ON TABLE "public"."collections" TO "authenticated";
GRANT ALL ON TABLE "public"."collections" TO "service_role";



GRANT ALL ON TABLE "public"."discovery_autocomplete_documents" TO "anon";
GRANT ALL ON TABLE "public"."discovery_autocomplete_documents" TO "authenticated";
GRANT ALL ON TABLE "public"."discovery_autocomplete_documents" TO "service_role";



GRANT ALL ON TABLE "public"."discovery_search_documents" TO "anon";
GRANT ALL ON TABLE "public"."discovery_search_documents" TO "authenticated";
GRANT ALL ON TABLE "public"."discovery_search_documents" TO "service_role";



GRANT ALL ON TABLE "public"."export_requests" TO "anon";
GRANT ALL ON TABLE "public"."export_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."export_requests" TO "service_role";



GRANT ALL ON TABLE "public"."faqs" TO "anon";
GRANT ALL ON TABLE "public"."faqs" TO "authenticated";
GRANT ALL ON TABLE "public"."faqs" TO "service_role";



GRANT ALL ON TABLE "public"."featured_books" TO "anon";
GRANT ALL ON TABLE "public"."featured_books" TO "authenticated";
GRANT ALL ON TABLE "public"."featured_books" TO "service_role";



GRANT ALL ON TABLE "public"."featured_books_projection" TO "anon";
GRANT ALL ON TABLE "public"."featured_books_projection" TO "authenticated";
GRANT ALL ON TABLE "public"."featured_books_projection" TO "service_role";



GRANT ALL ON TABLE "public"."genres" TO "anon";
GRANT ALL ON TABLE "public"."genres" TO "authenticated";
GRANT ALL ON TABLE "public"."genres" TO "service_role";



GRANT ALL ON TABLE "public"."highlights" TO "anon";
GRANT ALL ON TABLE "public"."highlights" TO "authenticated";
GRANT ALL ON TABLE "public"."highlights" TO "service_role";



GRANT ALL ON TABLE "public"."job_failures" TO "anon";
GRANT ALL ON TABLE "public"."job_failures" TO "authenticated";
GRANT ALL ON TABLE "public"."job_failures" TO "service_role";



GRANT ALL ON TABLE "public"."job_queue" TO "anon";
GRANT ALL ON TABLE "public"."job_queue" TO "authenticated";
GRANT ALL ON TABLE "public"."job_queue" TO "service_role";



GRANT ALL ON TABLE "public"."languages" TO "anon";
GRANT ALL ON TABLE "public"."languages" TO "authenticated";
GRANT ALL ON TABLE "public"."languages" TO "service_role";



GRANT ALL ON TABLE "public"."library_books" TO "anon";
GRANT ALL ON TABLE "public"."library_books" TO "authenticated";
GRANT ALL ON TABLE "public"."library_books" TO "service_role";



GRANT ALL ON TABLE "public"."new_arrivals_projection" TO "anon";
GRANT ALL ON TABLE "public"."new_arrivals_projection" TO "authenticated";
GRANT ALL ON TABLE "public"."new_arrivals_projection" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,MAINTAIN,UPDATE ON TABLE "public"."notes" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,MAINTAIN,UPDATE ON TABLE "public"."notes" TO "authenticated";
GRANT ALL ON TABLE "public"."notes" TO "service_role";



GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";



GRANT ALL ON TABLE "public"."pages" TO "anon";
GRANT ALL ON TABLE "public"."pages" TO "authenticated";
GRANT ALL ON TABLE "public"."pages" TO "service_role";



GRANT ALL ON TABLE "public"."popular_books_projection" TO "anon";
GRANT ALL ON TABLE "public"."popular_books_projection" TO "authenticated";
GRANT ALL ON TABLE "public"."popular_books_projection" TO "service_role";



GRANT ALL ON TABLE "public"."processed_events" TO "anon";
GRANT ALL ON TABLE "public"."processed_events" TO "authenticated";
GRANT ALL ON TABLE "public"."processed_events" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."projection_checkpoints" TO "anon";
GRANT ALL ON TABLE "public"."projection_checkpoints" TO "authenticated";
GRANT ALL ON TABLE "public"."projection_checkpoints" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,MAINTAIN,UPDATE ON TABLE "public"."reading_goals" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,MAINTAIN,UPDATE ON TABLE "public"."reading_goals" TO "authenticated";
GRANT ALL ON TABLE "public"."reading_goals" TO "service_role";



GRANT ALL ON TABLE "public"."reading_progress" TO "anon";
GRANT ALL ON TABLE "public"."reading_progress" TO "authenticated";
GRANT ALL ON TABLE "public"."reading_progress" TO "service_role";



GRANT ALL ON TABLE "public"."reading_sessions" TO "anon";
GRANT ALL ON TABLE "public"."reading_sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."reading_sessions" TO "service_role";



GRANT ALL ON TABLE "public"."search_history" TO "anon";
GRANT ALL ON TABLE "public"."search_history" TO "authenticated";
GRANT ALL ON TABLE "public"."search_history" TO "service_role";



GRANT ALL ON TABLE "public"."search_synonyms" TO "anon";
GRANT ALL ON TABLE "public"."search_synonyms" TO "authenticated";
GRANT ALL ON TABLE "public"."search_synonyms" TO "service_role";



GRANT ALL ON TABLE "public"."shelf_items" TO "anon";
GRANT ALL ON TABLE "public"."shelf_items" TO "authenticated";
GRANT ALL ON TABLE "public"."shelf_items" TO "service_role";



GRANT ALL ON TABLE "public"."shelves" TO "anon";
GRANT ALL ON TABLE "public"."shelves" TO "authenticated";
GRANT ALL ON TABLE "public"."shelves" TO "service_role";



GRANT ALL ON TABLE "public"."subjects" TO "anon";
GRANT ALL ON TABLE "public"."subjects" TO "authenticated";
GRANT ALL ON TABLE "public"."subjects" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,MAINTAIN,UPDATE ON TABLE "public"."tags" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,MAINTAIN,UPDATE ON TABLE "public"."tags" TO "authenticated";
GRANT ALL ON TABLE "public"."tags" TO "service_role";



GRANT ALL ON TABLE "public"."trending_books_projection" TO "anon";
GRANT ALL ON TABLE "public"."trending_books_projection" TO "authenticated";
GRANT ALL ON TABLE "public"."trending_books_projection" TO "service_role";



GRANT ALL ON TABLE "public"."trending_searches_v1" TO "anon";
GRANT ALL ON TABLE "public"."trending_searches_v1" TO "authenticated";
GRANT ALL ON TABLE "public"."trending_searches_v1" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,MAINTAIN,UPDATE ON TABLE "public"."user_preferences" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,MAINTAIN,UPDATE ON TABLE "public"."user_preferences" TO "authenticated";
GRANT ALL ON TABLE "public"."user_preferences" TO "service_role";



GRANT ALL ON TABLE "public"."user_statistics" TO "anon";
GRANT ALL ON TABLE "public"."user_statistics" TO "authenticated";
GRANT ALL ON TABLE "public"."user_statistics" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";

