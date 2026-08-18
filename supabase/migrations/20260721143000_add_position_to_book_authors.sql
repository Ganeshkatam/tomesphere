ALTER TABLE public.book_authors
ADD COLUMN position integer;

-- Deterministically backfill positions
WITH ranked AS (
    SELECT
        book_id,
        author_id,
        ROW_NUMBER() OVER (
            PARTITION BY book_id
            ORDER BY author_id
        ) - 1 AS position
    FROM public.book_authors
)
UPDATE public.book_authors AS ba
SET position = ranked.position
FROM ranked
WHERE ranked.book_id = ba.book_id
  AND ranked.author_id = ba.author_id;

ALTER TABLE public.book_authors
ALTER COLUMN position SET DEFAULT 0;

ALTER TABLE public.book_authors
ALTER COLUMN position SET NOT NULL;

ALTER TABLE public.book_authors
ADD CONSTRAINT book_authors_position_nonnegative
CHECK (position >= 0);

CREATE INDEX IF NOT EXISTS idx_book_authors_author_id
    ON public.book_authors(author_id);

CREATE UNIQUE INDEX idx_book_authors_unique_position
    ON public.book_authors(book_id, position);
