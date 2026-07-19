import { BookRepository } from "../../../domain/repositories/BookRepository";
import { SearchBooksInput } from "./query";
import { BookDto } from "@/modules/library/application/dto/response/BookDto";
import { BookMapper } from "@/modules/library/application/mappers/BookMapper";

export async function searchBooks(
  repository: BookRepository,
  input: SearchBooksInput,
): Promise<{ items: BookDto[]; totalCount?: number }> {
  const paginatedResult = await repository.search({
    term: input.term,
    genre: input.genreFilters,
    limit: input.limit,
    offset: input.offset,
  });

  return {
    items: paginatedResult.items.map(BookMapper.toDto),
    totalCount: paginatedResult.totalCount,
  };
}
