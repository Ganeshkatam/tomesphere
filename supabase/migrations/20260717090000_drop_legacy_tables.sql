-- Migration: Drop Legacy Tables (Phase 7)

-- 1. Drop Legacy Functions
DROP FUNCTION IF EXISTS public.update_collection_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.get_recommendations(target_user_id UUID) CASCADE;

-- 2. Drop Legacy Tables
DROP TABLE IF EXISTS public.reading_lists CASCADE;
DROP TABLE IF EXISTS public.collections CASCADE;
DROP TABLE IF EXISTS public.collection_items CASCADE;
DROP TABLE IF EXISTS public.reading_progress CASCADE;
DROP TABLE IF EXISTS public.user_stats CASCADE;
DROP TABLE IF EXISTS public.user_daily_stats CASCADE;

-- 3. Drop Legacy Column from Profiles
ALTER TABLE public.profiles
DROP COLUMN IF EXISTS role;

-- 4. Replace Functions that referenced legacy tables

-- Replace handle_new_user to point to user_progress instead of user_stats
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', 'User'));

    INSERT INTO public.user_preferences (user_id) VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING;
    INSERT INTO public.user_progress (user_id) VALUES (NEW.id);
    INSERT INTO public.user_private (user_id) VALUES (NEW.id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Replace increment_engagement to point to user_progress
CREATE OR REPLACE FUNCTION public.increment_engagement(p_user_id UUID, p_points INT)
RETURNS void AS $$
BEGIN
    UPDATE public.user_progress 
    SET engagement_score = COALESCE(engagement_score, 0) + p_points 
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Replace upsert_daily_stats to point to progress_daily
CREATE OR REPLACE FUNCTION public.upsert_daily_stats(p_user_id UUID, p_date DATE, p_updates JSONB)
RETURNS void AS $$
BEGIN
  INSERT INTO public.progress_daily (user_id, date, reading_time_minutes, pages_read, books_completed)
  VALUES (
    p_user_id,
    p_date,
    COALESCE((p_updates->>'reading_time_minutes')::int, 0),
    COALESCE((p_updates->>'pages_read')::int, 0),
    COALESCE((p_updates->>'books_completed')::int, 0)
  )
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    reading_time_minutes = progress_daily.reading_time_minutes +
      COALESCE((p_updates->>'reading_time_minutes')::int, 0),
    pages_read = progress_daily.pages_read +
      COALESCE((p_updates->>'pages_read')::int, 0),
    books_completed = progress_daily.books_completed +
      COALESCE((p_updates->>'books_completed')::int, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
