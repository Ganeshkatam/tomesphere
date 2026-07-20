import { DiscoveryReadModel } from "../../ports/read-models/DiscoveryReadModel";
import { GetGenresQuery } from "./query";
import { GetGenresResponseDto } from "./response";

export class GetGenresHandler {
  constructor(private readonly readModel: DiscoveryReadModel) {}

  async execute(query: GetGenresQuery): Promise<GetGenresResponseDto> {
    return this.readModel.getGenres(query);
  }
}
