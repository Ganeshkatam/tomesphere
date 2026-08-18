-- Migration: 20260721200011_rls_policy_deduplication.sql
-- Description: Unifies permissive SELECT policies to eliminate redundant policy evaluation and adds explicit policies for projections and worker tables

BEGIN;

SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';

-- 1. Profiles: Separate SELECT from mutation policies
DROP POLICY IF EXISTS "profiles_owner" ON public.profiles;
DROP POLICY IF EXISTS "profiles_public_read" ON public.profiles;

CREATE POLICY "profiles_public_read"
  ON public.profiles FOR SELECT
  TO public
  USING (true);

CREATE POLICY "profiles_owner_insert"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = (SELECT auth.uid()));

CREATE POLICY "profiles_owner_update"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

CREATE POLICY "profiles_owner_delete"
  ON public.profiles FOR DELETE
  TO authenticated
  USING (id = (SELECT auth.uid()));

-- 2. Shelves: Unify SELECT and separate mutations
DROP POLICY IF EXISTS "Public shelves are viewable by everyone" ON public.shelves;
DROP POLICY IF EXISTS "Users can manage their own shelves" ON public.shelves;

CREATE POLICY "shelves_select"
  ON public.shelves FOR SELECT
  TO public
  USING (is_public = true OR user_id = (SELECT auth.uid()));

CREATE POLICY "shelves_insert"
  ON public.shelves FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "shelves_update"
  ON public.shelves FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "shelves_delete"
  ON public.shelves FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- 3. Shelf Items: Unify SELECT and separate mutations
DROP POLICY IF EXISTS "Users can view items in public shelves" ON public.shelf_items;
DROP POLICY IF EXISTS "Users can manage items in their own shelves" ON public.shelf_items;

CREATE POLICY "shelf_items_select"
  ON public.shelf_items FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.shelves s
      WHERE s.id = shelf_items.shelf_id
        AND (s.is_public = true OR s.user_id = (SELECT auth.uid()))
    )
  );

CREATE POLICY "shelf_items_insert"
  ON public.shelf_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.shelves s
      WHERE s.id = shelf_items.shelf_id
        AND s.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "shelf_items_update"
  ON public.shelf_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.shelves s
      WHERE s.id = shelf_items.shelf_id
        AND s.user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.shelves s
      WHERE s.id = shelf_items.shelf_id
        AND s.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "shelf_items_delete"
  ON public.shelf_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.shelves s
      WHERE s.id = shelf_items.shelf_id
        AND s.user_id = (SELECT auth.uid())
    )
  );

-- 4. Trending Books Projection: Explicit public select policy
DROP POLICY IF EXISTS "trending_books_public_select" ON public.trending_books_projection;
CREATE POLICY "trending_books_public_select"
  ON public.trending_books_projection FOR SELECT
  TO public
  USING (true);

-- 5. Worker & Internal Tables: Explicit service role policies
DROP POLICY IF EXISTS "worker_outbox_policy" ON public.outbox_events;
CREATE POLICY "worker_outbox_policy"
  ON public.outbox_events FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "worker_processed_events_policy" ON public.processed_events;
CREATE POLICY "worker_processed_events_policy"
  ON public.processed_events FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "worker_job_queue_policy" ON public.job_queue;
CREATE POLICY "worker_job_queue_policy"
  ON public.job_queue FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "worker_job_failures_policy" ON public.job_failures;
CREATE POLICY "worker_job_failures_policy"
  ON public.job_failures FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

COMMIT;
