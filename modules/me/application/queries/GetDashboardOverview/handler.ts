import { DashboardReadModel } from "../../ports/read-models/DashboardReadModel";
import { DashboardOverviewDto } from "./read-model";

export async function getDashboardOverview(
  repository: DashboardReadModel,
  userId: string,
): Promise<DashboardOverviewDto> {
  return await repository.getDashboardOverview(userId);
}
