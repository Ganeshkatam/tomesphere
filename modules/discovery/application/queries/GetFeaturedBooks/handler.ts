import { DiscoveryReadModel } from "../../ports/read-models/DiscoveryReadModel";
import { GetFeaturedBooksQuery } from "./query";
import { GetFeaturedBooksResponseDto } from "./response";

export class GetFeaturedBooksHandler {
  constructor(private readonly readModel: DiscoveryReadModel) {}

  async execute(
    query: GetFeaturedBooksQuery,
  ): Promise<GetFeaturedBooksResponseDto> {
    return this.readModel.getFeaturedBooks(query);
  }
}
