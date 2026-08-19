"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

interface ViewAllCardProps {
  href: string;
  title: string;
  countLabel?: string;
  className?: string;
}

export default function ViewAllCard({
  href,
  title,
  countLabel = "Explore All",
  className = "",
}: ViewAllCardProps) {
  return (
    <Link
      href={href}
      className={`group relative rounded-2xl overflow-hidden border border-dashed border-indigo-500/40 hover:border-indigo-500 bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-slate-900/60 hover:from-indigo-900/50 hover:to-purple-900/40 p-5 flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 min-h-[320px] h-full ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 group-hover:bg-indigo-600 text-indigo-400 group-hover:text-white flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 shadow-lg shadow-indigo-500/20">
        <BookOpen size={26} />
      </div>

      <span className="text-xs font-semibold text-indigo-400 dark:text-indigo-300 uppercase tracking-wider mb-1">
        {countLabel}
      </span>

      <h3 className="text-base font-bold text-[var(--text-primary)] group-hover:text-indigo-400 transition-colors mb-2">
        {title}
      </h3>

      <p className="text-xs text-[var(--text-secondary)] mb-6 max-w-[160px]">
        Discover the full curated archive and read online.
      </p>

      <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[var(--surface-raised)] group-hover:bg-indigo-600 text-[var(--text-primary)] group-hover:text-white text-xs font-semibold border border-[var(--border-subtle)] group-hover:border-transparent transition-all">
        <span>Browse</span>
        <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
