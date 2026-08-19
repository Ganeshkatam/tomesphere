export interface AuthenticatedUser {
  readonly id: string;
  readonly email?: string;
  readonly name?: string;
  readonly displayName?: string;
  readonly role?: string;
}
