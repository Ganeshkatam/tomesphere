import { LibraryRepository } from "../../../domain/repositories/LibraryRepository";
import { UpdateReadingProgressInput } from "./input";
import { UseCaseResult } from "@/modules/shared/core/application/UseCaseResult";
import { LibraryEntryDto } from "@/modules/library/application/dto/response/LibraryEntryDto";
import { LibraryMapper } from "@/modules/library/application/mappers/LibraryMapper";
import { BusinessRuleViolation } from "@/modules/core/domain/DomainError";

export async function updateReadingProgress(
  repository: LibraryRepository,
  input: UpdateReadingProgressInput,
): Promise<UseCaseResult<LibraryEntryDto>> {
  const libraryBook = await repository.getLibraryEntry(
    input.userId,
    input.bookId,
  );
  if (!libraryBook) {
    throw new BusinessRuleViolation("Book is not in the library");
  }

  libraryBook.updateProgress(input.progress);

  await repository.save(libraryBook);

  return {
    output: LibraryMapper.toEntryDto(libraryBook),
    events: libraryBook.pullDomainEvents(),
  };
}
