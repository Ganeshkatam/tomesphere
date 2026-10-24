-- Migration: Soft-Deprecate Legacy Skills Table
-- Date: 2026-10-24
-- Scope: Schema Modernization — Elimination of Public Exposure for Portfolio-Era Skills Table
-- Data Safety: 12 live records archived to supabase/seeds/legacy_skills_archive.json.
-- Dependencies Audit: Verified zero foreign keys, zero views, zero trigger dependencies, zero frontend UI usage.

-- 1. Restrict public policy to reject all public reads
ALTER POLICY "Public read skills" ON public.skills USING (false);

-- 2. Revoke SELECT privileges from public/anon/authenticated roles
REVOKE SELECT ON public.skills FROM anon, authenticated;

