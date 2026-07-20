import { DiscoveryReadModel } from "../../ports/read-models/DiscoveryReadModel";
import { GetNewArrivalsQuery } from "./query";
import { GetNewArrivalsResponseDto } from "./response";

export class GetNewArrivalsHandler {
  constructor(private readonly readModel: DiscoveryReadModel) {}

  async execute(
    query: GetNewArrivalsQuery,
  ): Promise<GetNewArrivalsResponseDto> {
    return this.readModel.getNewArrivals(query);
  }
}
