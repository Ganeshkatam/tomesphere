import { SupabaseClient } from "@supabase/supabase-js";
import { AuditContext, AuditLogger } from "../domain/AuditLogger";
import { SecurityAction } from "@/modules/shared/kernel/security/SecurityAction";

export class PostgresAuditLogger implements AuditLogger {
  constructor(private readonly supabase: SupabaseClient) {}

  async logAction(
    action: SecurityAction,
    context: AuditContext,
    metadata?: Record<string, any>,
  ): Promise<void> {
    const { error } = await this.supabase.from("audit_logs").insert({
      action,
      actor_id: context.actorId,
      ip_address: context.ipAddress,
      user_agent: context.userAgent,
      correlation_id: context.correlationId,
      metadata: metadata || {},
    });

    if (error) {
      // We intentionally do not throw here to prevent auditing failures
      // from crashing the main application flow, but we log loudly.
      console.error("CRITICAL: Failed to write to audit log", error);
    }
  }
}
