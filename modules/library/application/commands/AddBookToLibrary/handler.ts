import { LibraryWriteRepository } from "../../../domain/repositories/LibraryWriteRepository";

export interface AddBookToLibraryRequest {
  userId: string;
  bookId: string;
  state: string; // e.g., "want_to_read", "reading", "finished"
}

export async function addBookToLibrary(
  repository: LibraryWriteRepository,
  request: AddBookToLibraryRequest
): Promise<void> {
  // Validate state if necessary
  await repository.addBookToLibrary(request.userId, request.bookId, request.state);
}
