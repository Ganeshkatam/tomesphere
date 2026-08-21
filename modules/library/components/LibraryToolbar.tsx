"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLibraryStore } from "../store/library-store";
import VoiceInput from "@/modules/discovery/search/presentation/components/VoiceInput";
import {
  BookOpen,
  Bookmark,
  CheckCircle2,
  LayoutGrid,
  List,
  ChevronDown,
  ArrowUpDown,
  Check,
} from "lucide-react";

export default function LibraryToolbar() {
  const {
    viewMode,
    setViewMode,
    activeViewId,
    setActiveView,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSort,
    sortDirection,
  } = useLibraryStore();

  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(e.target as Node)
      ) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filterTabs = [
    { id: "overview", label: "All Books", icon: LayoutGrid },
    { id: "status:reading", label: "Reading", icon: BookOpen },
    { id: "status:want_to_read", label: "Want to Read", icon: Bookmark },
    { id: "status:finished", label: "Finished", icon: CheckCircle2 },
  ];

  const sortOptions = [
    { value: "date_added", label: "Recently Added" },
    { value: "title", label: "Title (A–Z)" },
    { value: "author", label: "Author Name" },
    { value: "progress", label: "Reading Progress" },
  ];

  const currentSortLabel =
    sortOptions.find((o) => o.value === sortBy)?.label || "Recently Added";

  return (
    <div className="space-y-4 mb-6">
      {/* Top Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {filterTabs.map((tab) => {
          const isActive = activeViewId === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200/60 dark:border-slate-700/60"
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Controls Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 w-full max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your library..."
            className="w-full px-4 py-2.5 pr-10 bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-xs sm:text-sm font-medium transition-all"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
            <VoiceInput onTranscript={(text) => setSearchQuery(text)} />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          {/* Custom Styled Sort Dropdown */}
          <div ref={sortDropdownRef} className="relative inline-block text-left">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700/80 transition-all cursor-pointer shadow-2xs"
              aria-expanded={isSortOpen}
            >
              <ArrowUpDown size={14} className="text-slate-400" />
              <span>{currentSortLabel}</span>
              <ChevronDown
                size={14}
                className={`text-slate-400 transition-transform duration-200 ${
                  isSortOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isSortOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-900/10 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md">
                <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Sort By
                </p>
                {sortOptions.map((opt) => {
                  const isSelected = sortBy === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSort(opt.value as any, sortDirection);
                        setIsSortOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold"
                          : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && (
                        <Check size={14} className="text-indigo-600 dark:text-indigo-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs font-bold"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "list"
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs font-bold"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
              title="List View"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
