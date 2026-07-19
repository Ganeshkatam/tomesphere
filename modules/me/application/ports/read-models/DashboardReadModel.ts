import { DashboardOverviewDto } from "../../queries/GetDashboardOverview/read-model";

export interface DashboardReadModel {
  getDashboardOverview(userId: string): Promise<DashboardOverviewDto>;
}
