"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ReadingGoalDto } from "../../application/dto/DashboardPageDto";
import { Target, CheckCircle2, Award, Zap, Plus, Edit2, Sparkles } from "lucide-react";
import ReadingGoalModal, { ReadingGoalEditData } from "./ReadingGoalModal";

interface DashboardGoalsCardProps {
  goals: ReadingGoalDto[];
}

export default function DashboardGoalsCard({ goals }: DashboardGoalsCardProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<ReadingGoalEditData | null>(null);

  const handleOpenCreate = () => {
    setEditingGoal(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (g: ReadingGoalDto) => {
    // Map DTO type to edit modal goalType
    let goalType: "books_per_year" | "books_per_month" | "pages_per_day" | "pages_per_week" | "custom" = "books_per_year";
    if (g.type === "daily_minutes" || (g as any).goal_type === "pages_per_day") {
      goalType = "pages_per_day";
    } else if (g.type === "annual_books" || (g as any).goal_type === "books_per_year") {
      goalType = "books_per_year";
    } else if ((g as any).goal_type === "books_per_month") {
      goalType = "books_per_month";
    } else if ((g as any).goal_type === "pages_per_week") {
      goalType = "pages_per_week";
    }

    setEditingGoal({
      id: g.id,
      goalType,
      targetValue: g.target,
    });
    setIsModalOpen(true);
  };

  const handleSaved = () => {
    router.refresh();
  };

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <Target size={18} className="text-pink-500" />
            <h3 className="text-lg font-display font-extrabold text-slate-900 dark:text-white">
              Reading Goals
            </h3>
          </div>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-pink-50 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-800/60 text-pink-700 dark:text-pink-300 font-bold text-xs hover:bg-pink-100 dark:hover:bg-pink-900/50 transition-colors cursor-pointer shadow-xs active:scale-95"
          >
            <Plus size={13} />
            <span>Set Goal</span>
          </button>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-6">
          Track your daily, weekly, and yearly reading targets
        </p>

        {goals.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-100 dark:bg-pink-950/80 text-pink-600 dark:text-pink-400 flex items-center justify-center mx-auto">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                No active reading goals
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Set an annual books target or daily reading quota to track your progress.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Plus size={13} />
              <span>Set Your Reading Goal</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((g) => (
              <div
                key={g.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 space-y-2 group relative"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {g.label}
                    </h4>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      {g.current} / {g.target} {g.unit}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                      {g.percentage}% Met
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(g)}
                      className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
                      title="Edit Goal"
                    >
                      <Edit2 size={13} />
                    </button>
                  </div>
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
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
          <Zap size={14} />
          <span>Active Challenge Tracker</span>
        </div>
      </div>

      {/* Reading Goal Creation & Modification Modal */}
      <ReadingGoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialGoal={editingGoal}
        onSaved={handleSaved}
      />
    </div>
  );
}
