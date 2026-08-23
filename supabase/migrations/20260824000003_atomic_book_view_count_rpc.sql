-- Migration: 20260824000003_atomic_book_view_count_rpc.sql
-- Description: Define atomic, single-write increment_book_view_count RPC with fixed search path

CREATE OR REPLACE FUNCTION public.increment_book_view_count(p_book_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_view_count integer;
BEGIN
    IF p_book_id IS NULL THEN
        RAISE EXCEPTION USING
            errcode = '22004',
            message = 'book_id is required';
    END IF;

    UPDATE public.books
    SET view_count = COALESCE(view_count, 0) + 1
    WHERE id = p_book_id
      AND COALESCE(is_archived, false) = false
    RETURNING view_count
    INTO v_view_count;

    IF NOT FOUND THEN
        RAISE EXCEPTION USING
            errcode = 'P0002',
            message = 'Book not found or archived';
    END IF;

    RETURN v_view_count;
END;
$$;

-- Grant minimal necessary execution privilege to web clients
GRANT EXECUTE ON FUNCTION public.increment_book_view_count(uuid) TO authenticated, anon;

-- Drop legacy increment_download_count RPC if still present
DROP FUNCTION IF EXISTS public.increment_download_count(uuid);
