-- Migration: 20260721200010_revoke_security_definer_from_authenticated.sql
-- Description: Explicitly revokes EXECUTE on internal SECURITY DEFINER functions from authenticated role

BEGIN;

SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';

-- Revoke all function execute privileges from authenticated
REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA public FROM authenticated;

-- Grant EXECUTE back ONLY to the intentional authenticated user RPCs
GRANT EXECUTE ON FUNCTION public.execute_book_search_v1(text, integer, integer, text, text[], text[], text[], integer[], boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_search_facets_v1(text, text[], text[], text[], integer[], boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_search_autocomplete_v1(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_recent_searches_v1(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_download_count(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.format_file_size(bigint) TO authenticated;
GRANT EXECUTE ON FUNCTION public.immutable_array_to_string(text[], text) TO authenticated;

-- Grant EXECUTE on internal/worker functions exclusively to service_role
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;

COMMIT;
