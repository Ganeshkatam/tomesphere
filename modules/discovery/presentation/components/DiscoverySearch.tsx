"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Sparkles } from "lucide-react";

export function DiscoverySearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-center w-full max-w-2xl group mx-auto shadow-xl shadow-indigo-950/5 dark:shadow-black/40 rounded-2xl transition-all"
    >
      <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">
        <Search className="h-5 w-5" />
      </div>

      <input
        type="search"
        name="q"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search titles, authors, philosophies, subjects..."
        className="w-full bg-white dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm sm:text-base rounded-2xl py-4 pl-12 pr-28 sm:pr-32 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-xs"
      />

      <button
        type="submit"
        className="absolute right-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
      >
        <span>Explore</span>
        <ArrowRight size={14} />
      </button>
    </form>
  );
}
