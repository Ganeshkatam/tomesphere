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
    <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 flex flex-col gap-6 sm:gap-8">
      {/* Top welcome & quick actions */}
      <WelcomeWidget user={data.user} />
      <QuickActionsWidget />

      {/* Hero active reading card */}
      <Suspense fallback={<ContinueReadingSkeleton />}>
        <ContinueReadingWidget promise={data.continueReading} />
      </Suspense>

      {/* Goals & Streaks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Suspense fallback={<GoalSkeleton />}>
          <GoalWidget promise={data.readingGoal} />
        </Suspense>
        <Suspense fallback={<StreakSkeleton />}>
          <StreakWidget promise={data.readingStreak} />
        </Suspense>
      </div>

      {/* Currently reading & library overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<CurrentReadingSkeleton />}>
          <CurrentReadingWidget promise={data.currentReading} />
        </Suspense>
        <Suspense fallback={<LibrarySkeleton />}>
          <LibraryWidget promise={data.librarySnapshot} />
        </Suspense>
      </div>

      {/* Recommended picks */}
      <Suspense fallback={<SuggestedReadsSkeleton />}>
        <SuggestedReadsWidget promise={data.suggestedReads} />
      </Suspense>

      {/* Analytics, Calendar & Activity */}
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
  );
}
