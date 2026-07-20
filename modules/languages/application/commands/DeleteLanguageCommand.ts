import { LanguageRepository } from "../../domain/repositories/LanguageRepository";

export interface DeleteLanguageCommand {
  id: string;
}

export class DeleteLanguageHandler {
  constructor(private readonly repository: LanguageRepository) {}

  async execute(command: DeleteLanguageCommand): Promise<void> {
    await this.repository.delete(command.id);
  }
}
