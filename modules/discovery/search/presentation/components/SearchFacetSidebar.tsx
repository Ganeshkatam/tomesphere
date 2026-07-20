"use client";

import { SearchFacetDto } from "../../application/dto/SearchFacetDto";
import { useRouter, useSearchParams } from "next/navigation";

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

  if (!facets || facets.length === 0) {
    return (
      <div className="text-sm text-slate-500 py-4">No filters available.</div>
    );
  }

  return (
    <div className="space-y-6">
      {facets.map((facet) => (
        <div key={facet.key} className="space-y-3">
          <h4 className="font-semibold text-sm tracking-tight">
            {facet.label}
          </h4>
          <div className="space-y-2">
            {facet.values.map((val) => (
              <div
                key={val.value}
                className="flex items-center justify-between group"
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`facet-${facet.key}-${val.value}`}
                    checked={val.selected}
                    onChange={(e: any) =>
                      handleToggle(facet.key, val.value, e.target.checked)
                    }
                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor={`facet-${facet.key}-${val.value}`}
                    className="text-sm font-normal cursor-pointer group-hover:text-primary transition-colors"
                  >
                    {val.label}
                  </label>
                </div>
                <span className="text-xs text-slate-400">{val.count}</span>
              </div>
            ))}
          </div>
          {/* Recursive rendering for children (like sub-genres) would go here */}
        </div>
      ))}
    </div>
  );
}
