import { LanguageRepository } from "../../domain/repositories/LanguageRepository";

export interface UpdateLanguageCommand {
  id: string;
  code?: string;
  name?: string;
  native_name?: string;
  is_active?: boolean;
}

export class UpdateLanguageHandler {
  constructor(private readonly repository: LanguageRepository) {}

  async execute(command: UpdateLanguageCommand): Promise<void> {
    const entity = await this.repository.findById(command.id);
    if (!entity) throw new Error(`Language with id ${command.id} not found`);

    if (command.code !== undefined) entity.code = command.code;
    if (command.name !== undefined) entity.name = command.name;
    if (command.native_name !== undefined)
      entity.native_name = command.native_name;
    if (command.is_active !== undefined) entity.is_active = command.is_active;

    await this.repository.save(entity);
  }
}
