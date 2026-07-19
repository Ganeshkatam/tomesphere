import { DiscoveryReadModel } from "../../ports/read-models/DiscoveryReadModel";
import { DiscoveryOverviewDto } from "./read-model";

export async function getDiscoveryOverview(
  repository: DiscoveryReadModel
): Promise<DiscoveryOverviewDto> {
  return await repository.getOverview();
}
