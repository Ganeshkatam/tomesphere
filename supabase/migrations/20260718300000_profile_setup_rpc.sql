-- Create an RPC to atomically update profile, preferences, and stats during setup

CREATE OR REPLACE FUNCTION setup_profile(
  user_id UUID,
  p_name TEXT,
  p_favorite_genres TEXT[],
  p_reading_goal JSONB
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- 1. Update Profile
  UPDATE public.profiles
  SET name = p_name,
      updated_at = NOW()
  WHERE id = user_id;

  -- 2. Update Preferences
  UPDATE public.user_preferences
  SET favorite_genres = p_favorite_genres,
      reading_goal = p_reading_goal
  WHERE user_id = user_id;

  -- 3. Update Stats
  UPDATE public.user_stats
  SET profile_completed = true
  WHERE user_id = user_id;
END;
$$;
