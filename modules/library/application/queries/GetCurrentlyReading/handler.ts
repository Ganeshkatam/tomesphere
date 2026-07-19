import { LibraryRepository } from "../../../domain/repositories/LibraryRepository";
import { BookRepository } from "../../../../books/domain/repositories/BookRepository";
import { LibraryCollectionItemDto } from "@/modules/library/application/dto/response/LibraryEntryDto";
import { LibraryMapper } from "@/modules/library/application/mappers/LibraryMapper";
import { BookMapper } from "@/modules/library/application/mappers/BookMapper";

export async function getCurrentlyReading(
  libraryRepo: LibraryRepository,
  bookRepo: BookRepository,
  userId: string,
): Promise<LibraryCollectionItemDto[]> {
  const libraryBooks = await libraryRepo.getCurrentlyReading(userId);
  if (libraryBooks.length === 0) return [];

  // Fetch the corresponding books from the Book domain
  const compositeOutputs: LibraryCollectionItemDto[] = [];

  // In a real scenario with a lot of books, you might want a `bookRepo.findManyByIds`,
  // but for now we fetch individually or use `search` if possible.
  // For Phase 5A, we can just fetch individually since it's a limited list per user usually,
  // or add `findMany` to BookRepository later.
  for (const lb of libraryBooks) {
    const domainBook = await bookRepo.findById(lb.bookId as any); // Assuming BookId compatibility
    if (domainBook) {
      compositeOutputs.push({
        library: LibraryMapper.toEntryDto(lb),
        book: BookMapper.toDto(domainBook as any),
      });
    }
  }

  return compositeOutputs;
}
