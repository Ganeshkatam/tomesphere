import { DiscoveryReadModel } from "../../ports/read-models/DiscoveryReadModel";
import { BookSummaryDto } from "../../dto/BookSummaryDto";

export async function getSearchSuggestions(
  repository: DiscoveryReadModel,
  query: string,
): Promise<Partial<BookSummaryDto>[]> {
  return await repository.getSearchSuggestions(query);
}
