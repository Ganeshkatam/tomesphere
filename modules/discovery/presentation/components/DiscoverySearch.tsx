"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Sparkles, SlidersHorizontal, BookOpen, User, Tag } from "lucide-react";

export function DiscoverySearch() {
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "books" | "authors" | "subjects">("all");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      let url = `/search?q=${encodeURIComponent(query.trim())}`;
      if (filterType !== "all") {
        url += `&type=${filterType}`;
      }
      router.push(url);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-3">
      {/* Search Input Container */}
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center w-full group shadow-2xl shadow-indigo-950/10 dark:shadow-black/60 rounded-3xl transition-all"
      >
        <div className="absolute inset-y-0 left-0 pl-5.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">
          <Search className="h-6 w-6" />
        </div>

        <input
          type="search"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search thousands of titles, renowned authors, subjects, or ideas..."
          className="w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-2 border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white text-base sm:text-lg md:text-xl rounded-3xl py-5 sm:py-5.5 pl-15 sm:pl-16 pr-36 sm:pr-44 focus:outline-none focus:ring-4 focus:ring-indigo-500/25 focus:border-indigo-600 dark:focus:border-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm font-medium"
        />

        <div className="absolute right-2.5 sm:right-3 flex items-center gap-2">
          <button
            type="submit"
            className="px-5 sm:px-7 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-95 text-white text-sm sm:text-base font-extrabold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <span>Search</span>
            <ArrowRight size={17} />
          </button>
        </div>
      </form>

      {/* Scope Selector Badges */}
      <div className="flex items-center gap-1.5 sm:gap-2 self-center sm:self-start sm:pl-4 text-xs font-bold text-slate-500 dark:text-slate-400">
        <span className="text-[11px] uppercase tracking-wider text-slate-400 mr-1 hidden sm:inline">Search in:</span>
        <button
          type="button"
          onClick={() => setFilterType("all")}
          className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
            filterType === "all"
              ? "bg-indigo-600 text-white shadow-sm font-extrabold"
              : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          Everything
        </button>
        <button
          type="button"
          onClick={() => setFilterType("books")}
          className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 cursor-pointer ${
            filterType === "books"
              ? "bg-indigo-600 text-white shadow-sm font-extrabold"
              : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          <BookOpen size={11} />
          <span>Books</span>
        </button>
        <button
          type="button"
          onClick={() => setFilterType("authors")}
          className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 cursor-pointer ${
            filterType === "authors"
              ? "bg-indigo-600 text-white shadow-sm font-extrabold"
              : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          <User size={11} />
          <span>Authors</span>
        </button>
        <button
          type="button"
          onClick={() => setFilterType("subjects")}
          className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 cursor-pointer ${
            filterType === "subjects"
              ? "bg-indigo-600 text-white shadow-sm font-extrabold"
              : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          <Tag size={11} />
          <span>Subjects</span>
        </button>
      </div>
    </div>
  );
}
