import { CollectionRepository } from "../../domain/repositories/CollectionRepository";

export interface UpdateCollectionCommand {
  id: string;
  title?: string;
  slug?: string;
  description?: string | null;
  cover_url?: string | null;
  is_active?: boolean;
}

export class UpdateCollectionHandler {
  constructor(private readonly repository: CollectionRepository) {}

  async execute(command: UpdateCollectionCommand): Promise<void> {
    const entity = await this.repository.findById(command.id);
    if (!entity) throw new Error(`Collection with id ${command.id} not found`);

    if (command.title !== undefined) entity.title = command.title;
    if (command.slug !== undefined) entity.slug = command.slug;
    if (command.description !== undefined)
      entity.description = command.description;
    if (command.cover_url !== undefined) entity.cover_url = command.cover_url;
    if (command.is_active !== undefined) entity.is_active = command.is_active;

    await this.repository.save(entity);
  }
}
