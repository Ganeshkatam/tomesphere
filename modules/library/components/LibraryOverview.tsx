"use client";

import { LibrarySummaryDto } from "../application/dto/response/LibraryPageDto";

interface LibraryOverviewProps {
  summary: LibrarySummaryDto;
}

export default function LibraryOverview({ summary }: LibraryOverviewProps) {
  return (
    <div className="mb-8">
      <div className="mb-8 animate-fadeIn">
        <h1 className="text-4xl font-display font-bold mb-2">My Library</h1>
        <p className="text-lg text-slate-400">
          Overview of your reading journey
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-[var(--border-default)] p-4 rounded-xl">
          <div className="text-slate-400 text-sm mb-1">Total Books</div>
          <div className="text-3xl font-bold text-white">
            {summary.totalBooks}
          </div>
        </div>
        <div className="bg-white/5 border border-[var(--border-default)] p-4 rounded-xl">
          <div className="text-slate-400 text-sm mb-1">Currently Reading</div>
          <div className="text-3xl font-bold text-primary-light">
            {summary.currentlyReading}
          </div>
        </div>
        <div className="bg-white/5 border border-[var(--border-default)] p-4 rounded-xl">
          <div className="text-slate-400 text-sm mb-1">Finished</div>
          <div className="text-3xl font-bold text-green-400">
            {summary.finished}
          </div>
        </div>
        <div className="bg-white/5 border border-[var(--border-default)] p-4 rounded-xl">
          <div className="text-slate-400 text-sm mb-1">Collections</div>
          <div className="text-3xl font-bold text-purple-400">
            {summary.totalCollections}
          </div>
        </div>
      </div>
    </div>
  );
}
