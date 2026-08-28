-- Migration: 20260828020000_repair_authorization_foundation.sql
-- Description: Restores the canonical relational tables for user roles and role permissions,
--              seeds the system capabilities mapping, and fixes has_permission/get_user_permissions RPCs.

-- 1. Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, role)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

-- 2. Create role_permissions table
CREATE TABLE IF NOT EXISTS public.role_permissions (
    role VARCHAR(50) NOT NULL,
    permission VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (role, permission)
);

CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON public.role_permissions(role);

-- 3. Seed canonical role permissions
INSERT INTO public.role_permissions (role, permission) VALUES
    ('admin', 'ManageUsers'),
    ('admin', 'ManageBooks'),
    ('admin', 'ManageAnnouncements'),
    ('admin', 'ManageRecommendations'),
    ('admin', 'ModerateReviews'),
    ('admin', 'ViewAuditLogs'),
    ('curator', 'ManageBooks'),
    ('moderator', 'ModerateReviews'),
    ('auditor', 'ViewAuditLogs')
ON CONFLICT (role, permission) DO NOTHING;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
DROP POLICY IF EXISTS "Users can read their own roles" ON public.user_roles;
CREATE POLICY "Users can read their own roles"
    ON public.user_roles FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone authenticated can read role permissions" ON public.role_permissions;
CREATE POLICY "Anyone authenticated can read role permissions"
    ON public.role_permissions FOR SELECT
    TO authenticated
    USING (true);

-- 6. Canonical Authorization RPC Functions
CREATE OR REPLACE FUNCTION public.has_permission(p_user_id UUID, p_permission VARCHAR)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, auth
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles ur
        JOIN public.role_permissions rp ON ur.role = rp.role
        WHERE ur.user_id = p_user_id
        AND rp.permission = p_permission
    );
$$;

CREATE OR REPLACE FUNCTION public.get_user_permissions(p_user_id UUID)
RETURNS TABLE (permission VARCHAR)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, auth
AS $$
    SELECT DISTINCT rp.permission
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role = rp.role
    WHERE ur.user_id = p_user_id;
$$;

-- 7. Grant access to authenticated and service_role
GRANT SELECT ON public.user_roles TO authenticated;
GRANT SELECT ON public.role_permissions TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
GRANT ALL ON public.role_permissions TO service_role;
GRANT EXECUTE ON FUNCTION public.has_permission(UUID, VARCHAR) TO authenticated, service_role, anon;
GRANT EXECUTE ON FUNCTION public.get_user_permissions(UUID) TO authenticated, service_role, anon;
