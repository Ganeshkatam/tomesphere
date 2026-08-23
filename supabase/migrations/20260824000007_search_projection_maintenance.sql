-- Migration: 20260824000007_search_projection_maintenance.sql
-- Description: Implement atomic single-book and batch stale projection refresh procedures for discovery_search_documents

CREATE OR REPLACE FUNCTION public.refresh_outdated_discovery_projections(
    batch_limit integer DEFAULT 50
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, internal, extensions
AS $$
DECLARE
    r_book RECORD;
    v_refreshed_count integer := 0;
BEGIN
    FOR r_book IN 
        SELECT b.id
        FROM public.books b
        LEFT JOIN public.discovery_search_documents d ON d.book_id = b.id
        WHERE d.book_id IS NULL 
           OR COALESCE(b.updated_at, b.created_at) > COALESCE(d.source_updated_at, '1970-01-01'::timestamptz)
           OR d.indexed_at < (NOW() - INTERVAL '1 day')
        ORDER BY b.updated_at DESC NULLS LAST
        LIMIT batch_limit
    LOOP
        PERFORM public.refresh_search_document(r_book.id);
        v_refreshed_count := v_refreshed_count + 1;
    END LOOP;

    RETURN v_refreshed_count;
END;
$$;

-- Grant execution permissions
GRANT EXECUTE ON FUNCTION public.refresh_outdated_discovery_projections(integer) TO authenticated, anon, service_role;
