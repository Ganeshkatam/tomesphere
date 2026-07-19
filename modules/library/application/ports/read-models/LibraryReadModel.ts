import { LibraryCollectionItemDto } from "../../dto/response/LibraryEntryDto";

export interface LibraryReadModel {
  getLibraryBooks(userId: string): Promise<LibraryCollectionItemDto[]>;
  getLibraryBook(userId: string, bookId: string): Promise<LibraryCollectionItemDto | null>;
}
