import { ProfileRepository } from "../../../../user/profile/domain/repositories/ProfileRepository";
import { getProfile } from "../../../../user/profile/application/queries/GetProfile/handler";
import { ProfileDto } from "../../../../user/profile/application/queries/GetProfile/read-model";
import { DashboardReadModel } from "../ports/read-models/DashboardReadModel";
import { getDashboardOverview } from "../queries/GetDashboardOverview/handler";
import { DashboardOverviewDto } from "../queries/GetDashboardOverview/read-model";

export interface AccountDashboardDto {
  profile: ProfileDto | null;
  dashboard: DashboardOverviewDto;
}

export class AccountDashboardFacade {
  constructor(
    private readonly profileRepo: ProfileRepository,
    private readonly dashboardRepo: DashboardReadModel,
  ) {}

  async get(userId: string): Promise<AccountDashboardDto> {
    const [profile, dashboard] = await Promise.all([
      getProfile(this.profileRepo, userId).catch(() => null),
      getDashboardOverview(this.dashboardRepo, userId).catch(() => ({
        currentReading: [],
        recentBooks: [],
        progress: { booksRead: 0, totalBooksGoal: null },
        streak: { current: 0, best: 0 },
        librarySummary: {
          totalBooks: 0,
          currentlyReadingCount: 0,
          wantToReadCount: 0,
        },
        collectionsSummary: { totalCollections: 0 },
      })),
    ]);

    return {
      profile,
      dashboard,
    };
  }
}
