import { AuthorRepository } from "../../domain/repositories/AuthorRepository";

export interface UpdateAuthorCommand {
  id: string;
  name?: string;
  slug?: string;
  bio?: string;
  avatar_url?: string;
}

export class UpdateAuthorHandler {
  constructor(private readonly repository: AuthorRepository) {}

  async execute(command: UpdateAuthorCommand): Promise<void> {
    const author = await this.repository.findById(command.id);
    if (!author) {
      throw new Error(`Author with id ${command.id} not found`);
    }

    if (command.name !== undefined) author.name = command.name;
    if (command.slug !== undefined) author.slug = command.slug;
    if (command.bio !== undefined) author.bio = command.bio;
    if (command.avatar_url !== undefined)
      author.avatar_url = command.avatar_url;

    await this.repository.save(author);
  }
}
