-- Migration: Create export_requests table
-- Date: 2026-07-19

CREATE TYPE export_request_status AS ENUM ('requested', 'queued', 'processing', 'completed', 'failed');

CREATE TABLE IF NOT EXISTS export_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status export_request_status NOT NULL DEFAULT 'requested',
  download_url TEXT,
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  queued_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT
);

-- Index for querying user's active requests quickly
CREATE INDEX IF NOT EXISTS export_requests_user_id_status_idx ON export_requests(user_id, status);
CREATE INDEX IF NOT EXISTS export_requests_requested_at_idx ON export_requests(requested_at DESC);

-- RLS Policies
ALTER TABLE export_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own export requests"
  ON export_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage export requests"
  ON export_requests
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
