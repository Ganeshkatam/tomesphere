import { CollectionRepository } from "../../domain/repositories/CollectionRepository";

export interface UpdateCollectionBooksCommand {
  collectionId: string;
  bookIds: string[];
}

export class UpdateCollectionBooksHandler {
  constructor(private readonly repository: CollectionRepository) {}

  async execute(command: UpdateCollectionBooksCommand): Promise<void> {
    await this.repository.updateBooks(command.collectionId, command.bookIds);
  }
}
