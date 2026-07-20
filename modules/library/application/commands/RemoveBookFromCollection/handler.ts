import { CollectionRepository } from "../../../domain/repositories/CollectionRepository";

export async function removeBookFromCollection(
  repository: CollectionRepository,
  collectionId: string,
  bookId: string,
  userId: string,
): Promise<void> {
  await repository.removeBook(collectionId, bookId, userId);
}
