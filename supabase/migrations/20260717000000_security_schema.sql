-- Phase 9: Security Hardening Schema

-- 1. Create Tables
CREATE TABLE public.user_roles (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, role)
);

CREATE TABLE public.role_permissions (
    role VARCHAR(50) NOT NULL,
    permission VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (role, permission)
);

CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(100) NOT NULL,
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    correlation_id VARCHAR(100),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Indexes for Performance
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_role_permissions_role ON public.role_permissions(role);
CREATE INDEX idx_audit_logs_actor_id ON public.audit_logs(actor_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- 3. Authorization Functions (For RLS and Application Use)
CREATE OR REPLACE FUNCTION public.has_permission(p_user_id UUID, p_permission VARCHAR)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM user_roles ur
        JOIN role_permissions rp ON ur.role = rp.role
        WHERE ur.user_id = p_user_id
        AND rp.permission = p_permission
    );
$$;

CREATE OR REPLACE FUNCTION public.get_user_permissions(p_user_id UUID)
RETURNS TABLE (permission VARCHAR)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT DISTINCT rp.permission
    FROM user_roles ur
    JOIN role_permissions rp ON ur.role = rp.role
    WHERE ur.user_id = p_user_id;
$$;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 5. Define RLS Policies
-- user_roles is read-only for the user themselves, and fully accessible to admins
CREATE POLICY "Users can read their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
USING (public.has_permission(auth.uid(), 'ManageUsers'));

-- role_permissions is fully managed by admins, readable by anyone authenticated
CREATE POLICY "Anyone can read role permissions"
ON public.role_permissions FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage role permissions"
ON public.role_permissions FOR ALL
USING (public.has_permission(auth.uid(), 'ManageUsers'));

-- audit_logs are insert-only for the application (acting as service role), 
-- but we allow authenticated users to insert their own logs.
CREATE POLICY "Users can insert their own audit logs"
ON public.audit_logs FOR INSERT
WITH CHECK (auth.uid() = actor_id);

CREATE POLICY "Auditors can read audit logs"
ON public.audit_logs FOR SELECT
USING (public.has_permission(auth.uid(), 'ViewAuditLogs'));

-- 6. Initial Seed Data
INSERT INTO public.role_permissions (role, permission) VALUES
    ('Admin', 'ManageUsers'),
    ('Admin', 'ManageBooks'),
    ('Admin', 'ManageRecommendations'),
    ('Admin', 'ModerateReviews'),
    ('Admin', 'ViewAuditLogs')
ON CONFLICT DO NOTHING;
