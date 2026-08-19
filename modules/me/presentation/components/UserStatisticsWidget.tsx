"use client";

import React, { use } from "react";
import { BookOpen, BookCheck, Clock, Flame, Award } from "lucide-react";
import type { UserStatisticsDto } from "../../application/queries/GetUserStatisticsQuery";

interface UserStatisticsWidgetProps {
  promise: Promise<UserStatisticsDto | null>;
}

function formatReadingTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export default function UserStatisticsWidget({ promise }: UserStatisticsWidgetProps) {
  const stats = use(promise);

  if (!stats) return null;

  const statItems = [
    {
      label: "Reading Time",
      value: formatReadingTime(stats.minutesRead),
      icon: Clock,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Pages Read",
      value: stats.pagesRead.toLocaleString(),
      icon: BookOpen,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Books Finished",
      value: stats.booksCompleted.toLocaleString(),
      icon: BookCheck,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Current Streak",
      value: `${stats.currentStreak} Days`,
      icon: Flame,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      label: "Longest Streak",
      value: `${stats.longestStreak} Days`,
      icon: Award,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
  ];

  return (
    <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xl font-bold text-slate-100 mb-4 px-4 sm:px-6 lg:px-8">Your Reading Stats</h2>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statItems.map((item, index) => (
            <div
              key={item.label}
              className="bg-[#1C2127] rounded-xl p-4 border border-white/5 flex flex-col items-center justify-center text-center space-y-2 hover:bg-[#22272E] transition-colors"
            >
              <div className={`p-3 rounded-full ${item.bgColor}`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-100">{item.value}</div>
                <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
