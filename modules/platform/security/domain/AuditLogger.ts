import { SecurityAction } from '@/modules/shared/kernel/security/SecurityAction';

export interface AuditContext {
    actorId: string;
    ipAddress?: string;
    userAgent?: string;
    correlationId?: string;
}

export interface AuditLogger {
    /**
     * Logs a security-relevant action with rich application context.
     */
    logAction(action: SecurityAction, context: AuditContext, metadata?: Record<string, any>): Promise<void>;
}
