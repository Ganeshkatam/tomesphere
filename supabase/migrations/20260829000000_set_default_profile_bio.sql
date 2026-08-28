-- Migration: Set default profile biography for newly registered and unpopulated profiles
-- Default: 'Avid reader & lifelong learner.'

-- 1. Update the column default on public.profiles
ALTER TABLE public.profiles 
  ALTER COLUMN bio SET DEFAULT 'Avid reader & lifelong learner.';

-- 2. Update handle_new_user trigger function to ensure the default bio is applied
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- 1. Create Profile with default bio
  INSERT INTO public.profiles (id, display_name, bio)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    'Avid reader & lifelong learner.'
  )
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

-- 3. Backfill existing profiles where bio is unpopulated (NULL or empty)
UPDATE public.profiles
SET bio = 'Avid reader & lifelong learner.'
WHERE bio IS NULL OR trim(bio) = '';
