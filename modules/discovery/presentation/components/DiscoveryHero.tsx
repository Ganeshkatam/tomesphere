"use client";

import Link from "next/link";
import { DiscoverySearch } from "./DiscoverySearch";
import {
  BookOpen,
  Compass,
  TrendingUp,
  Atom,
  History,
  Brain,
  Palette,
  Sparkles,
} from "lucide-react";

export function DiscoveryHero() {
  const trendingTags = [
    { label: "History", href: "/search?q=History", icon: History, color: "hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400" },
    { label: "Philosophy", href: "/search?q=Philosophy", icon: Brain, color: "hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400" },
    { label: "Science & Physics", href: "/search?q=Science", icon: Atom, color: "hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400" },
    { label: "Classic Literature", href: "/search?q=Literature", icon: BookOpen, color: "hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400" },
    { label: "Art & Design", href: "/search?q=Art", icon: Palette, color: "hover:border-pink-500 hover:text-pink-600 dark:hover:text-pink-400" },
    { label: "Psychology & Mind", href: "/search?q=Psychology", icon: Compass, color: "hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400" },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 sm:p-10 lg:p-12 transition-all">
      {/* Subtle Ambient Background Gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-extrabold uppercase tracking-wider">
          <Sparkles size={13} className="text-indigo-500" />
          <span>The Digital Archive • Discovery Catalog</span>
        </div>

        {/* Hero Title & Description */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Explore Preserved Editions & Canonical Works
          </h1>
          <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 font-sans max-w-2xl mx-auto leading-relaxed">
            Instant access to verified public domain classics, foundational textbooks, and curated reading tracks with zero paywalls.
          </p>
        </div>

        {/* Integrated Search Input Hub */}
        <div className="w-full max-w-2xl pt-2">
          <DiscoverySearch />
        </div>

        {/* Trending Categories Pills */}
        <div className="flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 pt-1">
          <span className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-[11px] mr-1">
            <TrendingUp size={13} className="text-indigo-500" />
            Trending:
          </span>
          {trendingTags.map((tag) => {
            const Icon = tag.icon;
            return (
              <Link
                key={tag.label}
                href={tag.href}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:shadow-xs hover:-translate-y-0.5 transition-all text-xs font-medium cursor-pointer ${tag.color}`}
              >
                <Icon size={12} className="text-slate-400" />
                <span>{tag.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
