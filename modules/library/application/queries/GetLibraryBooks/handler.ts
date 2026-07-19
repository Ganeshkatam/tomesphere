import { LibraryReadModel } from "../../../application/ports/read-models/LibraryReadModel";
import { LibraryCollectionItemDto } from "../../dto/response/LibraryEntryDto";

export async function getLibraryBooks(
  repository: LibraryReadModel,
  userId: string
): Promise<LibraryCollectionItemDto[]> {
  return repository.getLibraryBooks(userId);
}

export async function getLibraryBook(
  repository: LibraryReadModel,
  userId: string,
  bookId: string
): Promise<LibraryCollectionItemDto | null> {
  return repository.getLibraryBook(userId, bookId);
}
