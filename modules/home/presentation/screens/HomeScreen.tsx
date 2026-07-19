import { HomePageDto } from "../../application/facades/HomePageFacade";

// Widgets
import { WelcomeWidget } from "../components/WelcomeWidget";
import { QuickActionsWidget } from "../components/QuickActionsWidget";
import { ContinueReadingWidget } from "../components/ContinueReadingWidget";
import { GoalWidget } from "../components/GoalWidget";
import { StreakWidget } from "../components/StreakWidget";
import { CurrentReadingWidget } from "../components/CurrentReadingWidget";
import { LibraryWidget } from "../components/LibraryWidget";
import { SuggestedReadsWidget } from "../components/SuggestedReadsWidget";
import { StatisticsWidget } from "../components/StatisticsWidget";
import { ActivityWidget } from "../components/ActivityWidget";
import { ReadingCalendarWidget } from "../components/ReadingCalendarWidget";

export default function HomeScreen({ data }: { data: HomePageDto }) {
  const {
    user,
    continueReading: continueReadingResult,
    currentReading: currentReadingResult,
    librarySnapshot: librarySnapshotResult,
    readingGoal: readingGoalResult,
    readingStreak: readingStreakResult,
    readingStats: readingStatsResult,
    readingCalendar: readingCalendarResult,
    suggestedReads: suggestedReadsResult,
    recentActivity: recentActivityResult,
  } = data;

  return (
    <div className="min-h-screen bg-gradient-page w-full overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <WelcomeWidget user={user as any} />
        
        <QuickActionsWidget />
        
        <ContinueReadingWidget result={continueReadingResult} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <GoalWidget result={readingGoalResult} />
          <StreakWidget result={readingStreakResult} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <CurrentReadingWidget 
            result={currentReadingResult} 
            excludeBookId={true && continueReadingResult ? continueReadingResult.bookId : undefined} 
          />
          <LibraryWidget result={librarySnapshotResult} />
        </div>

        <SuggestedReadsWidget result={suggestedReadsResult} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <ReadingCalendarWidget result={readingCalendarResult} />
            <StatisticsWidget 
              result={readingStatsResult} 
              currentStreakDays={true && readingStreakResult ? readingStreakResult.currentStreakDays : 0} 
            />
          </div>
          <ActivityWidget result={recentActivityResult} />
        </div>
      </div>
    </div>
  );
}
