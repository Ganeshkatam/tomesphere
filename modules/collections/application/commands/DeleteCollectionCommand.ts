import { CollectionRepository } from "../../domain/repositories/CollectionRepository";

export interface DeleteCollectionCommand {
  id: string;
}

export class DeleteCollectionHandler {
  constructor(private readonly repository: CollectionRepository) {}

  async execute(command: DeleteCollectionCommand): Promise<void> {
    await this.repository.delete(command.id);
  }
}
