import { SubjectRepository } from "../../domain/repositories/SubjectRepository";

export interface CreateSubjectCommand {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export class CreateSubjectHandler {
  constructor(private readonly repository: SubjectRepository) {}

  async execute(command: CreateSubjectCommand): Promise<string> {
    const id = crypto.randomUUID();
    await this.repository.save({
      id,
      name: command.name,
      slug: command.slug,
      description: command.description,
      icon: command.icon,
    });
    return id;
  }
}
