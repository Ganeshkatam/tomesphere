-- ==============================================================================
-- PHASE 10C.4: Analytics Read Models (RPCs)
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.increment_analytics_daily_pages(p_user_id UUID, p_date DATE, p_pages INTEGER)
RETURNS void AS $$
BEGIN
    INSERT INTO public.analytics_user_daily (user_id, date, pages_read, streak_active)
    VALUES (p_user_id, p_date, p_pages, true)
    ON CONFLICT (user_id, date) DO UPDATE SET
        pages_read = analytics_user_daily.pages_read + p_pages;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.increment_analytics_monthly_pages(p_user_id UUID, p_month VARCHAR, p_pages INTEGER)
RETURNS void AS $$
BEGIN
    INSERT INTO public.analytics_user_monthly (user_id, month, pages_read)
    VALUES (p_user_id, p_month, p_pages)
    ON CONFLICT (user_id, month) DO UPDATE SET
        pages_read = analytics_user_monthly.pages_read + p_pages;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.increment_analytics_genre_pages(p_user_id UUID, p_genre TEXT, p_pages INTEGER)
RETURNS void AS $$
BEGIN
    INSERT INTO public.analytics_user_genres (user_id, genre, pages_read)
    VALUES (p_user_id, p_genre, p_pages)
    ON CONFLICT (user_id, genre) DO UPDATE SET
        pages_read = analytics_user_genres.pages_read + p_pages;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.increment_analytics_book_pages(p_book_id UUID, p_pages INTEGER)
RETURNS void AS $$
BEGIN
    INSERT INTO public.analytics_book_statistics (book_id, pages_read_total)
    VALUES (p_book_id, p_pages)
    ON CONFLICT (book_id) DO UPDATE SET
        pages_read_total = analytics_book_statistics.pages_read_total + p_pages;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


CREATE OR REPLACE FUNCTION public.increment_analytics_daily_completed(p_user_id UUID, p_date DATE)
RETURNS void AS $$
BEGIN
    INSERT INTO public.analytics_user_daily (user_id, date, books_completed)
    VALUES (p_user_id, p_date, 1)
    ON CONFLICT (user_id, date) DO UPDATE SET
        books_completed = analytics_user_daily.books_completed + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.increment_analytics_monthly_completed(p_user_id UUID, p_month VARCHAR)
RETURNS void AS $$
BEGIN
    INSERT INTO public.analytics_user_monthly (user_id, month, books_completed)
    VALUES (p_user_id, p_month, 1)
    ON CONFLICT (user_id, month) DO UPDATE SET
        books_completed = analytics_user_monthly.books_completed + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.increment_analytics_genre_completed(p_user_id UUID, p_genre TEXT)
RETURNS void AS $$
BEGIN
    INSERT INTO public.analytics_user_genres (user_id, genre, books_completed)
    VALUES (p_user_id, p_genre, 1)
    ON CONFLICT (user_id, genre) DO UPDATE SET
        books_completed = analytics_user_genres.books_completed + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.increment_analytics_book_completed(p_book_id UUID)
RETURNS void AS $$
BEGIN
    INSERT INTO public.analytics_book_statistics (book_id, completions)
    VALUES (p_book_id, 1)
    ON CONFLICT (book_id) DO UPDATE SET
        completions = analytics_book_statistics.completions + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


CREATE OR REPLACE FUNCTION public.increment_analytics_genre_started(p_user_id UUID, p_genre TEXT)
RETURNS void AS $$
BEGIN
    INSERT INTO public.analytics_user_genres (user_id, genre, books_started)
    VALUES (p_user_id, p_genre, 1)
    ON CONFLICT (user_id, genre) DO UPDATE SET
        books_started = analytics_user_genres.books_started + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.increment_analytics_book_reads(p_book_id UUID)
RETURNS void AS $$
BEGIN
    INSERT INTO public.analytics_book_statistics (book_id, total_reads)
    VALUES (p_book_id, 1)
    ON CONFLICT (book_id) DO UPDATE SET
        total_reads = analytics_book_statistics.total_reads + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


CREATE OR REPLACE FUNCTION public.increment_analytics_genre_rating(p_user_id UUID, p_genre TEXT)
RETURNS void AS $$
BEGIN
    INSERT INTO public.analytics_user_genres (user_id, genre, ratings_count)
    VALUES (p_user_id, p_genre, 1)
    ON CONFLICT (user_id, genre) DO UPDATE SET
        ratings_count = analytics_user_genres.ratings_count + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.recalculate_analytics_book_rating(p_book_id UUID)
RETURNS void AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;


CREATE OR REPLACE FUNCTION public.increment_analytics_genre_likes(p_user_id UUID, p_genre TEXT)
RETURNS void AS $$
BEGIN
    INSERT INTO public.analytics_user_genres (user_id, genre, likes_count)
    VALUES (p_user_id, p_genre, 1)
    ON CONFLICT (user_id, genre) DO UPDATE SET
        likes_count = analytics_user_genres.likes_count + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
