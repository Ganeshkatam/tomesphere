-- Migration: Fix announcements RLS and permissions
-- Drop broken legacy policy that referenced the dropped user_roles table
DROP POLICY IF EXISTS "Admins can manage announcements" ON public.announcements;

-- Ensure public can view active announcements safely supporting optional ends_at
DROP POLICY IF EXISTS "Public can view active announcements" ON public.announcements;

CREATE POLICY "Public can view active announcements"
  ON public.announcements
  FOR SELECT
  TO anon, authenticated
  USING (
    is_active = true
    AND starts_at <= NOW()
    AND (ends_at IS NULL OR ends_at >= NOW())
  );

-- Table level privileges: public roles may only SELECT active announcements
GRANT SELECT ON TABLE public.announcements TO anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON TABLE public.announcements FROM anon, authenticated;
