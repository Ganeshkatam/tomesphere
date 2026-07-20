-- Migration: Database Globalization (i18n)
-- Adds language support across catalog, public content, and account tables

-- Catalog Language Fields
ALTER TABLE public.book_files
  ADD COLUMN IF NOT EXISTS language TEXT NOT NULL DEFAULT 'en';

-- Public Content Language Fields
ALTER TABLE public.announcements
  ADD COLUMN IF NOT EXISTS language TEXT NOT NULL DEFAULT 'en';

ALTER TABLE public.faqs
  ADD COLUMN IF NOT EXISTS language TEXT NOT NULL DEFAULT 'en';

ALTER TABLE public.pages
  ADD COLUMN IF NOT EXISTS language TEXT NOT NULL DEFAULT 'en';

-- User Preferences Language Fields
ALTER TABLE public.user_preferences
  ADD COLUMN IF NOT EXISTS ui_language TEXT NOT NULL DEFAULT 'en',
  ADD COLUMN IF NOT EXISTS content_languages TEXT[] NOT NULL DEFAULT '{en}';
