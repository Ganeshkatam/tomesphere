import { LibraryWriteRepository } from "../../../domain/repositories/LibraryWriteRepository";

export interface RemoveBookFromLibraryRequest {
  userId: string;
  bookId: string;
}

export async function removeBookFromLibrary(
  repository: LibraryWriteRepository,
  request: RemoveBookFromLibraryRequest,
): Promise<void> {
  await repository.removeBookFromLibrary(request.userId, request.bookId);
}
