import { DiscoveryReadModel } from "@/modules/discovery/application/ports/read-models/DiscoveryReadModel";
import { GetPlatformStatisticsQueryHandler } from "@/modules/statistics/application/queries/GetPlatformStatistics/handler";
import { GetActiveAnnouncementsQueryHandler } from "@/modules/announcements/application/queries/GetActiveAnnouncements/handler";
import { DiscoveryOverviewDto } from "@/modules/discovery/application/queries/GetDiscoveryOverview/read-model";
import { PlatformStatisticsDto } from "@/modules/statistics/application/queries/GetPlatformStatistics/read-model";
import { AnnouncementDto } from "@/modules/announcements/application/dto/AnnouncementDto";
import {
  NavigationFacade,
  NavigationDto,
} from "@/modules/navigation/application/facades/NavigationFacade";

export interface LandingPageDto {
  overview: DiscoveryOverviewDto;
  statistics: PlatformStatisticsDto;
  announcements: AnnouncementDto[];
}

export interface LandingViewModel {
  navigation: NavigationDto;
  landing: LandingPageDto;
}

export class LandingPageFacade {
  constructor(
    private readonly discoveryReadModel: DiscoveryReadModel,
    private readonly statisticsQuery: GetPlatformStatisticsQueryHandler,
    private readonly announcementsQuery: GetActiveAnnouncementsQueryHandler,
    private readonly navigationFacade: NavigationFacade,
  ) {}

  async get(): Promise<LandingViewModel> {
    const [overview, statistics, announcements, navigation] = await Promise.all(
      [
        this.discoveryReadModel.getOverview(),
        this.statisticsQuery.execute(),
        this.announcementsQuery.execute(),
        this.navigationFacade.get(),
      ],
    );

    return {
      navigation,
      landing: {
        overview,
        statistics,
        announcements,
      },
    };
  }
}
