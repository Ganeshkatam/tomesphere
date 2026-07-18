-- ==============================================================================
-- PHASE 10D: Performance Tuning
-- Description: Add compound indexes on frequently queried tables to improve
-- read performance and operational efficiency.
-- ==============================================================================

-- 1. library_books
-- Often queried by user_id and status (e.g. want_to_read, currently_reading)
CREATE INDEX IF NOT EXISTS idx_library_books_user_status 
ON public.library_books(user_id, status);

-- 2. reader_sessions
-- Queried heavily by updateReadingProgress for tracking session increments
CREATE INDEX IF NOT EXISTS idx_reader_sessions_user_book 
ON public.reader_sessions(user_id, book_id);

-- 3. ratings
-- Queried by user_id and book_id to fetch user's specific rating or bulk user ratings
CREATE INDEX IF NOT EXISTS idx_ratings_user_book 
ON public.ratings(user_id, book_id);

-- 4. book_likes
-- Queried by user_id and book_id to check if a book is liked
CREATE INDEX IF NOT EXISTS idx_book_likes_user_book 
ON public.book_likes(user_id, book_id);

-- 5. bookmarks
-- Queried heavily to toggle bookmarks and display them inside the reader
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_book 
ON public.bookmarks(user_id, book_id);

-- 6. progress_daily
-- Often queried by user_id and date for streak/daily stats lookups
CREATE INDEX IF NOT EXISTS idx_progress_daily_user_date 
ON public.progress_daily(user_id, date);
