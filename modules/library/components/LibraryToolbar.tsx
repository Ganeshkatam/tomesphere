"use client";

import React from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

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
    <TooltipProvider delayDuration={300}>
      <div className="space-y-4 mb-6">
        {/* Top Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {filterTabs.map((tab) => {
            const isActive = activeViewId === tab.id;
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                type="button"
                variant={isActive ? "default" : "secondary"}
                onClick={() => setActiveView(tab.id)}
                aria-pressed={isActive}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 h-auto ${
                  isActive
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20"
                    : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200/60 dark:border-slate-700/60"
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Search & Controls Row */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 w-full max-w-md">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your library..."
              aria-label="Search your library"
              className="w-full px-4 py-2.5 pr-10 bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-xs sm:text-sm font-medium transition-all"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
              <VoiceInput onTranscript={(text) => setSearchQuery(text)} />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            {/* Radix Managed Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  aria-label={`Sort by: ${currentSortLabel}`}
                  className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700/80 transition-all cursor-pointer shadow-2xs h-auto"
                >
                  <ArrowUpDown size={14} className="text-slate-400" />
                  <span>{currentSortLabel}</span>
                  <ChevronDown size={14} className="text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl p-1.5 shadow-xl">
                <DropdownMenuLabel className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Sort By
                </DropdownMenuLabel>
                {sortOptions.map((opt) => {
                  const isSelected = sortBy === opt.value;
                  return (
                    <DropdownMenuItem
                      key={opt.value}
                      onClick={() => setSort(opt.value as any, sortDirection)}
                      className={`flex items-center justify-between px-3 py-2 text-xs sm:text-sm font-medium rounded-lg cursor-pointer ${
                        isSelected
                          ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold"
                          : "text-slate-700 dark:text-slate-200"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && (
                        <Check size={14} className="text-indigo-600 dark:text-indigo-400" />
                      )}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Mode Toggle */}
            <div className="flex bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 p-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    aria-label="Grid View"
                    aria-pressed={viewMode === "grid"}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer h-auto w-auto ${
                      viewMode === "grid"
                        ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs font-bold"
                        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    }`}
                  >
                    <LayoutGrid size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Grid View</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewMode("list")}
                    aria-label="List View"
                    aria-pressed={viewMode === "list"}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer h-auto w-auto ${
                      viewMode === "list"
                        ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs font-bold"
                        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    }`}
                  >
                    <List size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>List View</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
