"use client";

import { useLibraryStore } from "../store/library-store";
import VoiceInput from "@/modules/discovery/search/presentation/components/VoiceInput";

export default function LibraryToolbar() {
  const {
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSort,
    sortDirection,
  } = useLibraryStore();

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
      {/* Search */}
      <div className="relative flex-1 w-full max-w-md">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search this view..."
          className="w-full px-4 py-2 pr-10 bg-white/5 border border-[var(--border-default)] rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 text-sm"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <VoiceInput onTranscript={(text) => setSearchQuery(text)} />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSort(e.target.value as any, sortDirection)}
          className="bg-white/5 border border-[var(--border-default)] rounded-lg px-3 py-2 text-sm text-slate-300 outline-none focus:border-primary/50"
        >
          <option value="date_added">Recently Added</option>
          <option value="title">Title (A-Z)</option>
          <option value="author">Author</option>
          <option value="progress">Reading Progress</option>
        </select>

        {/* View Mode */}
        <div className="flex bg-white/5 rounded-lg border border-[var(--border-default)] p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300"}`}
            title="Grid View"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300"}`}
            title="List View"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
