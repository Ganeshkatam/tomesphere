-- Migration: Grant SELECT permissions on trending_searches materialized view and view to public roles
-- Resolves: 42501 permission denied for materialized view trending_searches_v1

GRANT SELECT ON public.trending_searches_v1 TO anon, authenticated;
GRANT SELECT ON public.trending_searches TO anon, authenticated;
