-- Create user_permissions table to record explicit user permission grants and consents
CREATE TABLE IF NOT EXISTS public.user_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    permission_type TEXT NOT NULL,
    granted BOOLEAN NOT NULL DEFAULT true,
    file_name TEXT,
    file_size BIGINT,
    mime_type TEXT,
    resource_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;

-- Policies: Users can view and insert their own permissions
DROP POLICY IF EXISTS "Users can view own permissions" ON public.user_permissions;
CREATE POLICY "Users can view own permissions"
    ON public.user_permissions
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can record own permissions" ON public.user_permissions;
CREATE POLICY "Users can record own permissions"
    ON public.user_permissions
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Documentation
COMMENT ON TABLE public.user_permissions IS 'Audit ledger recording explicit user permission grants and consents for uploads and privacy.';
