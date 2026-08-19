-- 1. Extend user_statistics table
ALTER TABLE public.user_statistics ADD COLUMN last_read_date DATE;
ALTER TABLE public.user_statistics ADD COLUMN seconds_read INTEGER DEFAULT 0;

-- Sync existing minutes_read if any
UPDATE public.user_statistics SET seconds_read = minutes_read * 60 WHERE minutes_read > 0;

-- 2. RLS for user_statistics
DROP POLICY IF EXISTS "Users can read own statistics" ON public.user_statistics;

CREATE POLICY "Users can read own statistics"
  ON public.user_statistics
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 3. user_statistics_event_log for idempotency
CREATE TABLE IF NOT EXISTS public.user_statistics_event_log (
    event_id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    processed_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.user_statistics_event_log ENABLE ROW LEVEL SECURITY;

-- 4. user_book_completions for uniqueness
CREATE TABLE IF NOT EXISTS public.user_book_completions (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    completed_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (user_id, book_id)
);

ALTER TABLE public.user_book_completions ENABLE ROW LEVEL SECURITY;

-- 5. Trigger Function
CREATE OR REPLACE FUNCTION public.process_statistics_event()
RETURNS trigger AS $$
DECLARE
  v_user_id uuid;
  v_duration_seconds integer;
  v_pages_read integer;
  v_book_id uuid;
  v_event_date date;
  v_last_read_date date;
  v_current_streak integer;
  v_longest_streak integer;
BEGIN
  -- We only care about specific events
  IF NEW.event_type NOT IN ('reader.session.ended', 'reader.book.completed') THEN
    RETURN NEW;
  END IF;

  v_user_id := (NEW.payload->>'userId')::uuid;
  IF v_user_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- 1. Idempotency Check
  BEGIN
    INSERT INTO public.user_statistics_event_log (event_id, user_id, event_type)
    VALUES (NEW.id, v_user_id, NEW.event_type);
  EXCEPTION WHEN unique_violation THEN
    -- Event already processed
    RETURN NEW;
  END;

  -- Ensure user_statistics row exists
  INSERT INTO public.user_statistics (user_id)
  VALUES (v_user_id)
  ON CONFLICT (user_id) DO NOTHING;

  IF NEW.event_type = 'reader.session.ended' THEN
    v_duration_seconds := COALESCE((NEW.payload->>'durationSeconds')::integer, 0);
    v_pages_read := COALESCE((NEW.payload->>'pagesRead')::integer, 0);
    v_event_date := date_trunc('day', NEW.created_at)::date;

    IF v_duration_seconds < 0 THEN v_duration_seconds := 0; END IF;
    IF v_pages_read < 0 THEN v_pages_read := 0; END IF;

    -- Update statistics
    UPDATE public.user_statistics
    SET 
      seconds_read = COALESCE(seconds_read, 0) + v_duration_seconds,
      pages_read = COALESCE(pages_read, 0) + v_pages_read,
      updated_at = now()
    WHERE user_id = v_user_id
    RETURNING last_read_date, COALESCE(current_streak, 0), COALESCE(longest_streak, 0)
    INTO v_last_read_date, v_current_streak, v_longest_streak;

    -- Streak calculation
    IF v_last_read_date IS NULL THEN
      v_current_streak := 1;
    ELSIF v_event_date = v_last_read_date THEN
      -- Unchanged
    ELSIF v_event_date = v_last_read_date + 1 THEN
      v_current_streak := v_current_streak + 1;
    ELSIF v_event_date > v_last_read_date + 1 THEN
      v_current_streak := 1;
    END IF;

    v_longest_streak := GREATEST(v_longest_streak, v_current_streak);

    UPDATE public.user_statistics
    SET 
      last_read_date = GREATEST(COALESCE(last_read_date, '1970-01-01'::date), v_event_date),
      current_streak = v_current_streak,
      longest_streak = v_longest_streak
    WHERE user_id = v_user_id;

  ELSIF NEW.event_type = 'reader.book.completed' THEN
    v_book_id := (NEW.payload->>'bookId')::uuid;
    IF v_book_id IS NOT NULL THEN
      -- Domain invariant: check uniqueness
      BEGIN
        INSERT INTO public.user_book_completions (user_id, book_id, completed_at)
        VALUES (v_user_id, v_book_id, NEW.created_at);

        -- If insert succeeds, increment books_completed
        UPDATE public.user_statistics
        SET books_completed = COALESCE(books_completed, 0) + 1,
            updated_at = now()
        WHERE user_id = v_user_id;
      EXCEPTION WHEN unique_violation THEN
        -- Book already completed by this user
      END;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

DROP TRIGGER IF EXISTS outbox_events_statistics_trigger ON public.outbox_events;
CREATE TRIGGER outbox_events_statistics_trigger
  AFTER INSERT ON public.outbox_events
  FOR EACH ROW
  EXECUTE FUNCTION public.process_statistics_event();
