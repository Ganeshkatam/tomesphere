import { SupabaseClient } from "@supabase/supabase-js";
import { AccountDeletionRepository } from "../../domain/repositories/AccountDeletionRepository";

/**
 * Supabase implementation of AccountDeletionRepository.
 *
 * Moved from modules/user/profile/infrastructure/repositories/
 * to modules/me/account/deletion/infrastructure/repositories/.
 *
 * Uses the admin client for user deletion (requires service role key).
 */
export class SupabaseAccountDeletionRepository implements AccountDeletionRepository {
  constructor(private readonly supabaseAdmin: SupabaseClient) {}

  async sanitizeAccount(userId: string): Promise<void> {
    const { error } = await this.supabaseAdmin.rpc("sanitize_account_logs", {
      target_user_id: userId,
    });

    if (error) {
      throw new Error(`Failed to sanitize account: ${error.message}`);
    }
  }

  async deleteUser(userId: string): Promise<void> {
    const { error } = await this.supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
      throw new Error(`Failed to delete user from Auth API: ${error.message}`);
    }
  }
}
