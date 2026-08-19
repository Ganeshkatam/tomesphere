import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";
import {
  SecurityReadModel,
  SecurityOverview,
} from "../../application/ports/SecurityReadModel";

/**
 * Supabase implementation of SecurityReadModel (CQRS read side).
 *
 * Queries auth metadata to determine password state and last change.
 */
export class SupabaseSecurityReadModel implements SecurityReadModel {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getSecurityOverview(userId: string): Promise<SecurityOverview> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();

    if (!user) {
      throw new Error("User not found");
    }

    // Determine if user has a password (vs social login only)
    const identities = user.identities ?? [];
    const hasEmailIdentity = identities.some(
      (identity) => identity.provider === "email",
    );

    return {
      hasPassword: hasEmailIdentity,
      lastPasswordChange: user.updated_at ?? null,
    };
  }
}
