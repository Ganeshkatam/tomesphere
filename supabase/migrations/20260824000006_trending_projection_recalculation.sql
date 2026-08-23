-- Migration: 20260824000006_trending_projection_recalculation.sql
-- Description: Implement background trending projection recalculation for daily, weekly, monthly, and all-time windows

CREATE OR REPLACE FUNCTION public.recalculate_trending_projections()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, internal, extensions
AS $$
DECLARE
    v_updated_rows integer;
BEGIN
    WITH daily_metrics AS (
        SELECT 
            m.book_id,
            m.composite_score AS score,
            DENSE_RANK() OVER (ORDER BY m.composite_score DESC) AS rank_pos
        FROM public.calculate_book_popularity_metrics(NULL, INTERVAL '1 day') m
    ),
    weekly_metrics AS (
        SELECT 
            m.book_id,
            m.composite_score AS score,
            DENSE_RANK() OVER (ORDER BY m.composite_score DESC) AS rank_pos
        FROM public.calculate_book_popularity_metrics(NULL, INTERVAL '7 days') m
    ),
    monthly_metrics AS (
        SELECT 
            m.book_id,
            m.composite_score AS score,
            DENSE_RANK() OVER (ORDER BY m.composite_score DESC) AS rank_pos
        FROM public.calculate_book_popularity_metrics(NULL, INTERVAL '30 days') m
    ),
    all_time_metrics AS (
        SELECT 
            m.book_id,
            m.composite_score AS score,
            DENSE_RANK() OVER (ORDER BY m.composite_score DESC) AS rank_pos
        FROM public.calculate_book_popularity_metrics(NULL, NULL) m
    ),
    combined_windows AS (
        SELECT 
            atm.book_id,
            ROUND(COALESCE(dm.score, 0.0))::integer AS daily_score,
            dm.rank_pos::integer AS daily_rank,
            ROUND(COALESCE(wm.score, 0.0))::integer AS weekly_score,
            wm.rank_pos::integer AS weekly_rank,
            ROUND(COALESCE(mm.score, 0.0))::integer AS monthly_score,
            mm.rank_pos::integer AS monthly_rank,
            ROUND(COALESCE(atm.score, 0.0))::integer AS all_time_score,
            atm.rank_pos::integer AS all_time_rank,
            NOW() AS updated_at
        FROM all_time_metrics atm
        LEFT JOIN daily_metrics dm ON dm.book_id = atm.book_id
        LEFT JOIN weekly_metrics wm ON wm.book_id = atm.book_id
        LEFT JOIN monthly_metrics mm ON mm.book_id = atm.book_id
    ),
    upserted AS (
        INSERT INTO public.trending_books_projection (
            book_id,
            daily_score,
            daily_rank,
            weekly_score,
            weekly_rank,
            monthly_score,
            monthly_rank,
            all_time_score,
            all_time_rank,
            updated_at
        )
        SELECT 
            cw.book_id,
            cw.daily_score,
            cw.daily_rank,
            cw.weekly_score,
            cw.weekly_rank,
            cw.monthly_score,
            cw.monthly_rank,
            cw.all_time_score,
            cw.all_time_rank,
            cw.updated_at
        FROM combined_windows cw
        ON CONFLICT (book_id) DO UPDATE SET
            daily_score = EXCLUDED.daily_score,
            daily_rank = EXCLUDED.daily_rank,
            weekly_score = EXCLUDED.weekly_score,
            weekly_rank = EXCLUDED.weekly_rank,
            monthly_score = EXCLUDED.monthly_score,
            monthly_rank = EXCLUDED.monthly_rank,
            all_time_score = EXCLUDED.all_time_score,
            all_time_rank = EXCLUDED.all_time_rank,
            updated_at = EXCLUDED.updated_at
        RETURNING 1
    )
    SELECT COUNT(*)::integer INTO v_updated_rows FROM upserted;

    RETURN v_updated_rows;
END;
$$;

-- Grant execution permissions
GRANT EXECUTE ON FUNCTION public.recalculate_trending_projections() TO authenticated, anon, service_role;
