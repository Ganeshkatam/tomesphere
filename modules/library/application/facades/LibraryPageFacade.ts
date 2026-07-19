import { LibraryRepository } from "../../domain/repositories/LibraryRepository";
import { BookRepository } from "../../../books/domain/repositories/BookRepository";
import { LibraryCollectionItemDto } from "../dto/response/LibraryEntryDto";
import { getCurrentlyReading } from "../queries/GetCurrentlyReading/handler";
import { getFinishedBooks } from "../queries/GetFinishedBooks/handler";
import { getWantToReadBooks } from "../queries/GetWantToRead/handler";

export interface LibraryPageDto {
  reading: LibraryCollectionItemDto[];
  finished: LibraryCollectionItemDto[];
  wantToRead: LibraryCollectionItemDto[];
}

export class LibraryPageFacade {
  constructor(
    private readonly libraryRepo: LibraryRepository,
    private readonly bookRepo: BookRepository
  ) {}

  async get(userId: string): Promise<LibraryPageDto> {
    const [reading, finished, wantToRead] = await Promise.all([
      getCurrentlyReading(this.libraryRepo, this.bookRepo, userId),
      getFinishedBooks(this.libraryRepo, this.bookRepo, userId),
      getWantToReadBooks(this.libraryRepo, this.bookRepo, userId),
    ]);

    return {
      reading,
      finished,
      wantToRead,
    };
  }
}
