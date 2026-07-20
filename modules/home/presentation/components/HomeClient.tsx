import { Suspense } from "react";
import { HomePageDto } from "../../application/facades/HomePageFacade";

import { WelcomeWidget } from "./WelcomeWidget";
import { QuickActionsWidget } from "./QuickActionsWidget";
import {
  ContinueReadingWidget,
  ContinueReadingSkeleton,
} from "./ContinueReadingWidget";
import { GoalWidget, GoalSkeleton } from "./GoalWidget";
import { StreakWidget, StreakSkeleton } from "./StreakWidget";
import {
  CurrentReadingWidget,
  CurrentReadingSkeleton,
} from "./CurrentReadingWidget";
import { LibraryWidget, LibrarySkeleton } from "./LibraryWidget";
import {
  SuggestedReadsWidget,
  SuggestedReadsSkeleton,
} from "./SuggestedReadsWidget";
import { StatisticsWidget, StatisticsSkeleton } from "./StatisticsWidget";
import { ActivityWidget, ActivitySkeleton } from "./ActivityWidget";
import {
  ReadingCalendarWidget,
  ReadingCalendarSkeleton,
} from "./ReadingCalendarWidget";

export function HomeClient({ data }: { data: HomePageDto }) {
  return (
    <div className="min-h-screen bg-gradient-page w-full overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex flex-col gap-10">
        <WelcomeWidget user={data.user} />
        <QuickActionsWidget />

        <Suspense fallback={<ContinueReadingSkeleton />}>
          <ContinueReadingWidget promise={data.continueReading} />
        </Suspense>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Suspense fallback={<GoalSkeleton />}>
            <GoalWidget promise={data.readingGoal} />
          </Suspense>
          <Suspense fallback={<StreakSkeleton />}>
            <StreakWidget promise={data.readingStreak} />
          </Suspense>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Suspense fallback={<CurrentReadingSkeleton />}>
            <CurrentReadingWidget promise={data.currentReading} />
          </Suspense>
          <Suspense fallback={<LibrarySkeleton />}>
            <LibraryWidget promise={data.librarySnapshot} />
          </Suspense>
        </div>

        <Suspense fallback={<SuggestedReadsSkeleton />}>
          <SuggestedReadsWidget promise={data.suggestedReads} />
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Suspense fallback={<ReadingCalendarSkeleton />}>
              <ReadingCalendarWidget promise={data.readingCalendar} />
            </Suspense>
            <Suspense fallback={<StatisticsSkeleton />}>
              <StatisticsWidget promise={data.readingStats} />
            </Suspense>
          </div>
          <Suspense fallback={<ActivitySkeleton />}>
            <ActivityWidget promise={data.recentActivity} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
