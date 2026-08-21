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
    <section className="w-full pt-2 pb-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-5xl flex flex-col items-center gap-4">
        {/* Sleek Search Input Hub */}
        <div className="w-full">
          <DiscoverySearch />
        </div>

        {/* Trending Categories Pills */}
        <div className="flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-[11px] mr-1">
            <TrendingUp size={14} className="text-indigo-500" />
            Trending:
          </span>
          {trendingTags.map((tag) => {
            const Icon = tag.icon;
            return (
              <Link
                key={tag.label}
                href={tag.href}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:shadow-xs hover:-translate-y-0.5 transition-all text-xs font-medium cursor-pointer ${tag.color}`}
              >
                <Icon size={13} className="text-slate-400 group-hover:text-indigo-500" />
                <span>{tag.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
