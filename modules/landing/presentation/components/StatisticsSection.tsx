import React from "react";
import { BookOpen, Users, Compass, BookMarked } from "lucide-react";
import { PlatformStatisticsDto } from "@/modules/statistics/application/queries/GetPlatformStatistics/read-model";

interface StatisticsSectionProps {
  statistics?: PlatformStatisticsDto;
}

export default function StatisticsSection({
  statistics,
}: StatisticsSectionProps) {
  if (!statistics) return null;

  const stats = [
    {
      icon: <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      value: (statistics.booksCount || 0).toLocaleString() + "+",
      label: "Books & Treatises",
      subtext: "Freely accessible world literature",
    },
    {
      icon: <Users className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
      value: (statistics.authorsCount || 0).toLocaleString() + "+",
      label: "Scholars & Authors",
      subtext: "From antiquity to modern thinkers",
    },
    {
      icon: <Compass className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      value: (statistics.genresCount || 0).toLocaleString() + "+",
      label: "Literary Disciplines",
      subtext: "Fiction, science, philosophy, history",
    },
    {
      icon: <BookMarked className="w-6 h-6 text-sky-600 dark:text-cyan-400" />,
      value: "100%",
      label: "Open Sanctuary",
      subtext: "Free reading with persistent notes",
    },
  ];

  return (
    <section className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 w-full py-8">
      <div className="rounded-3xl p-8 sm:p-10 lg:p-12 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`flex flex-col items-center sm:items-start text-center sm:text-left ${
              idx !== 0 ? "lg:border-l lg:border-slate-200 dark:lg:border-slate-800 lg:pl-8" : ""
            }`}
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-4 shadow-xs">
              {stat.icon}
            </div>
            <p className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
              {stat.value}
            </p>
            <p className="text-base font-bold text-slate-800 dark:text-slate-200">
              {stat.label}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {stat.subtext}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
