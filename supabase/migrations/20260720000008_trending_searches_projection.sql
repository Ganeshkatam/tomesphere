-- Migration: Trending Searches Projection
-- Builds trending searches from immutable history using a materialized view

-- Replace the old table with a materialized view
DROP TABLE IF EXISTS public.trending_searches;

CREATE MATERIALIZED VIEW public.trending_searches_v1 AS
SELECT 
    sh.normalized_query,
    COUNT(*) as search_count,
    MAX(sh.searched_at) as last_searched_at
FROM public.search_history sh
WHERE sh.searched_at >= NOW() - INTERVAL '7 days'
  AND sh.is_zero_result = false
GROUP BY sh.normalized_query
HAVING COUNT(*) > 1
ORDER BY search_count DESC, last_searched_at DESC
LIMIT 50;

-- Unique index required for CONCURRENTLY refresh
CREATE UNIQUE INDEX trending_searches_v1_query_idx ON public.trending_searches_v1(normalized_query);

CREATE OR REPLACE FUNCTION public.refresh_trending_searches_v1()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.trending_searches_v1;
END;
$$;
