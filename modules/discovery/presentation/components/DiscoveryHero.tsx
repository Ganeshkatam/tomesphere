"use client";

import Link from "next/link";
import { DiscoverySearch } from "./DiscoverySearch";
import { Sparkles, BookOpen, Compass, Flame, TrendingUp, Atom, History, Brain, Palette } from "lucide-react";

export function DiscoveryHero() {
  const trendingTags = [
    { label: "History", href: "/search?q=History", icon: History },
    { label: "Philosophy", href: "/search?q=Philosophy", icon: Brain },
    { label: "Science", href: "/search?q=Science", icon: Atom },
    { label: "Classic Literature", href: "/search?q=Literature", icon: BookOpen },
    { label: "Art & Drawing", href: "/search?q=Art", icon: Palette },
  ];

  return (
    <section className="relative w-full pt-10 pb-12 sm:pt-14 sm:pb-16 flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Dynamic Ambient Background Elements */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[500px] sm:w-[700px] h-[350px] bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-pink-500/10 dark:from-indigo-600/20 dark:via-purple-600/15 dark:to-pink-600/10 rounded-full blur-[100px] -translate-y-12" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-4xl px-4 w-full">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-6 shadow-2xs">
          <Sparkles size={14} className="text-indigo-500" />
          <span>Curated Digital Archive & Universal Library</span>
        </div>

        {/* Display Title */}
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight leading-[1.15]">
          Find Something <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Worth Reading.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-8 leading-relaxed font-medium">
          Immerse yourself in timeless literature, scientific treatises, rare philosophical discourses, and curated public domain volumes.
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-2xl mb-6">
          <DiscoverySearch />
        </div>

        {/* Trending Categories Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-[11px] mr-1">
            <TrendingUp size={13} className="text-indigo-500" />
            Trending:
          </span>
          {trendingTags.map((tag) => {
            const Icon = tag.icon;
            return (
              <Link
                key={tag.label}
                href={tag.href}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm transition-all text-xs font-medium cursor-pointer"
              >
                <Icon size={12} className="text-slate-400 group-hover:text-indigo-500" />
                <span>{tag.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
