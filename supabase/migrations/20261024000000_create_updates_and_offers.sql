-- Migration: Create Updates and Offers Tables with RLS & Foreign Key Constraints
-- Date: 2026-10-24
-- Scope: Phase C — Product Discovery & Information Hub

-- 1. Updates & Changelogs Table
CREATE TABLE IF NOT EXISTS public.updates (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  version TEXT,
  update_type TEXT NOT NULL DEFAULT 'Feature',
  status TEXT NOT NULL DEFAULT 'Draft',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_update_type CHECK (update_type IN ('Launch', 'Feature', 'Improvement', 'Bugfix', 'Maintenance')),
  CONSTRAINT check_update_status CHECK (status IN ('Published', 'Draft', 'Archived'))
);

-- 2. Offers & Promotions Table
CREATE TABLE IF NOT EXISTS public.offers (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  benefit TEXT NOT NULL,
  eligibility TEXT NOT NULL,
  terms TEXT,
  coupon_code TEXT,
  url TEXT NOT NULL,
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'Draft',
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_offer_dates CHECK (end_date > start_date),
  CONSTRAINT check_offer_status CHECK (status IN ('Published', 'Draft', 'Expired'))
);

-- 3. Indexes for High-Efficiency Querying
CREATE INDEX IF NOT EXISTS idx_updates_project ON public.updates (project_id);
CREATE INDEX IF NOT EXISTS idx_updates_slug ON public.updates (slug);
CREATE INDEX IF NOT EXISTS idx_updates_status ON public.updates (status, published_at DESC);

CREATE INDEX IF NOT EXISTS idx_offers_project ON public.offers (project_id);
CREATE INDEX IF NOT EXISTS idx_offers_slug ON public.offers (slug);
CREATE INDEX IF NOT EXISTS idx_offers_status ON public.offers (status, end_date DESC);
CREATE INDEX IF NOT EXISTS idx_offers_featured ON public.offers (is_featured);

-- 4. Automated updated_at Triggers
DROP TRIGGER IF EXISTS trigger_updates_updated_at ON public.updates;
CREATE TRIGGER trigger_updates_updated_at
  BEFORE UPDATE ON public.updates
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_offers_updated_at ON public.offers;
CREATE TRIGGER trigger_offers_updated_at
  BEFORE UPDATE ON public.offers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 5. Row Level Security (RLS) Configuration
ALTER TABLE public.updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

-- Revoke mutation and dangerous administrative privileges from anon/authenticated
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, TRIGGER, REFERENCES ON public.updates FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, TRIGGER, REFERENCES ON public.offers FROM anon, authenticated;

-- Grant SELECT privileges to anon/authenticated
GRANT SELECT ON public.updates TO anon, authenticated;
GRANT SELECT ON public.offers TO anon, authenticated;

-- Public RLS Policies: Published items only
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'updates' AND policyname = 'Public read published updates') THEN
    CREATE POLICY "Public read published updates" ON public.updates
      FOR SELECT TO anon, authenticated
      USING (status = 'Published' AND published_at <= NOW());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'offers' AND policyname = 'Public read active published offers') THEN
    CREATE POLICY "Public read active published offers" ON public.offers
      FOR SELECT TO anon, authenticated
      USING (status = 'Published' AND start_date <= NOW() AND end_date >= NOW());
  END IF;
END $$;
