-- Migration: increment_download_count RPC
-- Purpose: Atomically increment download_count for a book

CREATE OR REPLACE FUNCTION public.increment_download_count(target_book_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.books
    SET download_count = COALESCE(download_count, 0) + 1
    WHERE id = target_book_id;
END;
$$;
