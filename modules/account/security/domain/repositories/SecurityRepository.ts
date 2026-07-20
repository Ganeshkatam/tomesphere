/**
 * Security Repository (CQRS Command Side)
 *
 * Handles write operations for security-related actions.
 * Read operations are handled by SecurityReadModel.
 */

export interface SecurityRepository {
  changePassword(newPassword: string): Promise<void>;
  signOutAllSessions(): Promise<void>;
}
