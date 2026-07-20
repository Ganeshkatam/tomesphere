import { DiscoveryReadModel } from "../../ports/read-models/DiscoveryReadModel";
import { GetAuthorsQuery } from "./query";
import { GetAuthorsResponseDto } from "./response";

export class GetAuthorsHandler {
  constructor(private readonly readModel: DiscoveryReadModel) {}

  async execute(query: GetAuthorsQuery): Promise<GetAuthorsResponseDto> {
    return this.readModel.getAuthors(query);
  }
}
