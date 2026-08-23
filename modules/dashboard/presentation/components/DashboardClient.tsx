"use client";

import { useState } from "react";
import Link from "next/link";
import { DashboardPageDto } from "../../application/dto/DashboardPageDto";
import DashboardMetrics from "./DashboardMetrics";
import DashboardVelocityChart from "./DashboardVelocityChart";
import DashboardActiveShelf from "./DashboardActiveShelf";
import DashboardGoalsCard from "./DashboardGoalsCard";
import DashboardMilestones from "./DashboardMilestones";
import DashboardTimeline from "./DashboardTimeline";
import { Compass, Bookmark, Sparkles, ArrowUpRight } from "lucide-react";

interface DashboardClientProps {
  data: DashboardPageDto;
}

export default function DashboardClient({ data }: DashboardClientProps) {
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "ytd" | "all">("7d");

  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[var(--surface-canvas)] py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
        {/* 1. Command Center Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 text-white shadow-xl border border-indigo-800/40 relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold text-indigo-200">
                <Sparkles size={12} className="text-amber-400" />
                <span>Reading Intelligence & Telemetry</span>
                <span className="text-indigo-400">•</span>
                <span>{todayFormatted}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold tracking-tight text-white">
                Reading Analytics Command Center
              </h1>
              <p className="text-xs sm:text-sm text-indigo-200/90 font-medium">
                High-precision reading velocity, volumetric habit progression, and archival scholarship telemetry for {data.user.name}.
              </p>
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/me/library"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold transition-all"
              >
                <Bookmark size={14} />
                <span>My Library</span>
              </Link>
              <Link
                href="/discover"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
              >
                <Compass size={14} />
                <span>Browse Archive</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* 2. Key Metrics Telemetry Grid */}
        <DashboardMetrics metrics={data.metrics} />

        {/* 3. 7-Day Velocity & Diurnal Rhythm Charts */}
        <DashboardVelocityChart
          weeklyActivity={data.weeklyActivity}
          timeOfDayBreakdown={data.timeOfDayBreakdown}
        />

        {/* 4. Active Reading Shelf */}
        <DashboardActiveShelf books={data.activeBooks} />

        {/* 5. Habits & Milestones Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardGoalsCard goals={data.goals} />
          <DashboardMilestones milestones={data.milestones} />
        </div>

        {/* 6. Session Audit Timeline Log */}
        <DashboardTimeline sessions={data.recentSessions} />
      </div>
    </div>
  );
}
