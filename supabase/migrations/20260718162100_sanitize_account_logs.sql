-- Migration: sanitize_account_logs
-- Purpose: Sanitize PII from orphaned log tables prior to account deletion.

CREATE OR REPLACE FUNCTION public.sanitize_account_logs(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- 1. Sanitize Audit Logs (actor_id becomes NULL automatically, but PII remains)
    -- We record an ACCOUNT_DELETED event without PII first, then nullify PII on the user's historical actions.
    
    INSERT INTO public.audit_logs (
        id, 
        action, 
        actor_id, 
        ip_address, 
        user_agent, 
        correlation_id, 
        metadata, 
        created_at
    ) VALUES (
        gen_random_uuid(),
        'ACCOUNT_DELETED',
        target_user_id,
        NULL,
        NULL,
        NULL,
        jsonb_build_object('reason', 'user_requested_deletion', 'target_user_id', target_user_id),
        now()
    );

    UPDATE public.audit_logs
    SET 
        ip_address = NULL,
        user_agent = NULL,
        metadata = jsonb_build_object(
            'redacted', true, 
            'deletedAt', now(), 
            'reason', 'account_deleted'
        )
    WHERE actor_id = target_user_id;

    -- 2. Sanitize System Logs (No foreign key on user_id)
    UPDATE public.system_logs
    SET 
        ip_address = NULL,
        metadata = jsonb_build_object(
            'redacted', true, 
            'deletedAt', now(), 
            'reason', 'account_deleted'
        )
    WHERE user_id = target_user_id;

    -- 3. Cancel Pending Outbox Messages (No foreign key on aggregate_id)
    -- We assume aggregate_id corresponds to the user_id for user-centric aggregates
    UPDATE public.outbox_messages
    SET 
        status = 'cancelled',
        payload = '{}'::jsonb,
        processed_at = now()
    WHERE aggregate_id = target_user_id AND status = 'pending';

END;
$$;
