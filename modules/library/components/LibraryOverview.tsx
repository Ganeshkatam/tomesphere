"use client";

import { LibrarySummaryDto } from "../application/dto/response/LibraryPageDto";
import { BookOpen, BookmarkCheck, FolderArchive, Layers } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface LibraryOverviewProps {
  summary: LibrarySummaryDto;
}

export default function LibraryOverview({ summary }: LibraryOverviewProps) {
  const cards = [
    {
      label: "Total Volumes",
      value: summary.totalBooks,
      icon: Layers,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-200/60 dark:border-indigo-800/50",
    },
    {
      label: "Currently Reading",
      value: summary.currentlyReading,
      icon: BookOpen,
      color: "text-cyan-600 dark:text-cyan-400",
      bg: "bg-cyan-50/80 dark:bg-cyan-950/40 border-cyan-200/60 dark:border-cyan-800/50",
    },
    {
      label: "Completed Works",
      value: summary.finished,
      icon: BookmarkCheck,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-800/50",
    },
    {
      label: "Custom Shelves",
      value: summary.totalCollections,
      icon: FolderArchive,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50/80 dark:bg-purple-950/40 border-purple-200/60 dark:border-purple-800/50",
    },
  ];

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight mb-1.5">
          My Library
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">
          Personal digital archive and curated reading shelves
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Card
              key={idx}
              className={`p-4 sm:p-5 rounded-2xl border ${card.bg} shadow-xs transition-all gap-0`}
            >
              <CardHeader className="p-0 flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-semibold text-slate-600 dark:text-slate-400 tracking-normal">
                  {card.label}
                </CardTitle>
                <Icon size={16} className={card.color} />
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white">
                  {card.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
