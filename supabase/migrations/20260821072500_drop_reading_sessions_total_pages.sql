-- Migration: Drop redundant total_pages column from public.reading_sessions table
-- Note: Book total page counts are canonically referenced via public.books.pages.

ALTER TABLE public.reading_sessions 
DROP COLUMN IF EXISTS total_pages;
