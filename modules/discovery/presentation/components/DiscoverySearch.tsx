"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, BookOpen, User, Tag } from "lucide-react";

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
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-2.5">
      {/* Search Input Container */}
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center w-full group shadow-md shadow-indigo-950/5 dark:shadow-black/40 rounded-2xl transition-all"
      >
        <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">
          <Search className="h-5 w-5" />
        </div>

        <input
          type="search"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search thousands of preserved books, authors, philosophies, subjects..."
          className="w-full bg-white dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm sm:text-base rounded-2xl py-3.5 pl-12 pr-28 sm:pr-32 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium"
        />

        <button
          type="submit"
          className="absolute right-2 px-4.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm shadow-indigo-600/25 transition-all cursor-pointer"
        >
          <span>Search</span>
          <ArrowRight size={14} />
        </button>
      </form>

      {/* Scope Selector Badges */}
      <div className="flex items-center gap-1.5 self-center sm:self-start sm:pl-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <span className="text-[11px] uppercase tracking-wider text-slate-400 mr-1 hidden sm:inline">Search in:</span>
        <button
          type="button"
          onClick={() => setFilterType("all")}
          className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer text-xs ${
            filterType === "all"
              ? "bg-indigo-600 text-white font-bold shadow-xs"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          Everything
        </button>
        <button
          type="button"
          onClick={() => setFilterType("books")}
          className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer text-xs ${
            filterType === "books"
              ? "bg-indigo-600 text-white font-bold shadow-xs"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          <BookOpen size={11} />
          <span>Books</span>
        </button>
        <button
          type="button"
          onClick={() => setFilterType("authors")}
          className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer text-xs ${
            filterType === "authors"
              ? "bg-indigo-600 text-white font-bold shadow-xs"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          <User size={11} />
          <span>Authors</span>
        </button>
        <button
          type="button"
          onClick={() => setFilterType("subjects")}
          className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer text-xs ${
            filterType === "subjects"
              ? "bg-indigo-600 text-white font-bold shadow-xs"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          <Tag size={11} />
          <span>Subjects</span>
        </button>
      </div>
    </div>
  );
}
