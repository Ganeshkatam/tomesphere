"use client";

import React from "react";
import { WeeklyActivityDayDto } from "../../application/dto/DashboardPageDto";
import { BarChart3, Sun, Sunset, Moon, Sunrise, Calendar } from "lucide-react";

interface DashboardVelocityChartProps {
  weeklyActivity: WeeklyActivityDayDto[];
  timeOfDayBreakdown: {
    morningPercent: number;
    afternoonPercent: number;
    eveningPercent: number;
    nightPercent: number;
  };
}

export default function DashboardVelocityChart({
  weeklyActivity,
  timeOfDayBreakdown,
}: DashboardVelocityChartProps) {
  const maxMinutes = Math.max(30, ...weeklyActivity.map((d) => d.minutes));

  // Determine top diurnal window for dynamic Primary Insight
  const diurnalWindows = [
    { label: "Morning (6am – 12pm)", percent: timeOfDayBreakdown.morningPercent },
    { label: "Afternoon (12pm – 5pm)", percent: timeOfDayBreakdown.afternoonPercent },
    { label: "Evening (5pm – 9pm)", percent: timeOfDayBreakdown.eveningPercent },
    { label: "Night (9pm – 6am)", percent: timeOfDayBreakdown.nightPercent },
  ];
  const sortedWindows = [...diurnalWindows].sort((a, b) => b.percent - a.percent);
  const topWindow = sortedWindows[0]?.percent > 0 ? sortedWindows[0] : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. 7-Day Velocity Chart */}
      <div className="lg:col-span-2 p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 size={18} className="text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-lg font-display font-extrabold text-slate-900 dark:text-white">
                  Reading Activity
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Daily minutes read over the past 7 days vs 30-minute daily goal
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-xs font-bold text-indigo-700 dark:text-indigo-300 self-start sm:self-auto">
              <Calendar size={12} />
              <span>Past 7 Days</span>
            </div>
          </div>

          {/* Bar Visualizer */}
          <div className="pt-4 pb-2">
            <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 px-2">
              {weeklyActivity.map((day, idx) => {
                const isTargetMet = day.minutes >= day.targetMinutes;
                const hasRead = day.minutes > 0;
                const heightPercent = hasRead
                  ? Math.min(100, Math.max(16, Math.round((day.minutes / maxMinutes) * 100)))
                  : 0;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-bold py-1 px-2.5 rounded-lg shadow-lg pointer-events-none mb-1 whitespace-nowrap z-10">
                      {hasRead ? `${day.minutes} mins (${day.pages} pgs)` : "No reading"}
                    </div>

                    {/* Bar container */}
                    <div className="w-full max-w-[42px] bg-slate-100 dark:bg-slate-800/60 rounded-xl overflow-hidden p-1 flex flex-col justify-end h-full">
                      {hasRead ? (
                        <div
                          className={`w-full rounded-lg transition-all duration-500 group-hover:brightness-110 ${
                            isTargetMet
                              ? "bg-gradient-to-t from-indigo-600 via-indigo-500 to-purple-500 shadow-sm shadow-indigo-500/20"
                              : "bg-gradient-to-t from-indigo-600 to-indigo-400"
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        />
                      ) : (
                        <div className="w-full h-1 rounded-full bg-slate-200/80 dark:bg-slate-700/60" />
                      )}
                    </div>

                    {/* Day label */}
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                        {day.day}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                        {day.minutes > 0 ? `${day.minutes}m` : "0m"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Goal Line Reference */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />
            <span>Target Achieved (30+ min)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-indigo-400 inline-block" />
            <span>Active Session</span>
          </div>
        </div>
      </div>

      {/* 2. Diurnal Reading Time Distribution */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-display font-extrabold text-slate-900 dark:text-white mb-1">
            Time of Day
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-6">
            When you read throughout the day
          </p>

          <div className="space-y-4">
            {/* Morning */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-1.5 text-amber-500">
                  <Sunrise size={14} />
                  <span>Morning (6am – 12pm)</span>
                </div>
                <span className="text-slate-700 dark:text-slate-300">{timeOfDayBreakdown.morningPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${timeOfDayBreakdown.morningPercent}%` }}
                />
              </div>
            </div>

            {/* Afternoon */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-1.5 text-cyan-500">
                  <Sun size={14} />
                  <span>Afternoon (12pm – 5pm)</span>
                </div>
                <span className="text-slate-700 dark:text-slate-300">{timeOfDayBreakdown.afternoonPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${timeOfDayBreakdown.afternoonPercent}%` }}
                />
              </div>
            </div>

            {/* Evening */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-1.5 text-indigo-500">
                  <Sunset size={14} />
                  <span>Evening (5pm – 9pm)</span>
                </div>
                <span className="text-slate-700 dark:text-slate-300">{timeOfDayBreakdown.eveningPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${timeOfDayBreakdown.eveningPercent}%` }}
                />
              </div>
            </div>

            {/* Night */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-1.5 text-purple-400">
                  <Moon size={14} />
                  <span>Night (9pm – 6am)</span>
                </div>
                <span className="text-slate-700 dark:text-slate-300">{timeOfDayBreakdown.nightPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-purple-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${timeOfDayBreakdown.nightPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
          <p className="font-semibold text-slate-800 dark:text-slate-200 mb-0.5">Reading Pattern</p>
          {topWindow ? (
            <span>
              You read most during <strong className="text-indigo-600 dark:text-indigo-400">{topWindow.label}</strong> ({topWindow.percent}% of reading time).
            </span>
          ) : (
            <span>
              Log your daily reading sessions to see your reading patterns throughout the day.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
