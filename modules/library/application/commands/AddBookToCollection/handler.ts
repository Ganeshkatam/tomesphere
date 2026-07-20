import { CollectionRepository } from "../../../domain/repositories/CollectionRepository";

export async function addBookToCollection(
  repository: CollectionRepository,
  collectionId: string,
  bookId: string,
  userId: string,
): Promise<void> {
  await repository.addBook(collectionId, bookId, userId);
}
