import React from "react";
import { Sparkles } from "lucide-react";

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <div className="relative overflow-hidden w-full rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm p-8 sm:p-12 lg:p-16 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Glowing Icon Container */}
      <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-100 dark:border-indigo-800/80 flex items-center justify-center mb-6 shadow-md shadow-indigo-500/10 text-indigo-600 dark:text-indigo-400 transition-transform duration-300 hover:scale-105">
        {icon || <Sparkles size={30} className="text-indigo-500" />}
      </div>

      {/* Title */}
      <h3 className="relative z-10 text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight mb-2.5">
        {title}
      </h3>

      {/* Description */}
      <p className="relative z-10 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mb-8 font-medium leading-relaxed">
        {description}
      </p>

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="relative z-10 flex items-center justify-center gap-3 flex-wrap">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}
