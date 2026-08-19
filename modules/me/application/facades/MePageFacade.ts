import { IdentityProvider } from "@/shared/application/ports/identity/IdentityProvider";
import { AuthenticatedUser } from "@/shared/application/dto/AuthenticatedUser";
import { GetContinueReadingQuery } from "@/modules/library/application/queries/GetContinueReadingQuery";
import { GetCurrentReadingQuery } from "@/modules/library/application/queries/GetCurrentReadingQuery";
import { GetLibrarySnapshotQuery } from "@/modules/library/application/queries/GetLibrarySnapshotQuery";
import { DiscoveryFacade, DiscoveryOverviewPageDto } from "@/modules/discovery/application/facades/DiscoveryFacade";
import { GetUserStatisticsQuery, UserStatisticsDto } from "../queries/GetUserStatisticsQuery";

import { ContinueReadingDto } from "@/modules/library/application/queries/GetContinueReadingQuery/dto";
import { CurrentReadingDto } from "@/modules/library/application/queries/GetCurrentReadingQuery/dto";
import { LibrarySnapshotDto } from "@/modules/library/application/queries/GetLibrarySnapshotQuery/dto";

export interface MePageDto {
  user: AuthenticatedUser;
  continueReading: Promise<ContinueReadingDto | null>;
  currentReading: Promise<CurrentReadingDto | null>;
  librarySnapshot: Promise<LibrarySnapshotDto | null>;
  discovery: Promise<DiscoveryOverviewPageDto>;
  userStatistics: Promise<UserStatisticsDto | null>;
}

export class MePageFacade {
  constructor(
    private readonly identityProvider: IdentityProvider,
    private readonly getContinueReading: GetContinueReadingQuery,
    private readonly getCurrentReading: GetCurrentReadingQuery,
    private readonly getLibrarySnapshot: GetLibrarySnapshotQuery,
    private readonly discoveryFacade: DiscoveryFacade,
    private readonly getUserStatistics: GetUserStatisticsQuery,
  ) {}

  async get(): Promise<MePageDto> {
    const user = await this.identityProvider.currentUser();
    if (!user) throw new Error("Unauthorized");
    const userId = user.id;

    return {
      user,
      continueReading: this.getContinueReading.execute(userId),
      currentReading: this.getCurrentReading.execute(userId),
      librarySnapshot: this.getLibrarySnapshot.execute(userId),
      discovery: this.discoveryFacade.getOverview(),
      userStatistics: this.getUserStatistics.execute(userId),
    };
  }
}
