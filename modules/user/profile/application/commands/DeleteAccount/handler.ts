import { DeleteAccountCommand } from "./DeleteAccountCommand";
import { AccountDeletionRepository } from "../../../domain/repositories/AccountDeletionRepository";

export class DeleteAccountHandler {
  constructor(private readonly repository: AccountDeletionRepository) {}

  async execute(command: DeleteAccountCommand): Promise<void> {
    // 1. Sanitize the account logs (RPC execution)
    await this.repository.sanitizeAccount(command.userId);

    // 2. Delete the user via Supabase Auth Admin API
    // This will trigger the ON DELETE CASCADE across the rest of the database
    await this.repository.deleteUser(command.userId);
  }
}
