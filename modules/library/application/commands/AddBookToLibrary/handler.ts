import { LibraryRepository } from "../../../domain/repositories/LibraryRepository";
import { LibraryBook } from "../../../domain/entities/LibraryBook";
import { AddBookToLibraryInput } from "./input";
import { UseCaseResult } from "@/shared/core/application/UseCaseResult";
import { LibraryEntryDto } from "@/modules/library/application/dto/response/LibraryEntryDto";
import { LibraryMapper } from "@/modules/library/application/mappers/LibraryMapper";
import { BusinessRuleViolation } from "@/shared/kernel/DomainError";

export async function addBookToLibrary(
  repository: LibraryRepository,
  input: AddBookToLibraryInput,
): Promise<UseCaseResult<LibraryEntryDto>> {
  // Determine initial state, fallback to want_to_read
  const state = input.initialState || "want_to_read";

  // Check if already in library
  const existing = await repository.getLibraryEntry(input.userId, input.bookId);
  if (existing) {
    throw new BusinessRuleViolation("Book is already in the library");
  }

  const libraryBook = LibraryBook.add(input.userId, input.bookId, state);

  // Intent-based persistence
  await repository.add(libraryBook);

  return {
    output: LibraryMapper.toEntryDto(libraryBook),
    events: libraryBook.pullDomainEvents(),
  };
}
