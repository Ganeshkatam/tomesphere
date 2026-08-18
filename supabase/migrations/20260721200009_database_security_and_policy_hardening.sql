-- Migration: 20260721200009_database_security_and_policy_hardening.sql
-- Description: RPC privilege revocation, systematic search_path hardening, RLS policy consolidation & performance optimization, and covering FK indexes

BEGIN;

-- Safeguard timeouts for schema alterations
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';

-- ============================================================================
-- 1. RPC PRIVILEGE & AUTHORIZATION HARDENING
-- ============================================================================

-- Revoke execute on all internal/privileged/analytics functions from public and anon
REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC;
REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA public FROM anon;

-- Grant EXECUTE on explicit public Discovery APIs
GRANT EXECUTE ON FUNCTION public.execute_book_search_v1(text, integer, integer, text, text[], text[], text[], integer[], boolean) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_search_facets_v1(text, text[], text[], text[], integer[], boolean) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_search_autocomplete_v1(text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.format_file_size(bigint) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.immutable_array_to_string(text[], text) TO anon, authenticated, service_role;

-- Grant EXECUTE on Authenticated User APIs
GRANT EXECUTE ON FUNCTION public.get_recent_searches_v1(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.increment_download_count(uuid) TO authenticated, service_role;

-- Grant EXECUTE on Internal/Worker functions only to service_role and postgres
GRANT EXECUTE ON FUNCTION public.claim_outbox_events(integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.refresh_search_document(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.refresh_category_document(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.refresh_trending_searches_v1() TO service_role;
GRANT EXECUTE ON FUNCTION public.update_search_document_fts() TO service_role;
GRANT EXECUTE ON FUNCTION public.save_book_action_with_events(text, uuid, uuid, jsonb, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.save_book_aggregate_with_events(jsonb, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.save_reader_session_with_events(uuid, uuid, integer, numeric, text, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_user_permissions(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.has_permission(uuid, varchar) TO service_role;
GRANT EXECUTE ON FUNCTION public.sanitize_account_logs(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.cleanup_expired_rate_limits() TO service_role;
GRANT EXECUTE ON FUNCTION public.recalculate_analytics_book_rating(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.refresh_recommendation_signals(uuid) TO service_role;

-- ============================================================================
-- 2. SYSTEMATIC FUNCTION SEARCH_PATH HARDENING
-- ============================================================================

ALTER FUNCTION public.audit_role_change() SET search_path = public, internal;
ALTER FUNCTION public.cleanup_expired_rate_limits() SET search_path = public, internal;
ALTER FUNCTION public.get_active_announcements(text) SET search_path = public, internal;
ALTER FUNCTION public.get_user_genre_distribution(uuid) SET search_path = public, internal;
ALTER FUNCTION public.get_user_permissions(uuid) SET search_path = public, internal;
ALTER FUNCTION public.has_permission(uuid, varchar) SET search_path = public, internal;
ALTER FUNCTION public.immutable_array_to_string(text[], text) SET search_path = public, internal;
ALTER FUNCTION public.increment_analytics_book_completed(uuid) SET search_path = public, internal;
ALTER FUNCTION public.increment_analytics_book_pages(uuid, integer) SET search_path = public, internal;
ALTER FUNCTION public.increment_analytics_book_reads(uuid) SET search_path = public, internal;
ALTER FUNCTION public.increment_analytics_daily_completed(uuid, date) SET search_path = public, internal;
ALTER FUNCTION public.increment_analytics_daily_pages(uuid, date, integer) SET search_path = public, internal;
ALTER FUNCTION public.increment_analytics_genre_completed(uuid, text) SET search_path = public, internal;
ALTER FUNCTION public.increment_analytics_genre_likes(uuid, text) SET search_path = public, internal;
ALTER FUNCTION public.increment_analytics_genre_pages(uuid, text, integer) SET search_path = public, internal;
ALTER FUNCTION public.increment_analytics_genre_rating(uuid, text) SET search_path = public, internal;
ALTER FUNCTION public.increment_analytics_genre_started(uuid, text) SET search_path = public, internal;
ALTER FUNCTION public.increment_analytics_monthly_completed(uuid, varchar) SET search_path = public, internal;
ALTER FUNCTION public.increment_analytics_monthly_pages(uuid, varchar, integer) SET search_path = public, internal;
ALTER FUNCTION public.increment_download_count(uuid) SET search_path = public, internal;
ALTER FUNCTION public.normalize_search_query(text) SET search_path = public, internal;
ALTER FUNCTION public.prune_system_logs() SET search_path = public, internal;
ALTER FUNCTION public.recalculate_analytics_book_rating(uuid) SET search_path = public, internal;
ALTER FUNCTION public.refresh_recommendation_signals(uuid) SET search_path = public, internal;
ALTER FUNCTION public.sanitize_account_logs(uuid) SET search_path = public, internal;
ALTER FUNCTION public.save_book_action_with_events(text, uuid, uuid, jsonb, jsonb) SET search_path = public, internal;
ALTER FUNCTION public.save_book_aggregate_with_events(jsonb, jsonb) SET search_path = public, internal;
ALTER FUNCTION public.save_reader_session_with_events(uuid, uuid, integer, numeric, text, jsonb) SET search_path = public, internal;
ALTER FUNCTION public.toggle_maintenance_mode(boolean, text) SET search_path = public, internal;
ALTER FUNCTION public.update_citations_updated_at() SET search_path = public, internal;
ALTER FUNCTION public.update_reading_queue_order(jsonb) SET search_path = public, internal;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public, internal;
ALTER FUNCTION public.update_user_settings_timestamp() SET search_path = public, internal;

-- ============================================================================
-- 3. RLS POLICY CONSOLIDATION & PERFORMANCE OPTIMIZATION
-- ============================================================================

-- Annotations
DROP POLICY IF EXISTS "Users can manage own reader notes" ON public.annotations;
CREATE POLICY "Users can manage own reader notes"
  ON public.annotations FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- Bookmarks (Consolidate 5 duplicate policies into 1)
DROP POLICY IF EXISTS "Users can create own bookmarks" ON public.bookmarks;
DROP POLICY IF EXISTS "Users can delete own bookmarks" ON public.bookmarks;
DROP POLICY IF EXISTS "Users can insert own bookmarks" ON public.bookmarks;
DROP POLICY IF EXISTS "Users can manage own bookmarks" ON public.bookmarks;
DROP POLICY IF EXISTS "Users can view own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can manage own bookmarks"
  ON public.bookmarks FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- Highlights
DROP POLICY IF EXISTS "Users can manage own reader highlights" ON public.highlights;
CREATE POLICY "Users can manage own reader highlights"
  ON public.highlights FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- Library Books
DROP POLICY IF EXISTS "Users can manage their own library books" ON public.library_books;
CREATE POLICY "Users can manage their own library books"
  ON public.library_books FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- Notes (Consolidate 4 duplicate policies into 1)
DROP POLICY IF EXISTS "Users can delete their own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can insert their own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can update their own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can view their own notes" ON public.notes;
CREATE POLICY "Users can manage own notes"
  ON public.notes FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- Notifications
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can manage own notifications"
  ON public.notifications FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- Profiles
DROP POLICY IF EXISTS "profiles_owner" ON public.profiles;
CREATE POLICY "profiles_owner"
  ON public.profiles FOR ALL TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

-- Reading Progress
DROP POLICY IF EXISTS "Users can manage own reader positions" ON public.reading_progress;
CREATE POLICY "Users can manage own reader positions"
  ON public.reading_progress FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- Reading Sessions
DROP POLICY IF EXISTS "Users can manage their own reader sessions" ON public.reading_sessions;
CREATE POLICY "Users can manage their own reader sessions"
  ON public.reading_sessions FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- Search History (Consolidate 3 duplicate policies into 1)
DROP POLICY IF EXISTS "Users can delete their own search history" ON public.search_history;
DROP POLICY IF EXISTS "Users can insert their own search history" ON public.search_history;
DROP POLICY IF EXISTS "Users can view their own search history" ON public.search_history;
CREATE POLICY "Users can manage own search history"
  ON public.search_history FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- Shelves
DROP POLICY IF EXISTS "Users can manage their own shelves" ON public.shelves;
CREATE POLICY "Users can manage their own shelves"
  ON public.shelves FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- Shelf Items
DROP POLICY IF EXISTS "Users can manage items in their own shelves" ON public.shelf_items;
CREATE POLICY "Users can manage items in their own shelves"
  ON public.shelf_items FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.shelves s WHERE s.id = shelf_items.shelf_id AND s.user_id = (SELECT auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM public.shelves s WHERE s.id = shelf_items.shelf_id AND s.user_id = (SELECT auth.uid())));

-- User Preferences
DROP POLICY IF EXISTS "Users can manage own preferences" ON public.user_preferences;
CREATE POLICY "Users can manage own preferences"
  ON public.user_preferences FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- User Statistics
DROP POLICY IF EXISTS "Users can manage own statistics" ON public.user_statistics;
CREATE POLICY "Users can manage own statistics"
  ON public.user_statistics FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- Export Requests
DROP POLICY IF EXISTS "Users can view their own export requests" ON public.export_requests;
CREATE POLICY "Users can view their own export requests"
  ON public.export_requests FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- ============================================================================
-- 4. INDEX HYGIENE & COVERING FOREIGN KEY INDEXES
-- ============================================================================

-- Drop duplicate index on discovery_search_documents
DROP INDEX IF EXISTS public.idx_search_docs_language;

-- Add covering indexes for foreign keys
CREATE INDEX IF NOT EXISTS idx_annotations_book_id ON public.annotations(book_id);
CREATE INDEX IF NOT EXISTS idx_annotations_highlight_id ON public.annotations(highlight_id);
CREATE INDEX IF NOT EXISTS idx_book_files_book_id ON public.book_files(book_id);
CREATE INDEX IF NOT EXISTS idx_book_genres_genre_id ON public.book_genres(genre_id);
CREATE INDEX IF NOT EXISTS idx_book_subjects_subject_id ON public.book_subjects(subject_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_book_id ON public.bookmarks(book_id);
CREATE INDEX IF NOT EXISTS idx_books_language_id ON public.books(language_id);
CREATE INDEX IF NOT EXISTS idx_collection_books_book_id ON public.collection_books(book_id);
CREATE INDEX IF NOT EXISTS idx_highlights_book_id ON public.highlights(book_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_book_id ON public.reading_progress(book_id);
CREATE INDEX IF NOT EXISTS idx_search_history_clicked_document_id ON public.search_history(clicked_document_id);

COMMIT;
