import { SecurityAction } from "@/shared/kernel/security/SecurityAction";

export interface AuditContext {
  actorId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  correlationId?: string | null;
}

export interface AuditLogger {
  /**
   * Logs a security-relevant action with rich application context.
   */
  logAction(
    action: SecurityAction,
    context: AuditContext,
    metadata?: Record<string, any>,
  ): Promise<void>;
}
