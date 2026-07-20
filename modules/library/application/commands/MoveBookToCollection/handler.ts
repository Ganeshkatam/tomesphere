import { CollectionRepository } from "../../../domain/repositories/CollectionRepository";

export async function moveBookToCollection(
  repository: CollectionRepository,
  sourceCollectionId: string,
  targetCollectionId: string,
  bookId: string,
  userId: string,
): Promise<void> {
  // Command orchestrates the primitive operations
  await repository.removeBook(sourceCollectionId, bookId, userId);
  await repository.addBook(targetCollectionId, bookId, userId);
}
