"use client";

import React from "react";
import { DashboardMetricsDto } from "../../application/dto/DashboardPageDto";
import { Clock, BookOpen, Flame, CheckCircle2, TrendingUp } from "lucide-react";

interface DashboardMetricsProps {
  metrics: DashboardMetricsDto;
}

export default function DashboardMetrics({ metrics }: DashboardMetricsProps) {
  const cards = [
    {
      label: "Reading Time",
      value: metrics.formattedTotalTime,
      subtext: `${metrics.totalMinutes} total minutes`,
      icon: Clock,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-200/60 dark:border-indigo-800/40",
      trendLabel: "Weekly Trend",
      trend: "+18% this week",
    },
    {
      label: "Pages Read",
      value: metrics.totalPages.toLocaleString(),
      subtext: `~${metrics.readingSpeedPPH} pages/hour pace`,
      icon: BookOpen,
      color: "text-cyan-600 dark:text-cyan-400",
      bg: "bg-cyan-50/70 dark:bg-cyan-950/30 border-cyan-200/60 dark:border-cyan-800/40",
      trendLabel: "Reading Pace",
      trend: "+24% pace",
    },
    {
      label: "Current Streak",
      value: `${metrics.currentStreak} ${metrics.currentStreak === 1 ? "Day" : "Days"}`,
      subtext: `Personal best: ${metrics.longestStreak} ${metrics.longestStreak === 1 ? "day" : "days"}`,
      icon: Flame,
      color: "text-amber-500 dark:text-amber-400",
      bg: "bg-amber-50/70 dark:bg-amber-950/30 border-amber-200/60 dark:border-amber-800/40",
      trendLabel: "Streak Status",
      trend: "Active Streak",
    },
    {
      label: "Books Completed",
      value: `${metrics.completionRate}%`,
      subtext: `${metrics.booksCompleted} completed of ${metrics.booksStarted} started`,
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-800/40",
      trendLabel: "Completion Rate",
      trend: metrics.completionRate > 50 ? "High Retention" : "In Progress",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-5 rounded-2xl border ${card.bg} shadow-2xs backdrop-blur-xs flex flex-col justify-between transition-all hover:shadow-md hover:-translate-y-0.5 duration-200`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {card.label}
              </span>
              <div className={`p-2 rounded-xl bg-white/80 dark:bg-slate-900/60 shadow-2xs ${card.color}`}>
                <Icon size={18} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
                {card.value}
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {card.subtext}
              </p>
            </div>

            <div className="mt-3.5 pt-3 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between text-[11px] font-bold">
              <span className="text-slate-400 dark:text-slate-500">{card.trendLabel}</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <TrendingUp size={12} />
                {card.trend}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
