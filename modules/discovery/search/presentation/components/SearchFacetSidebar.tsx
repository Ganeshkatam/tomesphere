"use client";

import React, { useState } from "react";
import { SearchFacetDto } from "../../application/dto/SearchFacetDto";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchFacetSidebarProps {
  facets: SearchFacetDto[];
}

export function SearchFacetSidebar({ facets }: SearchFacetSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (facetKey: string, value: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    const queryKey = `facet.${facetKey}`;

    const existing = params.getAll(queryKey);
    params.delete(queryKey);

    const newValues = checked
      ? [...existing, value]
      : existing.filter((v) => v !== value);

    newValues.forEach((v) => params.append(queryKey, v));
    params.set("page", "1");

    router.push(`/search?${params.toString()}`);
  };

  const handleClearAll = () => {
    const params = new URLSearchParams();
    const q = searchParams.get("q");
    if (q) params.set("q", q);
    router.push(`/search?${params.toString()}`);
  };

  const hasActiveFilters = Array.from(searchParams.keys()).some((k) =>
    k.startsWith("facet."),
  );

  if (!facets || facets.length === 0) {
    return null;
  }

  const getFacetLabel = (key: string) => {
    switch (key.toLowerCase()) {
      case "genres":
        return "Genres & Categories";
      case "subjects":
        return "Knowledge Domains";
      case "languages":
        return "Languages";
      case "publicationyears":
        return "Publication Years";
      default:
        return key.charAt(0).toUpperCase() + key.slice(1);
    }
  };

  return (
    <div className="w-full">
      {/* Filter Toggle Header */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Filter Results"
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-extrabold transition-all cursor-pointer h-auto ${hasActiveFilters
              ? "bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800/60 border-indigo-300 dark:border-indigo-700"
              : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs"
            }`}
        >
          <Filter size={16} className={hasActiveFilters ? "text-indigo-600 dark:text-indigo-400" : ""} />
          <span>Filter Results</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 ml-1" />
          )}
          <ChevronDown
            size={16}
            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""} ${hasActiveFilters ? "text-indigo-600 dark:text-indigo-400 ml-2" : "text-slate-400 ml-2"}`}
          />
        </Button>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer h-auto"
          >
            <X size={14} />
            <span>Clear Filters</span>
          </Button>
        )}
      </div>

      {/* Inline Expandable Filters Section */}
      <div
        className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0 mt-0"
          }`}
      >
        <div className="overflow-hidden">
          <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
              {facets.map((facet) => {
                if (!facet.values || facet.values.length === 0) return null;

                return (
                  <div key={facet.key} className="space-y-3">
                    <h4 className="font-extrabold text-xs tracking-wider uppercase text-slate-400 dark:text-slate-500">
                      {getFacetLabel(facet.key)}
                    </h4>

                    <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 select-none">
                      {facet.values.map((val) => {
                        const isChecked = Boolean(val.selected);

                        return (
                          <label
                            key={val.value}
                            className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all ${isChecked
                                ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 font-bold"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                              }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                              <div
                                className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${isChecked
                                    ? "bg-indigo-600 border-indigo-600 text-white"
                                    : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                                  }`}
                              >
                                {isChecked && (
                                  <Check size={11} strokeWidth={3} />
                                )}
                              </div>
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={isChecked}
                                onChange={(e) =>
                                  handleToggle(
                                    facet.key,
                                    val.value,
                                    e.target.checked,
                                  )
                                }
                              />
                              <span className="truncate">{val.label}</span>
                            </div>

                            <span
                              className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full shrink-0 ${isChecked
                                  ? "bg-indigo-200/60 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                                }`}
                            >
                              {val.count}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchFacetSidebar;
