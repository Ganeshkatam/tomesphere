"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ActiveReadingBookDto } from "../../application/dto/DashboardPageDto";
import { BookOpen, Play, Clock, Bookmark, ChevronRight } from "lucide-react";
import DefaultBookCover from "@/modules/books/components/DefaultBookCover";

function formatRemainingTime(minutes: number): string {
  if (minutes <= 0) return "Completed";
  if (minutes < 60) return `~${minutes} mins remaining`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `~${hrs}h ${mins}m remaining` : `~${hrs}h remaining`;
}

interface DashboardActiveShelfProps {
  books: ActiveReadingBookDto[];
}

export default function DashboardActiveShelf({ books }: DashboardActiveShelfProps) {
  if (books.length === 0) {
    return (
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
          <BookOpen size={24} />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
          No Active Reading Volumes
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-5">
          Pick a title from the digital archive to begin tracking your reading velocity and bookmarks.
        </p>
        <Link
          href="/discover"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <span>Explore Archives</span>
          <ChevronRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg sm:text-xl font-display font-extrabold text-slate-900 dark:text-white">
            Active Volumetric Progress
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Volumes currently in progress across your reader workspaces
          </p>
        </div>
        <Link
          href="/me/library"
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
        >
          <span>All Volumes</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {books.map((b) => (
          <div
            key={b.bookId}
            className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-4 justify-between transition-all hover:border-slate-300 dark:hover:border-slate-700 group"
          >
            {/* Book Cover */}
            <div className="flex gap-4 min-w-0">
              <div className="relative w-16 sm:w-20 h-24 sm:h-28 shrink-0 rounded-xl overflow-hidden shadow-md border border-slate-200/60 dark:border-slate-800 group-hover:scale-105 transition-transform">
                {b.coverUrl ? (
                  <Image
                    src={b.coverUrl}
                    alt={b.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <DefaultBookCover title={b.title} authors={b.author} />
                )}
              </div>

              {/* Meta */}
              <div className="min-w-0 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                    {b.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                    by {b.author}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400">
                    <span>Page {b.currentPage} of {b.totalPages}</span>
                    <span className="text-indigo-600 dark:text-indigo-400">{b.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${b.percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                    <Clock size={10} />
                    <span>{formatRemainingTime(b.estMinutesRemaining)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Launch Action */}
            <div className="flex sm:flex-col justify-end sm:justify-center items-end sm:items-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800/80">
              <Link
                href={`/read/${b.bookId}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
              >
                <Play size={12} className="fill-white" />
                <span>Resume</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
