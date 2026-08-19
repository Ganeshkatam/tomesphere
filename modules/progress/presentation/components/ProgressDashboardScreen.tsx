"use client";

import React from "react";
import { Target, Flame, Trophy, Award, BarChart2 } from "lucide-react";
import { GetProgressDashboardOutput } from "../../application/queries/GetProgressDashboard/handler";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface ProgressDashboardScreenProps {
  progress: GetProgressDashboardOutput | null;
  dailyStats?: any[];
}

export default function ProgressDashboardScreen({
  progress,
  dailyStats = [],
}: ProgressDashboardScreenProps) {
  if (!progress) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-[var(--border-default)]">
        <span className="text-sm font-medium text-slate-400">
          No progress data available.
        </span>
      </div>
    );
  }

  const { level, streak, goals, recentAchievements } = progress;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-slate-50">My Progress</h2>
        <p className="text-sm text-slate-400 mt-1">
          Track reading accomplishments and goals.
        </p>
      </div>

      {/* Section 1: Goals & Streaks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Goals */}
        <div className="p-6 rounded-2xl bg-[var(--surface-default)] border border-[var(--border-default)] shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-slate-50">
              Active Targets
            </h3>
          </div>

          <div className="space-y-5">
            {/* Today's Goal Progress */}
            <div>
              <div className="flex justify-between text-sm font-bold text-slate-50">
                <span>Today&apos;s Reading</span>
                <span>
                  {goals.dailyMinutesProgress} / {goals.dailyMinutesTarget} min
                </span>
              </div>
              <div className="w-full bg-[var(--surface-raised)] rounded-full h-2 mt-2 overflow-hidden border border-[var(--border-subtle)]">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (goals.dailyMinutesProgress / Math.max(1, goals.dailyMinutesTarget)) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Annual Goal */}
            <div>
              <div className="flex justify-between text-sm font-bold text-slate-50">
                <span>Annual Book Goal</span>
                <span>
                  {goals.yearlyBooksProgress} / {goals.yearlyBooksTarget} Books
                </span>
              </div>
              <div className="w-full bg-[var(--surface-raised)] rounded-full h-2 mt-2 overflow-hidden border border-[var(--border-subtle)]">
                <div
                  className="bg-pink-500 h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (goals.yearlyBooksProgress / Math.max(1, goals.yearlyBooksTarget)) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Streak & Level Info Card */}
        <div className="p-6 rounded-2xl bg-[var(--surface-default)] border border-[var(--border-default)] shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500 fill-orange-500/10" />
            <h3 className="text-base font-bold text-slate-50">Progression</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-center">
              <Flame className="w-6 h-6 mx-auto text-orange-500 fill-orange-500/10 mb-1" />
              <div className="text-xl font-bold text-slate-50">
                {streak.currentDays} Days
              </div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                Current Streak
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-center">
              <Trophy className="w-6 h-6 mx-auto text-yellow-400 fill-yellow-400/10 mb-1" />
              <div className="text-xl font-bold text-slate-50">
                Level {level.number}
              </div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                {level.totalXp} XP • {level.title}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Recent Achievements */}
      <div className="p-6 rounded-2xl bg-[var(--surface-default)] border border-[var(--border-default)] shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-purple-400" />
          <h3 className="text-base font-bold text-slate-50">
            Recent Achievements
          </h3>
        </div>

        {recentAchievements.length === 0 ? (
          <div className="text-sm text-slate-400 text-center py-4">
            No achievements earned yet. Read more to unlock!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {recentAchievements.map((ach: any) => (
              <div
                key={ach.id}
                className="p-4 rounded-xl border border-indigo-500/35 bg-indigo-600/10 text-center transition-all"
              >
                <span className="text-3xl block mb-2"></span>
                <div className="text-xs font-bold text-slate-50 capitalize">
                  {ach.id.replace(/-/g, " ")}
                </div>
                <div className="text-[9px] text-slate-400 mt-1 font-semibold leading-snug">
                  {new Date(ach.unlockedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 3: History (Read Model) */}
      <div className="p-6 rounded-2xl bg-[var(--surface-default)] border border-[var(--border-default)] shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-slate-50">
            Reading Statistics
          </h3>
        </div>

        {dailyStats && dailyStats.length > 0 ? (
          <div className="h-64 w-full bg-[var(--surface-raised)] rounded-xl p-4 border border-[var(--border-subtle)]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyStats}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border-default)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke="var(--text-tertiary)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--text-tertiary)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--surface-default)",
                    border: "1px solid var(--border-default)",
                    borderRadius: "8px",
                    color: "var(--text-primary)",
                  }}
                  itemStyle={{ color: "#818cf8", fontSize: "12px" }}
                />
                <Bar
                  dataKey="pages_read"
                  name="Pages Read"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 text-xs font-medium">
            No reading history available.
          </div>
        )}
      </div>
    </div>
  );
}
