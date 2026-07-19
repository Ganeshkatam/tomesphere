import { BookDto } from "./BookDto";

export interface LibraryEntryDto {
  userId: string;
  bookId: string;
  state: string; // "want_to_read" | "reading" | "finished" | "abandoned"
  progress: number;
  startedAt?: string;
  finishedAt?: string;
  lastOpenedAt?: string;
  isFavorite: boolean;
}

export interface LibraryCollectionItemDto {
  book: BookDto;
  library: LibraryEntryDto;
}
