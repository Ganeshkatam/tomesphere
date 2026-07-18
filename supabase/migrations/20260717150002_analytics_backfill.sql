-- ==============================================================================
-- PHASE 10C.4: Analytics Backfill
-- ==============================================================================

-- 1. Backfill analytics_user_daily from progress_daily
INSERT INTO public.analytics_user_daily (user_id, date, pages_read, books_completed, reading_time_minutes)
SELECT user_id, date, pages_read, books_completed, reading_time_minutes
FROM public.progress_daily
ON CONFLICT (user_id, date) DO UPDATE SET
    pages_read = EXCLUDED.pages_read,
    books_completed = EXCLUDED.books_completed,
    reading_time_minutes = EXCLUDED.reading_time_minutes;

-- 2. Backfill analytics_user_monthly from progress_daily
INSERT INTO public.analytics_user_monthly (user_id, month, pages_read, books_completed)
SELECT 
    user_id, 
    to_char(date, 'YYYY-MM') as month, 
    SUM(pages_read) as pages_read, 
    SUM(books_completed) as books_completed
FROM public.progress_daily
GROUP BY user_id, to_char(date, 'YYYY-MM')
ON CONFLICT (user_id, month) DO UPDATE SET
    pages_read = EXCLUDED.pages_read,
    books_completed = EXCLUDED.books_completed;

-- 3. Backfill analytics_book_statistics
-- Compute reads and completions from reader_sessions
WITH session_stats AS (
    SELECT 
        book_id,
        COUNT(*) as total_reads,
        SUM(CASE WHEN percentage >= 100 THEN 1 ELSE 0 END) as completions
    FROM public.reader_sessions
    GROUP BY book_id
),
-- Compute ratings from ratings table
rating_stats AS (
    SELECT 
        book_id,
        AVG(rating) as average_rating,
        COUNT(rating) as rating_count
    FROM public.ratings
    GROUP BY book_id
)
INSERT INTO public.analytics_book_statistics (book_id, total_reads, completions, average_rating, rating_count)
SELECT 
    b.id,
    COALESCE(s.total_reads, 0),
    COALESCE(s.completions, 0),
    COALESCE(r.average_rating, 0),
    COALESCE(r.rating_count, 0)
FROM public.books b
LEFT JOIN session_stats s ON b.id = s.book_id
LEFT JOIN rating_stats r ON b.id = r.book_id
WHERE COALESCE(s.total_reads, 0) > 0 OR COALESCE(r.rating_count, 0) > 0
ON CONFLICT (book_id) DO UPDATE SET
    total_reads = EXCLUDED.total_reads,
    completions = EXCLUDED.completions,
    average_rating = EXCLUDED.average_rating,
    rating_count = EXCLUDED.rating_count;

-- 4. Backfill analytics_user_genres
-- This one is an aggregate of sessions, ratings, and likes
WITH genre_stats AS (
    -- From sessions
    SELECT 
        rs.user_id,
        b.genre,
        COUNT(rs.book_id) as books_started,
        SUM(CASE WHEN rs.percentage >= 100 THEN 1 ELSE 0 END) as books_completed
    FROM public.reader_sessions rs
    JOIN public.books b ON rs.book_id = b.id
    WHERE b.genre IS NOT NULL
    GROUP BY rs.user_id, b.genre
),
genre_ratings AS (
    SELECT 
        r.user_id,
        b.genre,
        COUNT(r.book_id) as ratings_count
    FROM public.ratings r
    JOIN public.books b ON r.book_id = b.id
    WHERE b.genre IS NOT NULL
    GROUP BY r.user_id, b.genre
),
genre_likes AS (
    SELECT 
        l.user_id,
        b.genre,
        COUNT(l.book_id) as likes_count
    FROM public.book_likes l
    JOIN public.books b ON l.book_id = b.id
    WHERE b.genre IS NOT NULL
    GROUP BY l.user_id, b.genre
)
INSERT INTO public.analytics_user_genres (user_id, genre, books_started, books_completed, ratings_count, likes_count)
SELECT 
    COALESCE(s.user_id, r.user_id, l.user_id) as user_id,
    COALESCE(s.genre, r.genre, l.genre) as genre,
    COALESCE(s.books_started, 0),
    COALESCE(s.books_completed, 0),
    COALESCE(r.ratings_count, 0),
    COALESCE(l.likes_count, 0)
FROM genre_stats s
FULL OUTER JOIN genre_ratings r ON s.user_id = r.user_id AND s.genre = r.genre
FULL OUTER JOIN genre_likes l ON COALESCE(s.user_id, r.user_id) = l.user_id AND COALESCE(s.genre, r.genre) = l.genre
ON CONFLICT (user_id, genre) DO UPDATE SET
    books_started = EXCLUDED.books_started,
    books_completed = EXCLUDED.books_completed,
    ratings_count = EXCLUDED.ratings_count,
    likes_count = EXCLUDED.likes_count;
