-- Move reading_goal and reading_goal_yearly from user_preferences to user_stats

-- 1. Add columns to user_stats
ALTER TABLE public.user_stats 
ADD COLUMN reading_goal integer DEFAULT 30,
ADD COLUMN reading_goal_yearly integer DEFAULT 12;

-- 2. Migrate existing data from user_preferences
UPDATE public.user_stats us
SET 
  reading_goal = up.reading_goal,
  reading_goal_yearly = up.reading_goal_yearly
FROM public.user_preferences up
WHERE us.user_id = up.user_id;

-- 3. Drop columns from user_preferences (Optional, but keeps schema clean)
-- We will leave them for now or drop them depending on rollback needs. Let's drop them to enforce the new domain boundary.
ALTER TABLE public.user_preferences
DROP COLUMN reading_goal,
DROP COLUMN reading_goal_yearly;
