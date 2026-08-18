-- Migration: 20260721200008_complete_database_sanitisation.sql
-- Description: Full database catalog sanitisation, RLS enablement, and RPC security hardening

BEGIN;

-- 1. Catalog Data Sanitisation: Standardize Author Names
UPDATE public.authors SET name = 'Dr. A.P.J. Abdul Kalam', slug = 'dr-a-p-j-abdul-kalam' WHERE name = 'A P J Abdul Kalam';
UPDATE public.authors SET name = 'Siyavula', slug = 'siyavula' WHERE name = 'SIYAVULA TECHNOLOGY-POWERED LEARNING';
UPDATE public.authors SET name = 'Iuliana Cosmina', slug = 'iuliana-cosmina' WHERE name = 'luliana Cosmina';
UPDATE public.authors SET name = 'Robin S. Sharma', slug = 'robin-s-sharma' WHERE name = 'Robin S.Sharma';
UPDATE public.authors SET name = 'Stephen Blumenthal', slug = 'stephen-blumenthal' WHERE name = 'Stephen Bluementhal';

-- 2. Catalog Data Sanitisation: Clean Book Titles
UPDATE public.books
SET title = '2,100 Asanas: The Complete Yoga Poses'
WHERE id = '10192500-e1f3-4d44-bc43-dcae9c45c393';

UPDATE public.books
SET title = 'Everything Science: Grade 10'
WHERE id = '1c9d5a74-a673-4096-a794-5206671fa817';

UPDATE public.books
SET title = 'Figure Drawing: Design and Invention'
WHERE id = '022a18c9-9cae-411e-b3f3-ac6888440d75';

UPDATE public.books
SET title = 'In the Silence You Left Behind'
WHERE id = '99bf045e-c1ac-41b5-8a30-a1ec7ae5b3ae';

UPDATE public.books
SET title = 'Java for Absolute Beginners: Learn to Program the Fundamentals the Java 9+ Way'
WHERE id = '152e9932-c07b-483c-bf18-ad4da052ff52';

UPDATE public.books
SET title = 'JavaScript for Beginners: Learn JavaScript Programming with Ease'
WHERE id = '32f179c6-dfe8-452d-9f5f-8142320d6993';

UPDATE public.books
SET title = 'Learn Python in One Day and Learn It Well: Python for Beginners'
WHERE id = '9e973743-09cf-4bbb-a26b-d241d935e9ca';

UPDATE public.books
SET title = 'Lee Hammond''s All New Big Book of Drawing for Beginners'
WHERE id = '34b9d25e-aa73-4f26-825f-7ad8a09b6e42';

UPDATE public.books
SET title = 'Maths Sutra: The Art of Vedic Speed Calculation'
WHERE id = '5631de5a-c8de-4ff1-973c-3f0f7c7cdfbb';

UPDATE public.books
SET title = 'Rig Veda: Metrically Restored Text'
WHERE id IN ('092ba43c-324c-4c7b-88a3-938bdee2ffce', 'b1274012-b84c-45a1-9095-9a66630b7084');

UPDATE public.books
SET title = 'The Mobile Application Hacker''s Handbook'
WHERE id = '0044eee6-a5d8-4ea6-b086-618d403691bf';

UPDATE public.books
SET title = 'The Monk Who Sold His Ferrari'
WHERE id = 'eb7a357d-795e-48d3-a126-cf9e7a47fce2';

UPDATE public.books
SET title = 'The Web Application Hacker''s Handbook'
WHERE id = 'f3b1a35d-ad15-497a-98ad-80446c622ebd';

UPDATE public.books
SET title = 'Vedic Mathematics Made Easy'
WHERE id = '64b22807-7b10-46ae-8460-5dc23b1efd9d';

UPDATE public.books
SET title = 'Wings of Fire: An Autobiography'
WHERE id = '0ffa0e00-ebe5-4a9c-b9df-e2aa80d15de0';

UPDATE public.books
SET title = 'Yoga: The Top 100 Best Yoga Poses'
WHERE id = '0530c31b-7c79-4426-b830-f2e27f350f6d';

-- 3. Security Hardening: Enable RLS on Remaining Public Tables
ALTER TABLE public.user_statistics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own statistics" ON public.user_statistics;
CREATE POLICY "Users can manage own statistics"
  ON public.user_statistics
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.discovery_autocomplete_documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Autocomplete readable by everyone" ON public.discovery_autocomplete_documents;
CREATE POLICY "Autocomplete readable by everyone"
  ON public.discovery_autocomplete_documents
  FOR SELECT
  TO public
  USING (true);

ALTER TABLE public.search_synonyms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Search synonyms readable by everyone" ON public.search_synonyms;
CREATE POLICY "Search synonyms readable by everyone"
  ON public.search_synonyms
  FOR SELECT
  TO public
  USING (true);

-- 4. Clean Legacy Test POC Functions
DROP FUNCTION IF EXISTS public.poc_mint_ticket(text, integer);
DROP FUNCTION IF EXISTS public.poc_delete_ticket(uuid);

-- 5. Hardening Function search_path
ALTER FUNCTION public.execute_book_search_v1(text, integer, integer, text, text[], text[], text[], integer[], boolean) SET search_path = public, internal;
ALTER FUNCTION public.get_search_facets_v1(text, text[], text[], text[], integer[], boolean) SET search_path = public, internal;
ALTER FUNCTION public.get_search_autocomplete_v1(text) SET search_path = public, internal;
ALTER FUNCTION public.get_recent_searches_v1(uuid) SET search_path = public, internal;
ALTER FUNCTION public.refresh_trending_searches_v1() SET search_path = public, internal;
ALTER FUNCTION public.claim_outbox_events(integer) SET search_path = public, internal;
ALTER FUNCTION public.refresh_search_document(uuid) SET search_path = public, internal;
ALTER FUNCTION public.refresh_category_document(text) SET search_path = public, internal;
ALTER FUNCTION public.update_search_document_fts() SET search_path = public, internal;

-- 6. Trigger Projection Refresh For All Books
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT id FROM public.books LOOP
        BEGIN
            PERFORM public.refresh_search_document(r.id);
        EXCEPTION WHEN OTHERS THEN
            NULL;
        END;
    END LOOP;
END $$;

COMMIT;
