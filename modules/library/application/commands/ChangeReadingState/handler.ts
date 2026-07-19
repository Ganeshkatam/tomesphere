import { LibraryRepository } from "../../../domain/repositories/LibraryRepository";
import { ChangeReadingStateInput } from "./input";
import { UseCaseResult } from "@/shared/core/application/UseCaseResult";
import { LibraryEntryDto } from "@/modules/library/application/dto/response/LibraryEntryDto";
import { LibraryMapper } from "@/modules/library/application/mappers/LibraryMapper";
import { BusinessRuleViolation } from "@/shared/kernel/DomainError";

export async function changeReadingState(
  repository: LibraryRepository,
  input: ChangeReadingStateInput,
): Promise<UseCaseResult<LibraryEntryDto>> {
  const libraryBook = await repository.getLibraryEntry(
    input.userId,
    input.bookId,
  );
  if (!libraryBook) {
    throw new BusinessRuleViolation("Book is not in the library");
  }

  switch (input.newState) {
    case "want_to_read":
      libraryBook.restoreToWantToRead();
      break;
    case "currently_reading":
      libraryBook.startReading();
      break;
    case "finished":
      libraryBook.finish();
      break;
    case "abandoned":
      libraryBook.abandon();
      break;
  }

  await repository.save(libraryBook);

  return {
    output: LibraryMapper.toEntryDto(libraryBook),
    events: libraryBook.pullDomainEvents(),
  };
}
