import { AuthorRepository } from "../../domain/repositories/AuthorRepository";

export interface CreateAuthorCommand {
  name: string;
  slug: string;
  bio?: string;
  avatar_url?: string;
}

export class CreateAuthorHandler {
  constructor(private readonly repository: AuthorRepository) {}

  async execute(command: CreateAuthorCommand): Promise<string> {
    const id = crypto.randomUUID();
    await this.repository.save({
      id,
      name: command.name,
      slug: command.slug,
      bio: command.bio,
      avatar_url: command.avatar_url,
    });
    return id;
  }
}
