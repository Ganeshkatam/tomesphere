import { SupabaseClient } from "@supabase/supabase-js";
import { IdentityProvider } from "../../application/ports/identity/IdentityProvider";
import { AuthenticatedUser } from "../../application/dto/AuthenticatedUser";

export class SupabaseIdentityProvider implements IdentityProvider {
  constructor(private readonly supabase: SupabaseClient) {}

  async currentUserId(): Promise<string | null> {
    const { data: { user } } = await this.supabase.auth.getUser();
    return user?.id || null;
  }

  async currentUser(): Promise<AuthenticatedUser | null> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return null;

    const metadataName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.user_metadata?.display_name ||
      user.user_metadata?.custom_claims?.name;

    return {
      id: user.id,
      email: user.email,
      name: metadataName || undefined,
      displayName: metadataName || undefined,
      role: user.role,
    };
  }

  async isAuthenticated(): Promise<boolean> {
    const id = await this.currentUserId();
    return id !== null;
  }

  async hasRole(role: string): Promise<boolean> {
    const userId = await this.currentUserId();
    if (!userId) return false;

    if (role === "authenticated" || role === "user") return true;

    const { data, error } = await this.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", role)
      .maybeSingle();

    if (error) {
      console.error("[SupabaseIdentityProvider] Error checking role:", error);
      return false;
    }

    return !!data;
  }
}
