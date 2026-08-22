-- Migration: 20260822000000_recreate_audit_logs.sql
-- Description: Recreates the public.audit_logs table with RLS and indexing for authentication and security auditing.

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    correlation_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for performant lookup and time-series querying
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);

-- Row Level Security
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow application actions to insert audit logs
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'audit_logs' AND policyname = 'audit_logs_insert_policy'
    ) THEN
        CREATE POLICY audit_logs_insert_policy
        ON public.audit_logs FOR INSERT
        WITH CHECK (true);
    END IF;
END $$;

-- Allow users to view their own audit records
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'audit_logs' AND policyname = 'audit_logs_select_policy'
    ) THEN
        CREATE POLICY audit_logs_select_policy
        ON public.audit_logs FOR SELECT
        USING (auth.uid() = actor_id);
    END IF;
END $$;
