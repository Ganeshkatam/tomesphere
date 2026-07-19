import { ReadingStatisticsDto } from "@/modules/progress/application/queries/GetReadingStatisticsQuery/dto";
import { BarChart3 } from "lucide-react";

interface StatisticsWidgetProps {
  result: ReadingStatisticsDto | null;
  currentStreakDays: number; // Passed from StreakWidget result if available
}

export function StatisticsWidget({ result, currentStreakDays }: StatisticsWidgetProps) {
  if (!result) {
    return (
      <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 h-full">
        <p className="font-semibold">Unable to load statistics.</p>
        <p className="text-sm opacity-80">{"Error"}</p>
      </div>
    );
  }

  const data = result || { booksFinished: 0, pagesRead: 0, hoursRead: 0 };

  return (
    <div className="flex flex-col p-6 rounded-3xl bg-[var(--surface-raised)] border border-[var(--border-default)] h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-slate-500/10 text-slate-400">
          <BarChart3 size={20} />
        </div>
        <h3 className="font-semibold text-[var(--text-primary)]">Reading Statistics</h3>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-[var(--surface-base)] border border-[var(--border-default)]">
          <p className="text-2xl font-display font-bold text-[var(--text-primary)]">{data.booksFinished}</p>
          <p className="text-xs text-[var(--text-secondary)] font-medium">Books Finished</p>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--surface-base)] border border-[var(--border-default)]">
          <p className="text-2xl font-display font-bold text-[var(--text-primary)]">{data.pagesRead}</p>
          <p className="text-xs text-[var(--text-secondary)] font-medium">Pages Read</p>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--surface-base)] border border-[var(--border-default)]">
          <p className="text-2xl font-display font-bold text-[var(--text-primary)]">{data.hoursRead}</p>
          <p className="text-xs text-[var(--text-secondary)] font-medium">Hours Read</p>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--surface-base)] border border-[var(--border-default)]">
          <p className="text-2xl font-display font-bold text-[var(--text-primary)]">{currentStreakDays}</p>
          <p className="text-xs text-[var(--text-secondary)] font-medium">Current Streak</p>
        </div>
      </div>
    </div>
  );
}
