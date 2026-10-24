-- Migration: 20261023_init_tomesphere_schema.sql
-- Description: Core production schema for TomeSphere (tomesphere.in) & BookGarden (bookgarden.tomesphere.in)
-- Database: Supabase PostgreSQL (Project ref: ibuaiktnkhvqoqxrqnrz)

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. Trigger Function for updated_at (Secure Search Path & Permissions)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_updated_at() FROM public, anon, authenticated;

-- 3. Developer Profile Table
CREATE TABLE IF NOT EXISTS public.profile (
  id TEXT PRIMARY KEY DEFAULT 'primary',
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  domain TEXT NOT NULL,
  location TEXT DEFAULT 'India',
  email TEXT NOT NULL,
  bio TEXT,
  intro TEXT,
  avatar_url TEXT,
  socials JSONB DEFAULT '{}'::jsonb,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Projects & Products Catalog Table
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  tagline TEXT,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  github_url TEXT,
  image TEXT,
  accent TEXT DEFAULT 'lavender',
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'Live',
  year TEXT DEFAULT '2026',
  tags JSONB DEFAULT '[]'::jsonb,
  display_order INTEGER DEFAULT 0,
  metrics JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  proficiency TEXT DEFAULT 'Advanced',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Visitor Guestbook Table
CREATE TABLE IF NOT EXISTS public.guestbook (
  id TEXT PRIMARY KEY,
  author TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Inquiries & Contact Table
CREATE TABLE IF NOT EXISTS public.contacts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects (featured);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects (category);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects (status);
CREATE INDEX IF NOT EXISTS idx_projects_order ON public.projects (display_order ASC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_guestbook_created ON public.guestbook (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_created ON public.contacts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_skills_category ON public.skills (category, display_order ASC);

-- 9. Automated updated_at Triggers
DROP TRIGGER IF EXISTS trigger_projects_updated_at ON public.projects;
CREATE TRIGGER trigger_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_profile_updated_at ON public.profile;
CREATE TRIGGER trigger_profile_updated_at
  BEFORE UPDATE ON public.profile
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 10. Row Level Security & Explicit Least-Privilege Policies
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guestbook ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Revoke dangerous table privileges from public/anon/authenticated
REVOKE INSERT, UPDATE, DELETE ON public.projects FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.profile FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.skills FROM anon, authenticated;
REVOKE SELECT, UPDATE, DELETE ON public.contacts FROM anon, authenticated;
REVOKE UPDATE, DELETE ON public.guestbook FROM anon, authenticated;

-- Grant minimal necessary privileges
GRANT SELECT ON public.projects TO anon, authenticated;
GRANT SELECT ON public.profile TO anon, authenticated;
GRANT SELECT ON public.skills TO anon, authenticated;
GRANT SELECT, INSERT ON public.guestbook TO anon, authenticated;
GRANT INSERT ON public.contacts TO anon, authenticated;

-- Public RLS Policies (Read-only for public catalog, strictly validated inserts)
DO $$
BEGIN
  -- Projects: Only live products accessible to public
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Public read published projects') THEN
    CREATE POLICY "Public read published projects" ON public.projects
      FOR SELECT TO anon, authenticated
      USING (status = 'Live');
  END IF;

  -- Profile: Read-only for public
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profile' AND policyname = 'Public read profile') THEN
    CREATE POLICY "Public read profile" ON public.profile
      FOR SELECT TO anon, authenticated
      USING (true);
  END IF;

  -- Skills: Read-only for public
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'skills' AND policyname = 'Public read skills') THEN
    CREATE POLICY "Public read skills" ON public.skills
      FOR SELECT TO anon, authenticated
      USING (true);
  END IF;

  -- Guestbook: Only approved entries readable publicly
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'guestbook' AND policyname = 'Public read approved guestbook') THEN
    CREATE POLICY "Public read approved guestbook" ON public.guestbook
      FOR SELECT TO anon, authenticated
      USING (status = 'approved');
  END IF;

  -- Guestbook: Strictly bounded user inserts
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'guestbook' AND policyname = 'Public insert guestbook') THEN
    CREATE POLICY "Public insert guestbook" ON public.guestbook
      FOR INSERT TO anon, authenticated
      WITH CHECK (
        char_length(author) BETWEEN 2 AND 60
        AND char_length(message) BETWEEN 3 AND 500
        AND status = 'pending'
      );
  END IF;

  -- Contacts: Insert only, zero public read access
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contacts' AND policyname = 'Public insert contacts') THEN
    CREATE POLICY "Public insert contacts" ON public.contacts
      FOR INSERT TO anon, authenticated
      WITH CHECK (
        char_length(name) BETWEEN 2 AND 100
        AND char_length(email) BETWEEN 5 AND 120
        AND char_length(message) BETWEEN 5 AND 2000
        AND (status IS NULL OR status = 'unread')
      );
  END IF;
END $$;
