"use client";

import Link from "next/link";
import { DiscoverySearch } from "./DiscoverySearch";
import {
  Sparkles,
  BookOpen,
  Compass,
  TrendingUp,
  Atom,
  History,
  Brain,
  Palette,
  CheckCircle2,
  BookmarkCheck,
  Zap,
} from "lucide-react";

export function DiscoveryHero() {
  const trendingTags = [
    { label: "History", href: "/search?q=History", icon: History, color: "hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400" },
    { label: "Philosophy", href: "/search?q=Philosophy", icon: Brain, color: "hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400" },
    { label: "Science & Physics", href: "/search?q=Science", icon: Atom, color: "hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400" },
    { label: "Classic Literature", href: "/search?q=Literature", icon: BookOpen, color: "hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400" },
    { label: "Art & Poetry", href: "/search?q=Art", icon: Palette, color: "hover:border-pink-500 hover:text-pink-600 dark:hover:text-pink-400" },
    { label: "Psychology & Mind", href: "/search?q=Psychology", icon: Compass, color: "hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400" },
  ];

  return (
    <section className="relative w-full rounded-3xl sm:rounded-4xl bg-gradient-to-b from-indigo-50/60 via-white to-slate-50/40 dark:from-indigo-950/40 dark:via-slate-900/60 dark:to-slate-950/80 border border-indigo-100/80 dark:border-indigo-900/40 py-12 sm:py-16 md:py-20 px-6 sm:px-10 lg:px-14 flex flex-col items-center justify-center text-center overflow-hidden shadow-xl shadow-indigo-950/5 dark:shadow-black/40">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[600px] sm:w-[900px] h-[400px] bg-gradient-to-r from-indigo-500/20 via-purple-500/15 to-pink-500/15 dark:from-indigo-600/25 dark:via-purple-600/20 dark:to-pink-600/15 rounded-full blur-[120px] -translate-y-16" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-6xl w-full">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 dark:bg-indigo-950/80 border border-indigo-200/90 dark:border-indigo-800/80 text-xs sm:text-sm font-extrabold text-indigo-700 dark:text-indigo-300 mb-6 shadow-sm backdrop-blur-md">
          <Sparkles size={16} className="text-indigo-500 animate-pulse" />
          <span>Curated Digital Archive & Universal Library</span>
        </div>

        {/* Display Title */}
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-[1.08]">
          Find Something <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Worth Reading.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mb-10 leading-relaxed font-normal">
          Immerse yourself in timeless literature, scientific treatises, rare philosophical discourses, and curated public domain volumes.
        </p>

        {/* Search Input Hub */}
        <div className="w-full mb-10">
          <DiscoverySearch />
        </div>

        {/* Trending Categories Pills */}
        <div className="flex items-center justify-center gap-2.5 flex-wrap text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-[11px] mr-1.5">
            <TrendingUp size={14} className="text-indigo-500" />
            Trending:
          </span>
          {trendingTags.map((tag) => {
            const Icon = tag.icon;
            return (
              <Link
                key={tag.label}
                href={tag.href}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:shadow-md hover:-translate-y-0.5 transition-all text-xs sm:text-sm font-medium cursor-pointer shadow-xs ${tag.color}`}
              >
                <Icon size={14} className="text-slate-400 group-hover:text-indigo-500" />
                <span>{tag.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Feature Highlights Footer Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200/70 dark:border-slate-800/80 w-full flex items-center justify-center gap-6 sm:gap-12 flex-wrap text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
            <span>100% Free Public Domain</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-amber-500 shrink-0" />
            <span>Instant In-Browser Reader (PDF & EPUB)</span>
          </div>
          <div className="flex items-center gap-2">
            <BookmarkCheck size={16} className="text-indigo-500 shrink-0" />
            <span>Personal Curated Shelves</span>
          </div>
        </div>
      </div>
    </section>
  );
}
