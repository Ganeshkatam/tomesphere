"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface PlaceholderScreenProps {
  title: string;
  description?: string;
  icon: LucideIcon;
}

export function PlaceholderScreen({
  title,
  description = "This feature is under active development and is not available in the current release.",
  icon: Icon,
}: PlaceholderScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in duration-300">
      <div className="w-20 h-20 mb-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
        <Icon size={40} strokeWidth={1.5} />
      </div>
      <h2 className="text-2xl font-bold text-slate-50 mb-3">{title}</h2>

      <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-[var(--surface-raised)] border border-[var(--border-subtle)]">
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
          Coming Soon
        </span>
      </div>

      <p className="text-slate-400 max-w-sm mx-auto leading-relaxed text-sm font-medium">
        {description}
      </p>
    </div>
  );
}
