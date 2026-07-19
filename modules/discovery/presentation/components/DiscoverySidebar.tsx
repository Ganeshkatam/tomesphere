"use client";

import dynamic from "next/dynamic";
import { BookOpen, Clock, FileText, Trophy } from "lucide-react";

const ReadingGoalProgress = dynamic(
  () => import("@/modules/progress/analytics/components/ReadingGoalProgress"),
  {
    loading: () => <div className="h-32 bg-white/5 animate-pulse rounded-xl" />,
  },
);
const RecentlyViewed = dynamic(
  () => import("@/modules/books/components/RecentlyViewed"),
  {
    loading: () => <div className="h-32 bg-white/5 animate-pulse rounded-xl" />,
  },
);

interface TodayStats {
  reading_time_minutes: number;
  pages_read: number;
  books_completed: number;
}

interface HomeSidebarProps {
  userStats: {
    totalLikes: number;
    favoriteGenre: string;
    todayStats: TodayStats | null;
  };
}

export default function HomeSidebar({ userStats }: HomeSidebarProps) {
  const today = userStats.todayStats;

  return (
    <aside className="space-y-6 w-full lg:w-80 flex-shrink-0">
      <ReadingGoalProgress />
      <RecentlyViewed />

      {/* Today's Progress */}
      <div className="bg-slate-900/50 rounded-xl p-6 border border-white/5">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <Trophy className="text-amber-400" size={18} />
          Today&apos;s Progress
        </h3>
        {today &&
        (today.pages_read > 0 ||
          today.reading_time_minutes > 0 ||
          today.books_completed > 0) ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div className="flex items-center gap-2">
                <FileText className="text-indigo-400" size={16} />
                <span className="text-slate-400 text-sm">Pages Read</span>
              </div>
              <span className="font-bold text-white">{today.pages_read}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div className="flex items-center gap-2">
                <Clock className="text-emerald-400" size={16} />
                <span className="text-slate-400 text-sm">Reading Time</span>
              </div>
              <span className="font-bold text-white">
                {today.reading_time_minutes} min
              </span>
            </div>
            {today.books_completed > 0 && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                <div className="flex items-center gap-2">
                  <BookOpen className="text-amber-400" size={16} />
                  <span className="text-amber-300 text-sm">Books Finished</span>
                </div>
                <span className="font-bold text-amber-300">
                  {today.books_completed}
                </span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-slate-500 text-sm text-center py-4">
            No reading activity yet today. Open a book to start!
          </p>
        )}
      </div>

      {/* Quick Stats */}
      <div className="bg-slate-900/50 rounded-xl p-6 border border-white/5">
        <h3 className="font-bold text-white mb-4">Quick Stats</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Total Likes</span>
            <span className="font-bold text-indigo-400">
              {userStats?.totalLikes || 0}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Favorite Genre</span>
            <span className="font-bold text-purple-400">
              {userStats?.favoriteGenre || "None"}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
