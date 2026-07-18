-- ==============================================================================
-- PHASE 10: Legacy Cleanup
-- Description: Removing obsolete tables and functions after successfully
-- migrating to the Transactional Outbox pattern.
-- ==============================================================================

-- 1. Drop the legacy activity_queue table
DROP TABLE IF EXISTS public.activity_queue CASCADE;

-- 2. Drop any legacy process_activity helpers if they existed 
-- (Assuming they were mostly TS side, but just in case there were RPCs for them)
-- e.g. upsert_daily_stats (if unused now since Outbox handles it)
DROP FUNCTION IF EXISTS public.upsert_daily_stats CASCADE;
DROP FUNCTION IF EXISTS public.increment_engagement CASCADE;

-- Note: We are keeping the core data tables (progress_daily, activity_log)
-- as they were refactored or are still serving a purpose, but their updates
-- now happen either synchronously or via Outbox projections.
