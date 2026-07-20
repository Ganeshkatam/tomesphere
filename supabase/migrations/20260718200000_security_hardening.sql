-- Milestone 1.7 — Security Hardening: Auth Rate Limits
--
-- Creates the auth_rate_limits table for application-level rate limiting.
--
-- NOTE: The following already exist in the live database (verified via Supabase MCP):
--   - audit_logs table (with indexes on actor_id, created_at DESC)
--   - audit_logs RLS policies (INSERT for own rows, SELECT via has_permission)
--   - user_roles table (user_id, role)
--   - role_permissions table (role, permission)
--   - has_permission(user_id, permission) function
--
-- This migration only adds what's missing: auth_rate_limits.

-- ─── Auth Rate Limits ────────────────────────────────────────
-- Tracks failed authentication attempts per key (IP, email, or composite).
-- Used by SupabaseRateLimiter to enforce sliding-window rate limiting
-- and temporary account lockouts.

CREATE TABLE IF NOT EXISTS auth_rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL,
  locked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Fast lookups by key for rate limit checks
CREATE INDEX IF NOT EXISTS idx_auth_rate_limits_key
  ON auth_rate_limits(key);

-- Fast cleanup of expired entries
CREATE INDEX IF NOT EXISTS idx_auth_rate_limits_created_at
  ON auth_rate_limits(created_at);

-- Enable RLS
ALTER TABLE auth_rate_limits ENABLE ROW LEVEL SECURITY;

-- Authenticated users can insert rate limit entries (server actions run as authenticated user)
CREATE POLICY "Authenticated can insert rate limits" ON auth_rate_limits
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can read rate limit entries (needed for check() queries)
CREATE POLICY "Authenticated can read rate limits" ON auth_rate_limits
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can delete their rate limit entries (needed for reset() on successful login)
CREATE POLICY "Authenticated can delete rate limits" ON auth_rate_limits
  FOR DELETE
  TO authenticated
  USING (true);

-- ─── Periodic Cleanup Function ───────────────────────────────
-- Clean up expired rate limit entries older than 24 hours.
-- Can be called by a cron job or Supabase edge function.

CREATE OR REPLACE FUNCTION cleanup_expired_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM auth_rate_limits
  WHERE created_at < now() - INTERVAL '24 hours';
END;
$$;

-- ─── Add missing index on audit_logs.action ──────────────────
-- The live database has indexes on actor_id and created_at but not action.
CREATE INDEX IF NOT EXISTS idx_audit_logs_action
  ON audit_logs(action);
