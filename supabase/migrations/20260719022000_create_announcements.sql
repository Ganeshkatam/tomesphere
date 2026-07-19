-- Create announcements table
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  link_url TEXT,
  link_text TEXT,
  is_dismissible BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active announcements
CREATE POLICY "Public can view active announcements"
  ON public.announcements
  FOR SELECT
  USING (is_active = true AND starts_at <= NOW() AND ends_at >= NOW());

-- Allow admins to manage announcements
CREATE POLICY "Admins can manage announcements"
  ON public.announcements
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );
