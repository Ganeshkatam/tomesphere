-- Migration: Search History RPC
-- Provides distinct, personalized recent searches from immutable history

CREATE OR REPLACE FUNCTION public.get_recent_searches_v1(p_user_id uuid)
RETURNS TABLE (
    query text,
    searched_at timestamp with time zone
)
LANGUAGE plpgsql
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
