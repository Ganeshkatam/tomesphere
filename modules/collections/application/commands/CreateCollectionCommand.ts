import { CollectionRepository } from "../../domain/repositories/CollectionRepository";

export interface CreateCollectionCommand {
  title: string;
  slug: string;
  description?: string | null;
  cover_url?: string | null;
  is_active?: boolean;
}

export class CreateCollectionHandler {
  constructor(private readonly repository: CollectionRepository) {}

  async execute(command: CreateCollectionCommand): Promise<string> {
    const id = crypto.randomUUID();
    await this.repository.save({
      id,
      title: command.title,
      slug: command.slug,
      description: command.description,
      cover_url: command.cover_url,
      is_active: command.is_active ?? true,
    });
    return id;
  }
}
