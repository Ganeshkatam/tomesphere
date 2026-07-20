import { DiscoveryReadModel } from "../../ports/read-models/DiscoveryReadModel";
import { GetCollectionsQuery } from "./query";
import { GetCollectionsResponseDto } from "./response";

export class GetCollectionsHandler {
  constructor(private readonly readModel: DiscoveryReadModel) {}

  async execute(
    query: GetCollectionsQuery,
  ): Promise<GetCollectionsResponseDto> {
    return this.readModel.getCollections(query);
  }
}
