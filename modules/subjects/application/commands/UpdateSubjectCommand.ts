import { SubjectRepository } from "../../domain/repositories/SubjectRepository";

export interface UpdateSubjectCommand {
  id: string;
  name?: string;
  slug?: string;
  description?: string;
  icon?: string;
}

export class UpdateSubjectHandler {
  constructor(private readonly repository: SubjectRepository) {}

  async execute(command: UpdateSubjectCommand): Promise<void> {
    const entity = await this.repository.findById(command.id);
    if (!entity) throw new Error(`Subject with id ${command.id} not found`);

    if (command.name !== undefined) entity.name = command.name;
    if (command.slug !== undefined) entity.slug = command.slug;
    if (command.description !== undefined)
      entity.description = command.description;
    if (command.icon !== undefined) entity.icon = command.icon;

    await this.repository.save(entity);
  }
}
