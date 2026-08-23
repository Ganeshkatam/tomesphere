-- Migration: 20260824000005_book_popularity_metrics.sql
-- Description: Implement normalized [0, 1] component scoring function for book popularity & engagement velocity

CREATE OR REPLACE FUNCTION public.calculate_book_popularity_metrics(
    p_book_id uuid DEFAULT NULL,
    p_window_interval interval DEFAULT NULL
)
RETURNS TABLE (
    book_id uuid,
    bayesian_rating numeric,
    decayed_reading_velocity numeric,
    completion_signal numeric,
    log_views numeric,
    composite_score numeric,
    raw_views integer,
    raw_rating_count integer,
    raw_average_rating numeric,
    raw_reading_minutes numeric,
    raw_completions integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, internal, extensions
AS $$
BEGIN
    RETURN QUERY
    WITH target_books AS (
        SELECT 
            b.id,
            COALESCE(b.view_count, 0) AS v_count
        FROM public.books b
        WHERE (p_book_id IS NULL OR b.id = p_book_id)
          AND COALESCE(b.is_archived, false) = false
    ),
    book_ratings AS (
        SELECT 
            d.book_id AS b_id,
            COALESCE(d.average_rating, 0.0)::numeric AS avg_r,
            COALESCE(d.rating_count, 0)::integer AS r_cnt
        FROM public.discovery_search_documents d
        WHERE (p_book_id IS NULL OR d.book_id = p_book_id)
    ),
    session_aggregates AS (
        SELECT 
            rs.book_id AS b_id,
            -- Exponential time decay with half-life of 14 days (lambda = ln(2) / 14 ~ 0.0495105)
            COALESCE(SUM(
                COALESCE(rs.reading_time_minutes, 0) * 
                EXP(-0.0495105 * GREATEST(0.0, EXTRACT(EPOCH FROM (NOW() - rs.last_read_at)) / 86400.0))
            ), 0.0)::numeric AS decayed_minutes,
            COALESCE(COUNT(DISTINCT rs.user_id) FILTER (
                WHERE rs.finished_at IS NOT NULL OR COALESCE(rs.percentage, 0) >= 90
            ), 0)::integer AS total_completions
        FROM public.reading_sessions rs
        WHERE (p_book_id IS NULL OR rs.book_id = p_book_id)
          AND (p_window_interval IS NULL OR rs.last_read_at >= (NOW() - p_window_interval))
        GROUP BY rs.book_id
    ),
    raw_metrics AS (
        SELECT 
            tb.id AS b_id,
            tb.v_count AS r_views,
            COALESCE(br.r_cnt, 0) AS r_rating_cnt,
            COALESCE(br.avg_r, 0.0) AS r_avg_rating,
            COALESCE(sa.decayed_minutes, 0.0) AS r_reading_mins,
            COALESCE(sa.total_completions, 0) AS r_completions
        FROM target_books tb
        LEFT JOIN book_ratings br ON br.b_id = tb.id
        LEFT JOIN session_aggregates sa ON sa.b_id = tb.id
    ),
    normalized_metrics AS (
        SELECT 
            rm.b_id,
            rm.r_views,
            rm.r_rating_cnt,
            rm.r_avg_rating,
            rm.r_reading_mins,
            rm.r_completions,
            -- 1. Bayesian Rating: (v * R + m * C) / (v + m) normalized by 5.0
            -- Prior: m = 5, C = 3.5 (neutral global mean)
            LEAST(1.0, GREATEST(0.0,
                ROUND(
                    (((rm.r_rating_cnt * rm.r_avg_rating) + (5.0 * 3.5)) / (rm.r_rating_cnt + 5.0)) / 5.0,
                    4
                )
            )) AS norm_rating,
            -- 2. Decayed Reading Velocity: ln(1 + mins) / ln(1 + 10000)
            LEAST(1.0, GREATEST(0.0,
                ROUND(
                    LN(1.0 + rm.r_reading_mins) / 9.21044,
                    4
                )
            )) AS norm_reading,
            -- 3. Completion Signal: ln(1 + completions) / ln(1 + 200)
            LEAST(1.0, GREATEST(0.0,
                ROUND(
                    LN(1.0 + rm.r_completions) / 5.30330,
                    4
                )
            )) AS norm_complete,
            -- 4. Log Views: ln(1 + views) / ln(1 + 100000)
            LEAST(1.0, GREATEST(0.0,
                ROUND(
                    LN(1.0 + rm.r_views) / 11.51293,
                    4
                )
            )) AS norm_views
        FROM raw_metrics rm
    )
    SELECT 
        nm.b_id AS book_id,
        nm.norm_rating AS bayesian_rating,
        nm.norm_reading AS decayed_reading_velocity,
        nm.norm_complete AS completion_signal,
        nm.norm_views AS log_views,
        -- Composite score: W_rating(0.25) + W_reading(0.30) + W_complete(0.20) + W_views(0.25) => [0, 100]
        ROUND(
            (
                (0.25 * nm.norm_rating) +
                (0.30 * nm.norm_reading) +
                (0.20 * nm.norm_complete) +
                (0.25 * nm.norm_views)
            ) * 100.0,
            2
        ) AS composite_score,
        nm.r_views AS raw_views,
        nm.r_rating_cnt AS raw_rating_count,
        nm.r_avg_rating AS raw_average_rating,
        ROUND(nm.r_reading_mins, 2) AS raw_reading_minutes,
        nm.r_completions AS raw_completions
    FROM normalized_metrics nm
    ORDER BY composite_score DESC;
END;
$$;

-- Grant execution permissions
GRANT EXECUTE ON FUNCTION public.calculate_book_popularity_metrics(uuid, interval) TO authenticated, anon, service_role;
