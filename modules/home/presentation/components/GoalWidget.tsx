import { GoalProgressDto } from "@/modules/progress/application/queries/GetReadingGoalQuery/dto";
import { Target, Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";

interface GoalWidgetProps {
  promise: Promise<GoalProgressDto | null>;
}

export async function GoalWidget({ promise }: GoalWidgetProps) {
  let result: GoalProgressDto | null = null;
  try {
    result = await promise;
  } catch (e) {
    result = null;
  }

  const hasGoal = result?.hasGoal ?? false;
  const percentage = Math.min(Math.max(result?.percentage ?? 0, 0), 100);

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Target size={20} />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Daily Reading Goal
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {hasGoal
                ? `${result?.currentValue ?? 0} of ${result?.targetValue ?? 0} ${result?.type ?? "pages"}`
                : "No goal set"}
            </span>
          </div>
        </div>

        {percentage >= 100 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <Trophy size={13} />
            <span>Completed!</span>
          </div>
        )}
      </div>

      {hasGoal ? (
        <div className="space-y-3">
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
            <span>{percentage}% achieved today</span>
            <Link
              href="/me/account"
              className="text-indigo-600 dark:text-indigo-400 font-bold text-[10px] sm:text-xs hover:underline hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              Adjust Goal
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Set a daily target to build a consistent reading habit.
          </p>
          <Link
            href="/me/account"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex-shrink-0"
          >
            <span>Set Goal</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </div>
  );
}

export function GoalSkeleton() {
  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-36 animate-pulse flex flex-col justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
        </div>
      </div>
      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
    </div>
  );
}
