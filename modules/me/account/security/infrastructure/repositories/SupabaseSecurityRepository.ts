import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";
import { SecurityRepository } from "../../domain/repositories/SecurityRepository";

/**
 * Supabase implementation of SecurityRepository (CQRS write side).
 *
 * This is the ONLY place in the security sub-capability
 * that touches SupabaseClient for auth mutations.
 */
export class SupabaseSecurityRepository implements SecurityRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async changePassword(newPassword: string): Promise<void> {
    const { error } = await this.supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw new Error(`Failed to change password: ${error.message}`);
    }
  }

  async signOutAllSessions(): Promise<void> {
    const { error } = await this.supabase.auth.signOut({ scope: "others" });

    if (error) {
      throw new Error(
        `Failed to sign out from other devices: ${error.message}`,
      );
    }
  }
}
