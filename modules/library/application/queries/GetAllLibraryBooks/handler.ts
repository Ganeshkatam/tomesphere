import { LibraryRepository } from "../../../domain/repositories/LibraryRepository";
import { BookRepository } from "../../../../books/domain/repositories/BookRepository";
import { LibraryCollectionItemDto } from "@/modules/library/application/dto/response/LibraryEntryDto";
import { LibraryMapper } from "@/modules/library/application/mappers/LibraryMapper";
import { BookMapper } from "@/modules/library/application/mappers/BookMapper";

export async function getAllLibraryBooks(
  libraryRepo: LibraryRepository,
  bookRepo: BookRepository,
  userId: string,
): Promise<LibraryCollectionItemDto[]> {
  const reading = await libraryRepo.getCurrentlyReading(userId);
  const finished = await libraryRepo.getFinished(userId);
  const want = await libraryRepo.getWantToRead(userId);

  const libraryBooks = [...reading, ...finished, ...want];

  // Sort by updated_at descending
  libraryBooks.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  const compositeOutputs: LibraryCollectionItemDto[] = [];

  for (const lb of libraryBooks) {
    const domainBook = await bookRepo.findById(lb.bookId as any);
    if (domainBook) {
      compositeOutputs.push({
        library: LibraryMapper.toEntryDto(lb),
        book: BookMapper.toDto(domainBook),
      });
    }
  }

  return compositeOutputs;
}
