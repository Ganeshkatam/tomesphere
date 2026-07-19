import { LibraryEntryDto } from "@/modules/library/application/dto/response/LibraryEntryDto";
import { GoalProgressDto } from "@/modules/progress/application/queries/GetReadingGoalQuery/dto";
import { ReadingStreakDto } from "@/modules/progress/application/queries/GetReadingStreakQuery/dto";
import { ReadingStatisticsDto } from "@/modules/progress/application/queries/GetReadingStatisticsQuery/dto";
import { ReadingCalendarDto } from "@/modules/progress/application/queries/GetReadingCalendarQuery/dto";
import { BookDto } from "@/modules/library/application/dto/response/BookDto";
import { RecentActivityDto } from "@/modules/me/application/queries/GetRecentActivityQuery/dto";

// Queries
import { GetContinueReadingQuery } from "@/modules/reading/library/application/queries/GetContinueReadingQuery";
import { GetCurrentReadingQuery } from "@/modules/reading/library/application/queries/GetCurrentReadingQuery";
import { GetLibrarySnapshotQuery } from "@/modules/reading/library/application/queries/GetLibrarySnapshotQuery";
import { GetReadingGoalQuery } from "@/modules/progress/application/queries/GetReadingGoalQuery";
import { GetReadingStreakQuery } from "@/modules/progress/application/queries/GetReadingStreakQuery";
import { GetReadingStatisticsQuery } from "@/modules/progress/application/queries/GetReadingStatisticsQuery";
import { GetReadingCalendarQuery } from "@/modules/progress/application/queries/GetReadingCalendarQuery";
import { GetSuggestedReadsQuery } from "@/modules/discovery/application/queries/GetSuggestedReadsQuery";
import { GetRecentActivityQuery } from "@/modules/me/application/queries/GetRecentActivityQuery";
import { IdentityProvider } from "@/modules/shared/application/ports/identity/IdentityProvider";
import { AuthenticatedUser } from "@/modules/shared/application/dto/AuthenticatedUser";

import { ContinueReadingDto } from "@/modules/reading/library/application/queries/GetContinueReadingQuery/dto";
import { CurrentReadingDto } from "@/modules/reading/library/application/queries/GetCurrentReadingQuery/dto";
import { LibrarySnapshotDto } from "@/modules/reading/library/application/queries/GetLibrarySnapshotQuery/dto";
import { SuggestedReadsDto } from "@/modules/discovery/application/queries/GetSuggestedReadsQuery/dto";

export interface HomePageDto {
  user: AuthenticatedUser;
  continueReading: ContinueReadingDto | null;
  currentReading: CurrentReadingDto | null;
  librarySnapshot: LibrarySnapshotDto | null;
  readingGoal: GoalProgressDto | null;
  readingStreak: ReadingStreakDto | null;
  readingStats: ReadingStatisticsDto | null;
  readingCalendar: ReadingCalendarDto | null;
  suggestedReads: SuggestedReadsDto | null;
  recentActivity: RecentActivityDto | null;
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
    private readonly getRecentActivity: GetRecentActivityQuery
  ) {}

  async get(): Promise<HomePageDto> {
    const user = await this.identityProvider.currentUser();
    if (!user) throw new Error("Unauthorized");
    const userId = user.id;

    const [
      continueReading,
      currentReading,
      librarySnapshot,
      readingGoal,
      readingStreak,
      readingStats,
      readingCalendar,
      suggestedReads,
      recentActivity,
    ] = await Promise.all([
      this.getContinueReading.execute(userId),
      this.getCurrentReading.execute(userId),
      this.getLibrarySnapshot.execute(userId),
      this.getReadingGoal.execute(userId),
      this.getReadingStreak.execute(userId),
      this.getReadingStats.execute(userId),
      this.getReadingCalendar.execute(userId),
      this.getSuggestedReads.execute(userId),
      this.getRecentActivity.execute(userId),
    ]);

    return {
      user,
      continueReading,
      currentReading,
      librarySnapshot,
      readingGoal,
      readingStreak,
      readingStats,
      readingCalendar,
      suggestedReads,
      recentActivity,
    };
  }
}
