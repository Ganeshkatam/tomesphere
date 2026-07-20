import { LanguageRepository } from "../../domain/repositories/LanguageRepository";

export interface CreateLanguageCommand {
  code: string;
  name: string;
  native_name: string;
  is_active?: boolean;
}

export class CreateLanguageHandler {
  constructor(private readonly repository: LanguageRepository) {}

  async execute(command: CreateLanguageCommand): Promise<string> {
    const id = crypto.randomUUID();
    await this.repository.save({
      id,
      code: command.code,
      name: command.name,
      native_name: command.native_name,
      is_active: command.is_active ?? true,
    });
    return id;
  }
}
