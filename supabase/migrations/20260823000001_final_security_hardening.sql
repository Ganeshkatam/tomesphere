-- Migration: Final Security Hardening
-- Description: Resolves remaining Supabase Security Advisors (RLS, Materialized Views, and Security Definer Functions).

-- 1. Convert Search RPCs to SECURITY INVOKER
ALTER FUNCTION public.execute_book_search_v1(text, integer, integer, text, text[], text[], text[], integer[], boolean) SECURITY INVOKER;
ALTER FUNCTION public.get_search_autocomplete_v1(text) SECURITY INVOKER;
ALTER FUNCTION public.get_search_facets_v1(text, text[], text[], text[], integer[], boolean) SECURITY INVOKER;

-- 2. Drop unused legacy RPC
DROP FUNCTION IF EXISTS public.increment_download_count(uuid);

-- 3. Revoke public execute from trigger function
REVOKE EXECUTE ON FUNCTION public.process_statistics_event() FROM PUBLIC, anon, authenticated;

-- 4. Secure internal audit tables by removing them from public API
REVOKE ALL ON TABLE public.user_book_completions FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.user_statistics_event_log FROM PUBLIC, anon, authenticated;

-- 5. Harden materialized view by wrapping it in a standard view
CREATE OR REPLACE VIEW public.trending_searches AS 
SELECT * FROM public.trending_searches_v1;

GRANT SELECT ON public.trending_searches TO anon, authenticated;
REVOKE ALL ON TABLE public.trending_searches_v1 FROM PUBLIC, anon, authenticated;
