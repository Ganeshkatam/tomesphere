"use client";

import Link from "next/link";
import {
  Code,
  Activity,
  Calculator,
  Compass,
  UserCheck,
  Palette,
  ArrowRight,
  LucideIcon,
} from "lucide-react";

interface ThemeItem {
  title: string;
  subtitle: string;
  query: string;
  icon: LucideIcon;
  gradient: string;
  badgeColor: string;
  countLabel: string;
}

const THEMES: ThemeItem[] = [
  {
    title: "Computer Science & Security",
    subtitle: "Reverse engineering, web & mobile security, and programming foundations.",
    query: "Computer Science",
    icon: Code,
    gradient: "from-blue-500/10 to-indigo-500/5 hover:border-blue-400 dark:hover:border-blue-500/60",
    badgeColor: "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    countLabel: "Technical Volumes",
  },
  {
    title: "Health, Yoga & Wellness",
    subtitle: "Classic asanas, mindfulness exercises, and holistic physical conditioning.",
    query: "Health",
    icon: Activity,
    gradient: "from-emerald-500/10 to-teal-500/5 hover:border-emerald-400 dark:hover:border-emerald-500/60",
    badgeColor: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    countLabel: "Practical Guides",
  },
  {
    title: "Mathematics & Vedic Calculation",
    subtitle: "Speed arithmetic, speed calculation methods, and secondary mathematics.",
    query: "Mathematics",
    icon: Calculator,
    gradient: "from-amber-500/10 to-orange-500/5 hover:border-amber-400 dark:hover:border-amber-500/60",
    badgeColor: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    countLabel: "Exact Sciences",
  },
  {
    title: "Philosophy & Self-Mastery",
    subtitle: "Life philosophy, stoic wisdom, and transformative spiritual narratives.",
    query: "Philosophy",
    icon: Compass,
    gradient: "from-purple-500/10 to-pink-500/5 hover:border-purple-400 dark:hover:border-purple-500/60",
    badgeColor: "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    countLabel: "Humanities & Ethics",
  },
  {
    title: "Biographies & Memoirs",
    subtitle: "Inspirational accounts, visionary leadership, and historical reflections.",
    query: "Biography",
    icon: UserCheck,
    gradient: "from-cyan-500/10 to-blue-500/5 hover:border-cyan-400 dark:hover:border-cyan-500/60",
    badgeColor: "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
    countLabel: "Life Stories",
  },
  {
    title: "Art, Design & Invention",
    subtitle: "Figure drawing, architectural perspective, and creative design principles.",
    query: "Art",
    icon: Palette,
    gradient: "from-rose-500/10 to-amber-500/5 hover:border-rose-400 dark:hover:border-rose-500/60",
    badgeColor: "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
    countLabel: "Visual Arts",
  },
];

export function DiscoverThemeHub() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5">
      {THEMES.map((theme) => {
        const IconComponent = theme.icon;

        return (
          <Link
            key={theme.title}
            href={`/search?q=${encodeURIComponent(theme.query)}`}
            className="group block rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <div
              className={`h-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-gradient-to-br ${theme.gradient}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex items-center justify-center text-slate-800 dark:text-slate-200 group-hover:scale-105 transition-transform">
                    <IconComponent size={20} />
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${theme.badgeColor}`}
                  >
                    {theme.countLabel}
                  </span>
                </div>

                <h3 className="font-display font-extrabold text-base sm:text-lg text-slate-900 dark:text-white mb-1.5 transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  {theme.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-4">
                  {theme.subtitle}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                <span className="text-[11px]">Search discipline</span>
                <span className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                  <span>Browse</span>
                  <ArrowRight size={13} />
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
