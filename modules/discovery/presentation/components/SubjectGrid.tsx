"use client";

import Link from "next/link";
import { BookOpen, Brain, Landmark, Atom, Compass, Feather, Scroll, Palette, HeartHandshake, Lightbulb, Telescope, Globe } from "lucide-react";

interface SubjectGridProps {
  items: readonly string[];
}

export function SubjectGrid({ items }: SubjectGridProps) {
  if (!items || items.length === 0) {
    return null;
  }

  const icons = [Brain, Atom, Landmark, Feather, Compass, Scroll, Palette, Telescope, Lightbulb, HeartHandshake, Globe, BookOpen];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 min-w-0">
      {items.map((subject, idx) => {
        const Icon = icons[idx % icons.length];
        return (
          <Link
            key={subject}
            href={`/search?q=${encodeURIComponent(subject)}`}
            className="group flex flex-col p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700/80 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-2xs">
              <Icon size={18} />
            </div>

            <span className="font-display font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
              {subject}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
              Explore subject
            </span>
          </Link>
        );
      })}
    </div>
  );
}
