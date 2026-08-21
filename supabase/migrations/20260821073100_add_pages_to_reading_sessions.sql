-- Migration: Add pages column to public.reading_sessions table

ALTER TABLE public.reading_sessions 
ADD COLUMN IF NOT EXISTS pages INTEGER DEFAULT 0;

COMMENT ON COLUMN public.reading_sessions.pages IS 'Total page count of the book recorded during the session.';
