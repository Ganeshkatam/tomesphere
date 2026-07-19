import { BookRepository } from "../../../domain/repositories/BookRepository";
import { GetBookInput } from "./query";
import { BookDetailDto } from "@/modules/library/application/dto/response/BookDetailDto";
import { BookMapper } from "@/modules/library/application/mappers/BookMapper";

export async function getBook(
  repository: BookRepository,
  input: GetBookInput,
): Promise<BookDetailDto | null> {
  const book = await repository.findById(input.bookId);

  if (!book) {
    return null;
  }

  return BookMapper.toDetailDto(book);
}
