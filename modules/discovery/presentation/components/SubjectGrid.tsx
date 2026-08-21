"use client";

import Link from "next/link";
import {
  BookOpen,
  Brain,
  Landmark,
  Atom,
  Compass,
  Feather,
  Scroll,
  Palette,
  HeartHandshake,
  Lightbulb,
  Telescope,
  Globe,
  ArrowUpRight,
} from "lucide-react";

interface SubjectGridProps {
  items: readonly string[];
}

interface DomainTheme {
  icon: typeof Brain;
  bg: string;
  text: string;
  borderHover: string;
  glow: string;
}

const DOMAIN_THEMES: DomainTheme[] = [
  {
    icon: Brain,
    bg: "bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400",
    text: "group-hover:text-purple-600 dark:group-hover:text-purple-400",
    borderHover: "hover:border-purple-300 dark:hover:border-purple-700/80",
    glow: "group-hover:shadow-purple-500/10",
  },
  {
    icon: Atom,
    bg: "bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400",
    text: "group-hover:text-cyan-600 dark:group-hover:text-cyan-400",
    borderHover: "hover:border-cyan-300 dark:hover:border-cyan-700/80",
    glow: "group-hover:shadow-cyan-500/10",
  },
  {
    icon: Landmark,
    bg: "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400",
    text: "group-hover:text-amber-600 dark:group-hover:text-amber-400",
    borderHover: "hover:border-amber-300 dark:hover:border-amber-700/80",
    glow: "group-hover:shadow-amber-500/10",
  },
  {
    icon: Feather,
    bg: "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400",
    text: "group-hover:text-rose-600 dark:group-hover:text-rose-400",
    borderHover: "hover:border-rose-300 dark:hover:border-rose-700/80",
    glow: "group-hover:shadow-rose-500/10",
  },
  {
    icon: Compass,
    bg: "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400",
    text: "group-hover:text-blue-600 dark:group-hover:text-blue-400",
    borderHover: "hover:border-blue-300 dark:hover:border-blue-700/80",
    glow: "group-hover:shadow-blue-500/10",
  },
  {
    icon: Scroll,
    bg: "bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400",
    text: "group-hover:text-orange-600 dark:group-hover:text-orange-400",
    borderHover: "hover:border-orange-300 dark:hover:border-orange-700/80",
    glow: "group-hover:shadow-orange-500/10",
  },
  {
    icon: Palette,
    bg: "bg-pink-50 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400",
    text: "group-hover:text-pink-600 dark:group-hover:text-pink-400",
    borderHover: "hover:border-pink-300 dark:hover:border-pink-700/80",
    glow: "group-hover:shadow-pink-500/10",
  },
  {
    icon: Telescope,
    bg: "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400",
    text: "group-hover:text-indigo-600 dark:group-hover:text-indigo-400",
    borderHover: "hover:border-indigo-300 dark:hover:border-indigo-700/80",
    glow: "group-hover:shadow-indigo-500/10",
  },
  {
    icon: Lightbulb,
    bg: "bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400",
    text: "group-hover:text-teal-600 dark:group-hover:text-teal-400",
    borderHover: "hover:border-teal-300 dark:hover:border-teal-700/80",
    glow: "group-hover:shadow-teal-500/10",
  },
  {
    icon: HeartHandshake,
    bg: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400",
    text: "group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
    borderHover: "hover:border-emerald-300 dark:hover:border-emerald-700/80",
    glow: "group-hover:shadow-emerald-500/10",
  },
  {
    icon: Globe,
    bg: "bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400",
    text: "group-hover:text-sky-600 dark:group-hover:text-sky-400",
    borderHover: "hover:border-sky-300 dark:hover:border-sky-700/80",
    glow: "group-hover:shadow-sky-500/10",
  },
  {
    icon: BookOpen,
    bg: "bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400",
    text: "group-hover:text-violet-600 dark:group-hover:text-violet-400",
    borderHover: "hover:border-violet-300 dark:hover:border-violet-700/80",
    glow: "group-hover:shadow-violet-500/10",
  },
];

export function SubjectGrid({ items }: SubjectGridProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4 min-w-0">
      {items.map((subject, idx) => {
        const theme = DOMAIN_THEMES[idx % DOMAIN_THEMES.length];
        const Icon = theme.icon;

        return (
          <Link
            key={subject}
            href={`/search?q=${encodeURIComponent(subject)}`}
            className={`group relative flex flex-col justify-between p-4 sm:p-4.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 ${theme.borderHover} hover:shadow-xl ${theme.glow} hover:-translate-y-1 transition-all duration-300 min-h-[120px] sm:min-h-[130px]`}
          >
            {/* Top row: Icon + Subtle Indicator Arrow */}
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-10 h-10 rounded-xl ${theme.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-2xs`}
              >
                <Icon size={18} />
              </div>

              <div className="w-6 h-6 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:text-slate-900 dark:group-hover:text-white transition-all duration-200">
                <ArrowUpRight size={13} />
              </div>
            </div>

            {/* Bottom: Readable Subject Title (No aggressive single-line clipping) */}
            <div>
              <h3
                className={`font-display font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white ${theme.text} transition-colors line-clamp-2 leading-snug`}
                title={subject}
              >
                {subject}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 font-semibold mt-1">
                Explore archive
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
