"use client";

import { useState } from "react";
import { SearchFacetDto } from "../../application/dto/SearchFacetDto";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X, Check } from "lucide-react";

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
    setIsOpen(false);
  };

  const hasActiveFilters = Array.from(searchParams.keys()).some((k) =>
    k.startsWith("facet."),
  );

  if (!facets || facets.length === 0) {
    return null; // Don't show the filter button at all if no filters
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
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
          hasActiveFilters 
            ? "bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800/60" 
            : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
        }`}
      >
        <Filter size={14} className={hasActiveFilters ? "text-indigo-600 dark:text-indigo-400" : ""} />
        <span>Filters</span>
        {hasActiveFilters && (
          <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 ml-0.5" />
        )}
      </button>

      {/* Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-[320px] h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-200 dark:border-slate-800">
            
            {/* Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-base">
                <Filter size={18} className="text-indigo-600 dark:text-indigo-400" />
                <span>Filters</span>
              </div>
              <div className="flex items-center gap-3">
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="text-xs font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Scrollable Facets */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-8">
              {facets.map((facet) => {
                if (!facet.values || facet.values.length === 0) return null;

                return (
                  <div key={facet.key} className="space-y-3">
                    <h4 className="font-extrabold text-xs tracking-wider uppercase text-slate-400 dark:text-slate-500">
                      {getFacetLabel(facet.key)}
                    </h4>

                    <div className="space-y-1.5 overflow-y-visible select-none">
                      {facet.values.map((val) => {
                        const isChecked = Boolean(val.selected);

                        return (
                          <label
                            key={val.value}
                            className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                              isChecked
                                ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 font-bold"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                              <div
                                className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                                  isChecked
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
                              className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                                isChecked
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
      )}
    </>
  );
}

export default SearchFacetSidebar;
