-- Create notifications read model

DROP TABLE IF EXISTS public.notifications CASCADE;
CREATE TABLE IF NOT EXISTS public.notifications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Traceability
    event_name text NOT NULL,
    aggregate_id text NOT NULL,
    aggregate_type text NOT NULL,
    
    -- Presentation
    type text NOT NULL CHECK (type IN ('INFO', 'SUCCESS', 'WARNING', 'ERROR')),
    title text NOT NULL,
    body text NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    
    -- Status
    read_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for fast querying by the UI
CREATE INDEX IF NOT EXISTS idx_notifications_user_created 
    ON public.notifications(user_id, created_at DESC);

-- Index for idempotency checks
CREATE UNIQUE INDEX IF NOT EXISTS idx_notifications_idempotency 
    ON public.notifications(user_id, event_name, aggregate_id);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can read their own notifications
CREATE POLICY "Users can view own notifications"
    ON public.notifications FOR SELECT
    USING (auth.uid() = user_id);

-- Users can update their own notifications (to mark as read)
CREATE POLICY "Users can update own notifications"
    ON public.notifications FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Service role can do everything (for background handlers)
CREATE POLICY "Service role manages notifications"
    ON public.notifications
    USING (auth.role() = 'service_role');
