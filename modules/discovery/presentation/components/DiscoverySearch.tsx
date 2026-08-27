"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, BookOpen, User, Tag, Layers, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DiscoverySearch() {
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "books" | "authors" | "subjects">("all");
  const router = useRouter();

  const filterLabels: Record<string, { label: string; icon: LucideIcon }> = {
    all: { label: "All Archives", icon: Layers },
    books: { label: "Books", icon: BookOpen },
    authors: { label: "Authors", icon: User },
    subjects: { label: "Subjects", icon: Tag },
  };

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
    <div className="w-full max-w-3xl mx-auto">
      {/* 1. Scope Tabs above search */}
      <div className="flex items-center justify-center gap-1.5 mb-2.5 flex-wrap">
        {(["all", "books", "authors", "subjects"] as const).map((type) => {
          const isActive = filterType === type;
          const Icon = filterLabels[type].icon;

          return (
            <Button
              key={type}
              type="button"
              variant={isActive ? "default" : "secondary"}
              size="sm"
              onClick={() => setFilterType(type)}
              aria-pressed={isActive}
              className={`h-8 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/20"
                  : "bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700/80"
              }`}
            >
              <Icon size={12} className={isActive ? "text-white" : "text-slate-400"} />
              <span>{filterLabels[type].label}</span>
            </Button>
          );
        })}
      </div>

      {/* 2. Elevated Search Input */}
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-700/90 hover:border-indigo-500/80 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/20 shadow-xl rounded-2xl transition-all duration-200 p-1.5"
      >
        <div className="pl-3 pr-2 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
          <Search className="h-5 w-5" />
        </div>

        <Input
          type="search"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search digital archives"
          placeholder="Search thousands of preserved books, authors, philosophies, subjects..."
          className="w-full border-0 bg-transparent text-slate-900 dark:text-white text-sm sm:text-base px-2 py-2 shadow-none focus-visible:ring-0 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium h-auto"
        />

        <Button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs sm:text-sm font-extrabold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all cursor-pointer shrink-0 h-auto"
        >
          <span>Search</span>
          <ArrowRight size={14} />
        </Button>
      </form>
    </div>
  );
}
