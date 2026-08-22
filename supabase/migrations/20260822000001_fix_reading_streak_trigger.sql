-- Migration: 20260822000001_fix_reading_streak_trigger.sql
-- Description: Ensures all reading events advance the daily reading streak and updates user_statistics reliably.

CREATE OR REPLACE FUNCTION public.process_statistics_event()
RETURNS trigger AS $$
DECLARE
  v_user_id uuid;
  v_book_id uuid;
  v_event_date date;
  v_last_read_date date;
  v_current_streak integer;
  v_longest_streak integer;
BEGIN
  -- We only care about reader events
  IF NEW.event_type NOT IN ('reader.session.started', 'reader.position.updated', 'reader.session.ended', 'reader.book.completed') THEN
    RETURN NEW;
  END IF;

  v_user_id := (NEW.payload->>'userId')::uuid;
  IF v_user_id IS NULL THEN
    RETURN NEW;
  END IF;

  v_event_date := date_trunc('day', NEW.created_at)::date;

  -- Ensure user_statistics row exists
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
    v_user_id,
    1,
    1,
    v_event_date,
    0,
    0,
    0,
    1,
    0,
    now()
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- Fetch current streak info
  SELECT last_read_date, COALESCE(current_streak, 0), COALESCE(longest_streak, 0)
  INTO v_last_read_date, v_current_streak, v_longest_streak
  FROM public.user_statistics
  WHERE user_id = v_user_id;

  -- Calculate streak transition
  IF v_last_read_date IS NULL THEN
    v_current_streak := 1;
  ELSIF v_event_date = v_last_read_date THEN
    -- Same day read: maintain current streak
    IF v_current_streak = 0 THEN
      v_current_streak := 1;
    END IF;
  ELSIF v_event_date = v_last_read_date + 1 THEN
    -- Consecutive day read: increment streak
    v_current_streak := v_current_streak + 1;
  ELSIF v_event_date > v_last_read_date + 1 THEN
    -- Broken streak: restart streak
    v_current_streak := 1;
  END IF;

  v_longest_streak := GREATEST(v_longest_streak, v_current_streak, 1);

  -- Update streak and last_read_date
  UPDATE public.user_statistics
  SET 
    last_read_date = GREATEST(COALESCE(last_read_date, '1970-01-01'::date), v_event_date),
    current_streak = v_current_streak,
    longest_streak = v_longest_streak,
    updated_at = now()
  WHERE user_id = v_user_id;

  -- Handle book completion
  IF NEW.event_type = 'reader.book.completed' THEN
    v_book_id := (NEW.payload->>'bookId')::uuid;
    IF v_book_id IS NOT NULL THEN
      BEGIN
        INSERT INTO public.user_book_completions (user_id, book_id, completed_at)
        VALUES (v_user_id, v_book_id, NEW.created_at);

        UPDATE public.user_statistics
        SET books_completed = COALESCE(books_completed, 0) + 1,
            updated_at = now()
        WHERE user_id = v_user_id;
      EXCEPTION WHEN unique_violation THEN
        -- Book already completed
      END;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';
