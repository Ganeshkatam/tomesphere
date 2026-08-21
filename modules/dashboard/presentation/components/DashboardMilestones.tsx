"use client";

import React from "react";
import { MilestoneBadgeDto } from "../../application/dto/DashboardPageDto";
import { Award, BookOpen, Flame, Layers, Clock, Moon, Lock, CheckCircle } from "lucide-react";

interface DashboardMilestonesProps {
  milestones: MilestoneBadgeDto[];
}

export default function DashboardMilestones({ milestones }: DashboardMilestonesProps) {
  const getIcon = (iconName: string, unlocked: boolean) => {
    const props = { size: 18, className: unlocked ? "text-amber-500" : "text-slate-400 dark:text-slate-600" };
    switch (iconName) {
      case "Flame":
        return <Flame {...props} />;
      case "Layers":
        return <Layers {...props} />;
      case "Clock":
        return <Clock {...props} />;
      case "Moon":
        return <Moon {...props} />;
      case "BookOpen":
      default:
        return <BookOpen {...props} />;
    }
  };

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Award size={18} className="text-amber-500" />
          <h3 className="text-lg font-display font-extrabold text-slate-900 dark:text-white">
            Archival Honors & Accolades
          </h3>
        </div>
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
          {milestones.filter((m) => m.unlocked).length} / {milestones.length} Unlocked
        </span>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-6">
        Milestones unlocked through continuous scholarship and archival reading
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {milestones.map((m) => (
          <div
            key={m.id}
            className={`p-4 rounded-2xl border transition-all ${
              m.unlocked
                ? "bg-gradient-to-br from-amber-50/60 to-orange-50/30 dark:from-amber-950/20 dark:to-orange-950/10 border-amber-200/80 dark:border-amber-800/50 shadow-2xs"
                : "bg-slate-50/60 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800 opacity-60"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2.5 rounded-xl flex items-center justify-center shrink-0 ${
                  m.unlocked
                    ? "bg-amber-100 dark:bg-amber-900/60 shadow-2xs"
                    : "bg-slate-200 dark:bg-slate-800"
                }`}
              >
                {m.unlocked ? getIcon(m.icon, true) : <Lock size={16} className="text-slate-400" />}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {m.title}
                  </h4>
                  {m.unlocked && (
                    <CheckCircle size={12} className="text-emerald-500 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  {m.description}
                </p>
                {m.unlockedAt && (
                  <span className="inline-block mt-2 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                    Earned {m.unlockedAt}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
