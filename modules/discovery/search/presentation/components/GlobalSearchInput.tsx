"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, Book, User, Hash, Library } from "lucide-react";
import { Input } from "@/shared/ui/Input";
import { useRouter } from "next/navigation";
import { autocompleteAction } from "../actions/searchActions";
import { SearchSuggestionDto } from "../../application/dto/SearchSuggestionDto";
import Link from "next/link";
import { useDebounce } from "use-debounce";

export function GlobalSearchInput() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);
  const [suggestions, setSuggestions] = useState<SearchSuggestionDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchSuggestions() {
      if (debouncedQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await autocompleteAction(debouncedQuery);
        setSuggestions(results);
      } catch (e) {
        console.error("Autocomplete failed", e);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSuggestions();
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "Book":
        return <Book className="w-4 h-4" />;
      case "Author":
        return <User className="w-4 h-4" />;
      case "Genre":
        return <Hash className="w-4 h-4" />;
      case "Collection":
        return <Library className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative w-full max-w-md" ref={containerRef}>
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          type="search"
          placeholder="Search books, authors, genres..."
          value={query}
          onChange={(e: any) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-slate-400" />
        )}
      </form>

      {isOpen && query.trim().length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--surface-default)] rounded-xl shadow-xl border border-[var(--border-default)] overflow-hidden z-50">
          {suggestions.length > 0 ? (
            <div className="max-h-[60vh] overflow-y-auto">
              {suggestions.map((suggestion, idx) => (
                <Link
                  key={`${suggestion.url}-${idx}`}
                  href={suggestion.url}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-4 py-3 hover:bg-[var(--surface-raised)] transition-colors border-b border-[var(--border-subtle)] last:border-0"
                >
                  <div className="w-8 h-8 rounded-full bg-[var(--surface-raised)] flex items-center justify-center text-[var(--text-tertiary)] mr-3 shrink-0">
                    {getIcon(suggestion.type)}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {suggestion.title}
                    </span>
                    {suggestion.subtitle && (
                      <span className="text-xs text-[var(--text-tertiary)] truncate">
                        {suggestion.type} • {suggestion.subtitle}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            !isLoading && (
              <div className="p-4 text-center text-sm text-[var(--text-tertiary)]">
                No results found for &quot;{query}&quot;
              </div>
            )
          )}

          <div className="p-2 border-t border-[var(--border-default)] bg-[var(--surface-raised)]">
            <button
              onClick={handleSearch}
              className="w-full text-center text-sm text-indigo-600 dark:text-indigo-400 font-semibold hover:underline py-1 cursor-pointer"
            >
              See all results for &quot;{query}&quot;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
