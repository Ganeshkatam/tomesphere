"use client";

import React from "react";
import { ReadingGoalDto } from "../../application/dto/DashboardPageDto";
import { Target, CheckCircle2, Award, Zap } from "lucide-react";

interface DashboardGoalsCardProps {
  goals: ReadingGoalDto[];
}

export default function DashboardGoalsCard({ goals }: DashboardGoalsCardProps) {
  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Target size={18} className="text-pink-500" />
          <h3 className="text-lg font-display font-extrabold text-slate-900 dark:text-white">
            Habit & Challenge Objectives
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-6">
          Quantifiable milestone progression towards personal reading benchmarks
        </p>

        <div className="space-y-5">
          {goals.map((g) => (
            <div key={g.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {g.label}
                  </h4>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {g.current} / {g.target} {g.unit}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                  {g.percentage}% Met
                </span>
              </div>

              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-pink-500 to-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, g.percentage)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
          <Zap size={14} />
          <span>94% Consistency Rating</span>
        </div>
        <span>Target Sync Active</span>
      </div>
    </div>
  );
}
