-- Migration: 20260721200012_populate_canonical_book_files.sql
-- Description: Populate canonical book_files records from books table for existing catalog files

INSERT INTO public.book_files (
    id,
    book_id,
    format,
    size,
    storage_path,
    mime_type,
    version,
    is_primary,
    language,
    created_at
)
SELECT
    gen_random_uuid() AS id,
    b.id AS book_id,
    COALESCE(b.format, 'pdf') AS format,
    b.file_size AS size,
    b.pdf_url AS storage_path,
    'application/pdf' AS mime_type,
    1 AS version,
    true AS is_primary,
    COALESCE(b.language, 'en') AS language,
    now() AS created_at
FROM public.books b
WHERE b.pdf_url IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM public.book_files bf WHERE bf.book_id = b.id AND bf.format = COALESCE(b.format, 'pdf')
  );
