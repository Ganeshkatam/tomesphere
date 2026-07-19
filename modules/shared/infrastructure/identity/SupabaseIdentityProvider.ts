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

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  async isAuthenticated(): Promise<boolean> {
    const id = await this.currentUserId();
    return id !== null;
  }

  async hasRole(role: string): Promise<boolean> {
    const user = await this.currentUser();
    return user?.role === role;
  }
}
