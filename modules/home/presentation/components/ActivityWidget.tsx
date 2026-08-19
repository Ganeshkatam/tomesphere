import { RecentActivityDto } from "@/modules/account/application/queries/GetRecentActivityQuery/dto";
import {
  Activity,
  BookOpen,
  Bookmark,
  CheckCircle,
  PlusCircle,
  PlayCircle,
  Target,
} from "lucide-react";
import Link from "next/link";

interface ActivityWidgetProps {
  promise: Promise<RecentActivityDto | null>;
}

export async function ActivityWidget({ promise }: ActivityWidgetProps) {
  let result: RecentActivityDto | null = null;
  try {
    result = await promise;
  } catch (e) {
    result = null;
  }

  const events = result?.events || [];

  const getEventIcon = (type: string) => {
    switch (type) {
      case "STARTED":
        return <PlayCircle size={16} className="text-indigo-500" />;
      case "FINISHED":
        return <CheckCircle size={16} className="text-emerald-500" />;
      case "BOOKMARK_CREATED":
        return <Bookmark size={16} className="text-amber-500" />;
      case "ADDED_TO_LIBRARY":
        return <PlusCircle size={16} className="text-purple-500" />;
      case "GOAL_COMPLETED":
        return <Target size={16} className="text-orange-500" />;
      default:
        return <BookOpen size={16} className="text-indigo-500" />;
    }
  };

  const formatTimestamp = (ts: string) => {
    try {
      const date = new Date(ts);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Recent";
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-950/60 border border-pink-200/60 dark:border-pink-800/60 flex items-center justify-center text-pink-600 dark:text-pink-400">
            <Activity size={20} />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Recent Activity
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Your reading timeline
            </span>
          </div>
        </div>

        {events.length > 0 ? (
          <div className="space-y-3">
            {events.slice(0, 5).map((evt) => (
              <div
                key={evt.id}
                className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60"
              >
                <div className="mt-0.5 flex-shrink-0">
                  {getEventIcon(evt.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200 line-clamp-2">
                    {evt.description}
                  </p>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">
                    {formatTimestamp(evt.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No recent activity recorded yet.
            </p>
          </div>
        )}
      </div>

      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 text-center">
        <Link
          href="/account"
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          View Account History
        </Link>
      </div>
    </div>
  );
}

export function ActivitySkeleton() {
  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-80 animate-pulse space-y-4">
      <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
    </div>
  );
}
