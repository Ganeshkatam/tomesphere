import { DeleteAccountCommand } from "./index";
import { AccountDeletionRepository } from "../../../domain/repositories/AccountDeletionRepository";
import { emitOutboxEvent } from "@/shared/core/infrastructure/outbox/outbox";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";

/**
 * Delete Account Handler
 *
 * Flow:
 *   1. Sanitize PII in logs via RPC
 *   2. Delete user from auth (cascades across DB)
 *   3. Emit account.deleted event (event represents a completed fact)
 *
 * The event is emitted AFTER successful deletion, not before,
 * to ensure it represents something that actually happened.
 */
export class DeleteAccountHandler {
  constructor(
    private readonly repository: AccountDeletionRepository,
    private readonly supabase: SupabaseClient<Database>,
  ) {}

  async execute(command: DeleteAccountCommand): Promise<void> {
    // 1. Sanitize PII in logs via RPC
    await this.repository.sanitizeAccount(command.userId);

    // 2. Delete user (cascades across DB)
    await this.repository.deleteUser(command.userId);

    // 3. Emit domain event AFTER deletion (completed fact)
    await emitOutboxEvent(
      this.supabase,
      "account.deleted",
      {
        userId: command.userId,
        occurredAt: new Date().toISOString(),
      },
      "account",
      command.userId,
    );
  }
}
