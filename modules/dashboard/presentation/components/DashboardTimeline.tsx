"use client";

import React from "react";
import { ReadingSessionLogDto } from "../../application/dto/DashboardPageDto";
import { History, BookOpen, Clock } from "lucide-react";

interface DashboardTimelineProps {
  sessions: ReadingSessionLogDto[];
}

export default function DashboardTimeline({ sessions }: DashboardTimelineProps) {
  if (sessions.length === 0) return null;

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return "Recent";
    }
  };

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <History size={18} className="text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-lg font-display font-extrabold text-slate-900 dark:text-white">
          Session Audit & Historical Telemetry
        </h3>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-6">
        Verified audit record of recent digital immersion sessions
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold text-[10px]">
              <th className="pb-3 pr-4">Volume</th>
              <th className="pb-3 px-4">Session Duration</th>
              <th className="pb-3 px-4">Pages Read</th>
              <th className="pb-3 px-4">Terminal Page</th>
              <th className="pb-3 pl-4 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
            {sessions.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="py-3.5 pr-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen size={14} className="text-indigo-500 shrink-0" />
                  <span className="truncate max-w-[180px] sm:max-w-xs">{s.bookTitle}</span>
                </td>
                <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-[11px]">
                    <Clock size={10} />
                    <span>{s.durationMinutes} mins</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                  +{s.pagesRead} pages
                </td>
                <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                  Page {s.endPage}
                </td>
                <td className="py-3.5 pl-4 text-right text-slate-400 dark:text-slate-500 font-semibold">
                  {formatDate(s.timestamp)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
