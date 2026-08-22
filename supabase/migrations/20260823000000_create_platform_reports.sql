-- supabase/migrations/20260823000000_create_platform_reports.sql

CREATE TABLE public.platform_reports (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    type text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,

    email text NULL,
    user_id uuid NULL REFERENCES auth.users(id),

    status text NOT NULL DEFAULT 'PENDING',

    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT platform_reports_type_check
        CHECK (type IN ('BUG', 'ABUSE', 'SECURITY')),

    CONSTRAINT platform_reports_status_check
        CHECK (status IN ('PENDING', 'IN_REVIEW', 'RESOLVED', 'CLOSED'))
);

ALTER TABLE public.platform_reports ENABLE ROW LEVEL SECURITY;

-- Allow anyone (authenticated or anonymous) to insert reports
CREATE POLICY "Anyone can insert a platform report"
    ON public.platform_reports
    FOR INSERT
    WITH CHECK (true);

-- Explicitly deny SELECT/UPDATE/DELETE (this is the default when RLS is enabled without matching policies, 
-- but it's good practice to document intent if needed, or simply omit them).
