DROP FUNCTION IF EXISTS search_catalog(text, text, integer, integer);

CREATE OR REPLACE FUNCTION search_catalog(
  search_query text,
  genre_filter text DEFAULT 'all',
  page_num int DEFAULT 1,
  page_size int DEFAULT 20
) RETURNS TABLE (
  id uuid,
  title text,
  description text,
  cover_url text,
  language text,
  release_date date,
  publisher text,
  isbn text,
  pages int,
  is_featured boolean,
  created_at timestamptz,
  updated_at timestamptz,
  total_count bigint
) AS $$
DECLARE
  start_idx int := (page_num - 1) * page_size;
BEGIN
  RETURN QUERY
  WITH filtered_books AS (
    SELECT b.id
    FROM books b
    LEFT JOIN book_authors ba ON b.id = ba.book_id
    LEFT JOIN authors a ON ba.author_id = a.id
    LEFT JOIN book_genres bg ON b.id = bg.book_id
    LEFT JOIN genres g ON bg.genre_id = g.id
    LEFT JOIN book_subjects bs ON b.id = bs.book_id
    LEFT JOIN subjects s ON bs.subject_id = s.id
    WHERE 
      (search_query = '' OR search_query IS NULL OR 
       b.title ILIKE '%' || search_query || '%' OR 
       a.name ILIKE '%' || search_query || '%' OR 
       s.name ILIKE '%' || search_query || '%')
      AND (genre_filter = 'all' OR genre_filter IS NULL OR g.slug = genre_filter OR g.name = genre_filter)
    GROUP BY b.id
  ),
  counted AS (
    SELECT count(*) AS total FROM filtered_books
  )
  SELECT 
    b.id,
    b.title,
    b.description,
    b.cover_url,
    b.language,
    b.release_date,
    b.publisher,
    b.isbn,
    b.pages,
    b.is_featured,
    b.created_at,
    b.updated_at,
    c.total::bigint
  FROM books b
  JOIN filtered_books fb ON b.id = fb.id
  CROSS JOIN counted c
  ORDER BY b.title ASC
  LIMIT page_size OFFSET start_idx;
END;
$$ LANGUAGE plpgsql;
