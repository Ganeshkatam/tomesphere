import { AuthenticatedUser } from "../../dto/AuthenticatedUser";

export interface IdentityProvider {
  currentUserId(): Promise<string | null>;
  currentUser(): Promise<AuthenticatedUser | null>;
  isAuthenticated(): Promise<boolean>;
  hasRole(role: string): Promise<boolean>;
}
