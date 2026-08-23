-- Migration: 20260824000002_fix_streak_and_statistics_calculation.sql
-- Description: Deterministic streak calculation using islands-and-gaps from reading activity and correct user_statistics reconciliation.

CREATE OR REPLACE FUNCTION public.recalculate_user_statistics(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  v_current_streak integer := 0;
  v_longest_streak integer := 0;
  v_last_read_date date := NULL;
  v_books_started integer := 0;
  v_books_completed integer := 0;
  v_minutes_read integer := 0;
  v_seconds_read integer := 0;
  v_pages_read integer := 0;
BEGIN
  -- 1. Calculate latest read date
  SELECT MAX((COALESCE(last_read_at, started_at) AT TIME ZONE 'UTC')::date)
  INTO v_last_read_date
  FROM public.reading_sessions
  WHERE user_id = p_user_id;

  -- 2. Calculate Streaks using islands-and-gaps
  WITH dates AS (
    SELECT DISTINCT (COALESCE(last_read_at, started_at) AT TIME ZONE 'UTC')::date AS d
    FROM public.reading_sessions
    WHERE user_id = p_user_id
  ),
  ordered AS (
    SELECT d, d - (ROW_NUMBER() OVER (ORDER BY d))::integer AS grp
    FROM dates
  ),
  streaks AS (
    SELECT 
      grp,
      COUNT(*)::integer as streak_length,
      MIN(d) as start_date,
      MAX(d) as end_date
    FROM ordered
    GROUP BY grp
  )
  SELECT 
    COALESCE(MAX(streak_length), 0),
    COALESCE(
      (SELECT streak_length FROM streaks WHERE end_date >= (CURRENT_DATE - INTERVAL '1 day')::date ORDER BY end_date DESC LIMIT 1),
      (SELECT streak_length FROM streaks ORDER BY end_date DESC LIMIT 1),
      0
    )
  INTO v_longest_streak, v_current_streak
  FROM streaks;

  -- 3. Calculate volume metrics from reading sessions
  SELECT 
    COALESCE(COUNT(DISTINCT book_id), 0),
    COALESCE(COUNT(DISTINCT CASE WHEN percentage >= 100 OR current_page >= pages AND pages > 0 THEN book_id END), 0),
    COALESCE(SUM(reading_time_minutes), 0),
    COALESCE(SUM(pages), 0)
  INTO v_books_started, v_books_completed, v_minutes_read, v_pages_read
  FROM public.reading_sessions
  WHERE user_id = p_user_id;

  -- Also check user_book_completions
  SELECT GREATEST(v_books_completed, COALESCE(COUNT(*)::integer, 0))
  INTO v_books_completed
  FROM public.user_book_completions
  WHERE user_id = p_user_id;

  -- Ensure books_started is at least books_completed
  v_books_started := GREATEST(v_books_started, v_books_completed);

  -- 4. Upsert user_statistics
  INSERT INTO public.user_statistics (
    user_id,
    current_streak,
    longest_streak,
    last_read_date,
    seconds_read,
    minutes_read,
    pages_read,
    books_started,
    books_completed,
    updated_at
  )
  VALUES (
    p_user_id,
    GREATEST(v_current_streak, 1),
    GREATEST(v_longest_streak, 1),
    v_last_read_date,
    v_minutes_read * 60,
    v_minutes_read,
    v_pages_read,
    v_books_started,
    v_books_completed,
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    current_streak = EXCLUDED.current_streak,
    longest_streak = GREATEST(public.user_statistics.longest_streak, EXCLUDED.longest_streak),
    last_read_date = COALESCE(EXCLUDED.last_read_date, public.user_statistics.last_read_date),
    minutes_read = GREATEST(public.user_statistics.minutes_read, EXCLUDED.minutes_read),
    seconds_read = GREATEST(public.user_statistics.seconds_read, EXCLUDED.seconds_read),
    pages_read = GREATEST(public.user_statistics.pages_read, EXCLUDED.pages_read),
    books_started = GREATEST(public.user_statistics.books_started, EXCLUDED.books_started),
    books_completed = GREATEST(public.user_statistics.books_completed, EXCLUDED.books_completed),
    updated_at = NOW();

END;
$$;

-- Trigger to recalculate statistics on reading_sessions changes
CREATE OR REPLACE FUNCTION public.trigger_recalculate_reading_session_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM public.recalculate_user_statistics(OLD.user_id);
    RETURN OLD;
  ELSE
    PERFORM public.recalculate_user_statistics(NEW.user_id);
    RETURN NEW;
  END IF;
END;
$$;

DROP TRIGGER IF EXISTS trg_reading_sessions_stats ON public.reading_sessions;
CREATE TRIGGER trg_reading_sessions_stats
AFTER INSERT OR UPDATE OR DELETE ON public.reading_sessions
FOR EACH ROW EXECUTE FUNCTION public.trigger_recalculate_reading_session_stats();

-- Recalculate for all existing users in the system
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT id FROM public.profiles LOOP
    PERFORM public.recalculate_user_statistics(r.id);
  END LOOP;
END;
$$;
