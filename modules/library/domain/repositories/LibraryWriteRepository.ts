export interface LibraryWriteRepository {
  addBookToLibrary(
    userId: string,
    bookId: string,
    state: string,
  ): Promise<void>;
  removeBookFromLibrary(userId: string, bookId: string): Promise<void>;
}
