import { DiscoveryReadModel } from "../../ports/read-models/DiscoveryReadModel";
import { GetLanguagesQuery } from "./query";
import { GetLanguagesResponseDto } from "./response";

export class GetLanguagesHandler {
  constructor(private readonly readModel: DiscoveryReadModel) {}

  async execute(query: GetLanguagesQuery): Promise<GetLanguagesResponseDto> {
    return this.readModel.getLanguages(query);
  }
}
