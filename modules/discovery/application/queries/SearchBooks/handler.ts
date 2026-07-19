import { DiscoveryReadModel } from "../../ports/read-models/DiscoveryReadModel";
import { SearchResultDto } from "./read-model";

export interface SearchBooksQuery {
  term?: string;
  genre?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
}

export async function searchBooks(
  repository: DiscoveryReadModel,
  query: SearchBooksQuery
): Promise<SearchResultDto> {
  const term = query.term || "";
  const genre = query.genre || "all";
  const page = query.page || 1;
  const pageSize = query.pageSize || 20;
  const sort = query.sort || "newest";

  return await repository.searchBooks(term, genre, page, pageSize, sort);
}
