-- Migration: 20260721200007_retire_legacy_tables.sql
-- Description: Retires verified obsolete and superseded legacy tables without CASCADE

BEGIN;

-- Safeguard timeouts for schema alterations
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';

-- 1. Drop explicit policy on tags
DROP POLICY IF EXISTS "Tags viewable by everyone" ON public.tags;

-- 2. Drop obsolete tables using RESTRICT to guarantee no unintended cascade
DROP TABLE IF EXISTS public.pages RESTRICT;
DROP TABLE IF EXISTS public.book_assets RESTRICT;
DROP TABLE IF EXISTS public.featured_books_projection RESTRICT;
DROP TABLE IF EXISTS public.popular_books_projection RESTRICT;
DROP TABLE IF EXISTS public.new_arrivals_projection RESTRICT;
DROP TABLE IF EXISTS public.projection_checkpoints RESTRICT;
DROP TABLE IF EXISTS public.tags RESTRICT;

COMMIT;
