-- Create user_notification_preferences table
CREATE TABLE IF NOT EXISTS public.user_notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  reading_reminders_enabled BOOLEAN NOT NULL DEFAULT false,
  recommendations_enabled BOOLEAN NOT NULL DEFAULT false,
  weekly_digest_enabled BOOLEAN NOT NULL DEFAULT false,
  system_announcements_enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_notification_preferences ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own notification preferences" ON public.user_notification_preferences;
DROP POLICY IF EXISTS "Users can insert own notification preferences" ON public.user_notification_preferences;
DROP POLICY IF EXISTS "Users can update own notification preferences" ON public.user_notification_preferences;

-- Create RLS Policies
CREATE POLICY "Users can view own notification preferences"
  ON public.user_notification_preferences
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notification preferences"
  ON public.user_notification_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notification preferences"
  ON public.user_notification_preferences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Grant privileges to authenticated role
GRANT SELECT, INSERT, UPDATE ON public.user_notification_preferences TO authenticated;
