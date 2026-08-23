-- Migration: Update handle_new_user trigger to automatically initialize profile, preferences, notification preferences, and statistics on user creation

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- 1. Create Profile
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'User'))
  ON CONFLICT (id) DO NOTHING;

  -- 2. Create User Notification Preferences
  INSERT INTO public.user_notification_preferences (
    user_id,
    reading_reminders_enabled,
    recommendations_enabled,
    weekly_digest_enabled,
    system_announcements_enabled
  )
  VALUES (
    NEW.id,
    false,
    false,
    false,
    false
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- 3. Create User General Preferences
  INSERT INTO public.user_preferences (
    user_id,
    theme,
    ui_language,
    content_languages
  )
  VALUES (
    NEW.id,
    'dark',
    'en',
    ARRAY['en']
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- 4. Create User Statistics
  INSERT INTO public.user_statistics (
    user_id,
    books_completed,
    books_started,
    pages_read,
    minutes_read,
    current_streak,
    longest_streak
  )
  VALUES (
    NEW.id,
    0,
    0,
    0,
    0,
    0,
    0
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$function$;

-- Backfill all existing users who do not have notification preferences yet
INSERT INTO public.user_notification_preferences (
  user_id,
  reading_reminders_enabled,
  recommendations_enabled,
  weekly_digest_enabled,
  system_announcements_enabled
)
SELECT 
  id,
  false,
  false,
  false,
  false
FROM public.profiles
ON CONFLICT (user_id) DO NOTHING;

-- Backfill all existing users who do not have user_preferences yet
INSERT INTO public.user_preferences (
  user_id,
  theme,
  ui_language,
  content_languages
)
SELECT
  id,
  'dark',
  'en',
  ARRAY['en']
FROM public.profiles
ON CONFLICT (user_id) DO NOTHING;

-- Backfill all existing users who do not have user_statistics yet
INSERT INTO public.user_statistics (
  user_id,
  books_completed,
  books_started,
  pages_read,
  minutes_read,
  current_streak,
  longest_streak
)
SELECT
  id,
  0,
  0,
  0,
  0,
  0,
  0
FROM public.profiles
ON CONFLICT (user_id) DO NOTHING;
