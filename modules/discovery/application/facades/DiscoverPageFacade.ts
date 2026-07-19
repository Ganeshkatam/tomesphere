import { DiscoveryReadModel } from "../ports/read-models/DiscoveryReadModel";
import { DiscoveryOverviewDto } from "../queries/GetDiscoveryOverview/read-model";
import { GetPlatformStatisticsQueryHandler } from "@/modules/statistics/application/queries/GetPlatformStatistics/handler";
import { GetActiveAnnouncementsQueryHandler } from "@/modules/announcements/application/queries/GetActiveAnnouncements/handler";
import { PlatformStatisticsDto } from "@/modules/statistics/application/queries/GetPlatformStatistics/read-model";
import { AnnouncementDto } from "@/modules/announcements/application/dto/AnnouncementDto";

export interface DiscoverPageDto {
  overview: DiscoveryOverviewDto;
  statistics: PlatformStatisticsDto;
  announcements: AnnouncementDto[];
}

export class DiscoverPageFacade {
  constructor(
    private readonly discoveryReadModel: DiscoveryReadModel,
    private readonly statisticsQuery: GetPlatformStatisticsQueryHandler,
    private readonly announcementsQuery: GetActiveAnnouncementsQueryHandler
  ) {}

  async get(): Promise<DiscoverPageDto> {
    const [overview, statistics, announcements] = await Promise.all([
      this.discoveryReadModel.getOverview(),
      this.statisticsQuery.execute(),
      this.announcementsQuery.execute(),
    ]);

    return {
      overview,
      statistics,
      announcements,
    };
  }
}
