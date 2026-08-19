import { LibraryEntryDto } from "@/modules/library/application/dto/response/LibraryEntryDto";
import { GoalProgressDto } from "@/modules/progress/application/queries/GetReadingGoalQuery/dto";
import { ReadingStreakDto } from "@/modules/progress/application/queries/GetReadingStreakQuery/dto";
import { ReadingStatisticsDto } from "@/modules/progress/application/queries/GetReadingStatisticsQuery/dto";
import { ReadingCalendarDto } from "@/modules/progress/application/queries/GetReadingCalendarQuery/dto";
import { BookDto } from "@/modules/library/application/dto/response/BookDto";
import { RecentActivityDto } from "@/modules/me/account/application/queries/GetRecentActivityQuery/dto";

// Queries
import { GetContinueReadingQuery } from "@/modules/library/application/queries/GetContinueReadingQuery";
import { GetCurrentReadingQuery } from "@/modules/library/application/queries/GetCurrentReadingQuery";
import { GetLibrarySnapshotQuery } from "@/modules/library/application/queries/GetLibrarySnapshotQuery";
import { GetReadingGoalQuery } from "@/modules/progress/application/queries/GetReadingGoalQuery";
import { GetReadingStreakQuery } from "@/modules/progress/application/queries/GetReadingStreakQuery";
import { GetReadingStatisticsQuery } from "@/modules/progress/application/queries/GetReadingStatisticsQuery";
import { GetReadingCalendarQuery } from "@/modules/progress/application/queries/GetReadingCalendarQuery";
import { GetSuggestedReadsQuery } from "@/modules/discovery/application/queries/GetSuggestedReadsQuery";
import { GetRecentActivityQuery } from "@/modules/me/account/application/queries/GetRecentActivityQuery";
import { IdentityProvider } from "@/shared/application/ports/identity/IdentityProvider";
import { AuthenticatedUser } from "@/shared/application/dto/AuthenticatedUser";

import { ContinueReadingDto } from "@/modules/library/application/queries/GetContinueReadingQuery/dto";
import { CurrentReadingDto } from "@/modules/library/application/queries/GetCurrentReadingQuery/dto";
import { LibrarySnapshotDto } from "@/modules/library/application/queries/GetLibrarySnapshotQuery/dto";
import { SuggestedReadsDto } from "@/modules/discovery/application/queries/GetSuggestedReadsQuery/dto";

export interface HomePageDto {
  user: AuthenticatedUser;
  continueReading: Promise<ContinueReadingDto | null>;
  currentReading: Promise<CurrentReadingDto | null>;
  librarySnapshot: Promise<LibrarySnapshotDto | null>;
  readingGoal: Promise<GoalProgressDto | null>;
  readingStreak: Promise<ReadingStreakDto | null>;
  readingStats: Promise<ReadingStatisticsDto | null>;
  readingCalendar: Promise<ReadingCalendarDto | null>;
  suggestedReads: Promise<SuggestedReadsDto | null>;
  recentActivity: Promise<RecentActivityDto | null>;
}

export class HomePageFacade {
  constructor(
    private readonly identityProvider: IdentityProvider,
    private readonly getContinueReading: GetContinueReadingQuery,
    private readonly getCurrentReading: GetCurrentReadingQuery,
    private readonly getLibrarySnapshot: GetLibrarySnapshotQuery,
    private readonly getReadingGoal: GetReadingGoalQuery,
    private readonly getReadingStreak: GetReadingStreakQuery,
    private readonly getReadingStats: GetReadingStatisticsQuery,
    private readonly getReadingCalendar: GetReadingCalendarQuery,
    private readonly getSuggestedReads: GetSuggestedReadsQuery,
    private readonly getRecentActivity: GetRecentActivityQuery,
  ) {}

  async get(): Promise<HomePageDto> {
    const user = await this.identityProvider.currentUser();
    if (!user) throw new Error("Unauthorized");
    const userId = user.id;

    return {
      user,
      continueReading: this.getContinueReading.execute(userId),
      currentReading: this.getCurrentReading.execute(userId),
      librarySnapshot: this.getLibrarySnapshot.execute(userId),
      readingGoal: this.getReadingGoal.execute(userId),
      readingStreak: this.getReadingStreak.execute(userId),
      readingStats: this.getReadingStats.execute(userId),
      readingCalendar: this.getReadingCalendar.execute(userId),
      suggestedReads: this.getSuggestedReads.execute(userId),
      recentActivity: this.getRecentActivity.execute(userId),
    };
  }
}
