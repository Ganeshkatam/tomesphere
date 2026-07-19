import { LibraryRepository } from "../../../domain/repositories/LibraryRepository";
import { BookRepository } from "../../../../books/domain/repositories/BookRepository";
import { LibraryCollectionItemDto } from "@/modules/library/application/dto/response/LibraryEntryDto";
import { LibraryMapper } from "@/modules/library/application/mappers/LibraryMapper";
import { BookMapper } from "@/modules/library/application/mappers/BookMapper";

export async function getWantToReadBooks(
  libraryRepo: LibraryRepository,
  bookRepo: BookRepository,
  userId: string,
): Promise<LibraryCollectionItemDto[]> {
  const libraryBooks = await libraryRepo.getWantToRead(userId);

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
