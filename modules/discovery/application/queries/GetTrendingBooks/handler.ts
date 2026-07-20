import { DiscoveryReadModel } from "../../ports/read-models/DiscoveryReadModel";
import { GetTrendingBooksQuery } from "./query";
import { TrendingBooksResponseDto } from "./response";

export async function getTrendingBooks(
  repository: DiscoveryReadModel,
  query: GetTrendingBooksQuery,
): Promise<TrendingBooksResponseDto> {
  return await repository.getTrendingBooks(query);
}
