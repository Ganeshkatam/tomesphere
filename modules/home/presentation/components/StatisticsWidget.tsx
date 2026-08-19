import { ReadingStatisticsDto } from "@/modules/progress/application/queries/GetReadingStatisticsQuery/dto";
import { BarChart3, CheckCircle, BookOpen, Clock } from "lucide-react";

interface StatisticsWidgetProps {
  promise: Promise<ReadingStatisticsDto | null>;
}

export async function StatisticsWidget({ promise }: StatisticsWidgetProps) {
  let result: ReadingStatisticsDto | null = null;
  try {
    result = await promise;
  } catch (e) {
    result = null;
  }

  const finished = result?.booksFinished ?? 0;
  const pages = result?.pagesRead ?? 0;
  const hours = result?.hoursRead ?? 0;

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <BarChart3 size={20} />
        </div>
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Reading Statistics
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Your all-time lifetime reading milestones
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-center">
          <div className="flex items-center justify-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
            <CheckCircle size={14} className="text-emerald-500" />
            <span>Finished</span>
          </div>
          <div className="text-2xl font-display font-extrabold text-slate-900 dark:text-white">
            {finished}
          </div>
          <span className="text-[11px] text-slate-400">books</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-center">
          <div className="flex items-center justify-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
            <BookOpen size={14} className="text-indigo-500" />
            <span>Pages</span>
          </div>
          <div className="text-2xl font-display font-extrabold text-slate-900 dark:text-white">
            {pages.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400">read</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-center">
          <div className="flex items-center justify-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
            <Clock size={14} className="text-purple-500" />
            <span>Time</span>
          </div>
          <div className="text-2xl font-display font-extrabold text-slate-900 dark:text-white">
            {hours}
          </div>
          <span className="text-[11px] text-slate-400">hours</span>
        </div>
      </div>
    </div>
  );
}

export function StatisticsSkeleton() {
  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-44 animate-pulse space-y-4">
      <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      <div className="grid grid-cols-3 gap-3">
        <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>
    </div>
  );
}
