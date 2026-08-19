import { ReadingStreakDto } from "@/modules/progress/application/queries/GetReadingStreakQuery/dto";
import { Flame, Sparkles } from "lucide-react";

interface StreakWidgetProps {
  promise: Promise<ReadingStreakDto | null>;
}

export async function StreakWidget({ promise }: StreakWidgetProps) {
  let result: ReadingStreakDto | null = null;
  try {
    result = await promise;
  } catch (e) {
    result = null;
  }

  const streak = result?.currentStreakDays ?? 0;
  const longest = result?.longestStreakDays ?? 0;

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/60 border border-orange-200/60 dark:border-orange-800/60 flex items-center justify-center text-orange-600 dark:text-orange-400">
            <Flame size={20} className={streak > 0 ? "animate-pulse" : ""} />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Reading Streak
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Keep the flame burning
            </span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-display font-extrabold text-orange-600 dark:text-orange-400">
            {streak} {streak === 1 ? "day" : "days"}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <Sparkles size={13} className="text-amber-500" />
          <span>Longest streak: <strong className="text-slate-900 dark:text-white font-bold">{longest} days</strong></span>
        </div>
        <span className="text-slate-500 dark:text-slate-400">
          {streak > 0 ? "Great momentum!" : "Read today to start!"}
        </span>
      </div>
    </div>
  );
}

export function StreakSkeleton() {
  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-36 animate-pulse flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24" />
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-16" />
          </div>
        </div>
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-12" />
      </div>
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
    </div>
  );
}
