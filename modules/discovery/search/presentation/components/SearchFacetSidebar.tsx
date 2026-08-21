"use client";

import { SearchFacetDto } from "../../application/dto/SearchFacetDto";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X, Check } from "lucide-react";

interface SearchFacetSidebarProps {
  facets: SearchFacetDto[];
}

export function SearchFacetSidebar({ facets }: SearchFacetSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleToggle = (facetKey: string, value: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    const queryKey = `facet.${facetKey}`;

    // Get existing values
    const existing = params.getAll(queryKey);

    // Remove the key completely to reconstruct it
    params.delete(queryKey);

    const newValues = checked
      ? [...existing, value]
      : existing.filter((v) => v !== value);

    // Append back
    newValues.forEach((v) => params.append(queryKey, v));

    // Reset to page 1 on filter change
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
    return (
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-400">
        No additional filters found.
      </div>
    );
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
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-6">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-sm sm:text-base">
          <Filter size={16} className="text-indigo-600 dark:text-indigo-400" />
          <span>Filters</span>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <X size={12} />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Facet Groups */}
      <div className="space-y-6">
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
                          {isChecked && <Check size={11} strokeWidth={3} />}
                        </div>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={isChecked}
                          onChange={(e) =>
                            handleToggle(facet.key, val.value, e.target.checked)
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
  );
}

export default SearchFacetSidebar;
