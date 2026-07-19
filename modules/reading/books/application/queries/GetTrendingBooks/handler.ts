import { BookRepository } from "../../../domain/repositories/BookRepository";
import { BookDto } from "@/modules/library/application/dto/response/BookDto";
import { BookMapper } from "@/modules/library/application/mappers/BookMapper";

export async function getTrendingBooks(
  repository: BookRepository,
  limit: number = 10,
  category?: string,
): Promise<{ items: BookDto[] }> {
  const domainBooks = await repository.getTrending({ limit, category });

  return {
    items: domainBooks.map(BookMapper.toDto),
  };
}
