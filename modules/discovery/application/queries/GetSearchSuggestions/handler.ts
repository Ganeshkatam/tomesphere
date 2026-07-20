import { DiscoveryReadModel } from "../../ports/read-models/DiscoveryReadModel";
import { BookDto } from "@/modules/library/application/dto/response/BookDto";

export async function getSearchSuggestions(
  repository: DiscoveryReadModel,
  query: string,
): Promise<Partial<BookDto>[]> {
  return await repository.getSearchSuggestions(query);
}
