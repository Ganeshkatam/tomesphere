import { GenreRepository } from "../../domain/repositories/GenreRepository";

export interface CreateGenreCommand {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export class CreateGenreHandler {
  constructor(private readonly repository: GenreRepository) {}

  async execute(command: CreateGenreCommand): Promise<string> {
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
