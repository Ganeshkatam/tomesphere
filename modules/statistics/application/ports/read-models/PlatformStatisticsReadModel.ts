import { PlatformStatisticsDto } from "../../queries/GetPlatformStatistics/read-model";

export interface PlatformStatisticsReadModel {
  getStatistics(): Promise<PlatformStatisticsDto>;
}
