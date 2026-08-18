-- Frugal Migration 005: RLS Normalization
-- Purpose: Consolidate duplicate policies and drop all obsolete service_role
-- policies to reduce RLS evaluation overhead and enforce the zero-service_role architecture.

-- 1. Drop obsolete service_role policies
DROP POLICY IF EXISTS "Service role only for job_queue" ON public.job_queue;
DROP POLICY IF EXISTS "Service role only for job_failures" ON public.job_failures;
DROP POLICY IF EXISTS "Service role only for processed_events" ON public.processed_events;
DROP POLICY IF EXISTS "Service role full access for book_files" ON public.book_files;
DROP POLICY IF EXISTS "Service role manages notifications" ON public.notifications;
DROP POLICY IF EXISTS "Only admins/workers can modify search documents" ON public.discovery_search_documents;

-- Note: The canonical policies 'books_public_select' and 
-- 'discovery_search_documents_public_select' are already the only remaining 
-- SELECT policies for those tables.
