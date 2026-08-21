-- Migration: Drop redundant total_pages column from public.books table
-- Note: public.books.pages is the canonical column used for page counts across the application.

ALTER TABLE public.books 
DROP COLUMN IF EXISTS total_pages;
