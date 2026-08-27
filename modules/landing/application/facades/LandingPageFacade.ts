import { DiscoveryReadModel } from "@/modules/discovery/application/ports/read-models/DiscoveryReadModel";
import { GetPlatformStatisticsQueryHandler } from "@/modules/statistics/application/queries/GetPlatformStatistics/handler";
import { GetActiveAnnouncementsQueryHandler } from "@/modules/announcements/application/queries/GetActiveAnnouncements/handler";
import { DiscoveryOverviewDto } from "@/modules/discovery/application/queries/GetDiscoveryOverview/read-model";
import { PlatformStatisticsDto } from "@/modules/statistics/application/queries/GetPlatformStatistics/read-model";
import { AnnouncementDto } from "@/modules/announcements/application/dto/AnnouncementDto";


export interface LandingPageDto {
  overview: DiscoveryOverviewDto;
  statistics: PlatformStatisticsDto;
  announcements: AnnouncementDto[];
}

export interface LandingViewModel {
  landing: LandingPageDto;
}

export class LandingPageFacade {
  constructor(
    private readonly discoveryReadModel: DiscoveryReadModel,
    private readonly statisticsQuery: GetPlatformStatisticsQueryHandler,
    private readonly announcementsQuery: GetActiveAnnouncementsQueryHandler,
  ) {}

  async get(): Promise<LandingViewModel> {
    const [overview, statistics, announcements] = await Promise.all([
      this.discoveryReadModel.getOverview(),
      this.statisticsQuery.execute(),
      this.announcementsQuery.execute().catch(() => []),
    ]);

    return {
      landing: {
        overview,
        statistics,
        announcements,
      },
    };
  }
}
