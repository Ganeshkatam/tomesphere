import { ReadingCalendarDto } from "@/modules/progress/application/queries/GetReadingCalendarQuery/dto";
import { Calendar, CheckCircle2 } from "lucide-react";

interface ReadingCalendarWidgetProps {
  promise: Promise<ReadingCalendarDto | null>;
}

export async function ReadingCalendarWidget({
  promise,
}: ReadingCalendarWidgetProps) {
  let result: ReadingCalendarDto | null = null;
  try {
    result = await promise;
  } catch (e) {
    result = null;
  }

  const days = result?.days || [];

  const getDayName = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } catch {
      return dateStr;
    }
  };

  const activeCount = days.filter((d) => d.active).length;

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Calendar size={20} />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              7-Day Activity
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {activeCount} of 7 days active this week
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
              day.active
                ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300/80 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 shadow-xs"
                : "bg-slate-50 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-800 text-slate-500 dark:text-slate-400"
            }`}
          >
            <span className="text-[11px] font-semibold">
              {getDayName(day.date)}
            </span>
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                day.active
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-200 dark:bg-slate-700 text-transparent"
              }`}
            >
              {day.active && <CheckCircle2 size={14} className="stroke-[3]" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReadingCalendarSkeleton() {
  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-40 animate-pulse space-y-4">
      <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="h-14 bg-slate-200 dark:bg-slate-800 rounded-2xl"
          />
        ))}
      </div>
    </div>
  );
}
