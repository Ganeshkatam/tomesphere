"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Loader2, Book, ArrowRight } from "lucide-react";
import { autocompleteAction } from "../actions/searchActions";
import Link from "next/link";

interface SearchBarProps {
  initialQuery?: string;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  size?: "sm" | "md" | "lg";
}

export function SearchBar({
  initialQuery = "",
  placeholder = "Search digital archives, books, authors...",
  className = "",
  autoFocus = false,
  size = "md",
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync with URL query parameter
  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) {
      setQuery(q);
    }
  }, [searchParams]);

  // Global hotkey: '/' or 'Cmd+K' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "/" || (e.key === "k" && (e.metaKey || e.ctrlKey))) &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Debounced autocomplete fetcher
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    let isCancelled = false;
    setIsLoading(true);

    const timer = setTimeout(async () => {
      try {
        const results = await autocompleteAction(query.trim());
        if (!isCancelled) {
          setSuggestions(results || []);
          setIsOpen(true);
        }
      } catch (err) {
        console.error("Autocomplete error:", err);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }, 220);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  // Handle outside click to close suggestions
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

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1,
      );
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        e.preventDefault();
        const item = suggestions[highlightedIndex];
        setIsOpen(false);
        router.push(item.url || `/search?q=${encodeURIComponent(item.title)}`);
      } else {
        handleSubmit();
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs rounded-xl",
    md: "px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm rounded-2xl",
    lg: "px-4 sm:px-5 py-3 sm:py-3.5 text-sm sm:text-base rounded-2xl",
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative w-full">
        <div
          className={`w-full relative flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 shadow-xs ${sizeClasses[size]}`}
        >
          {isLoading ? (
            <Loader2
              size={size === "lg" ? 20 : 16}
              className="text-indigo-500 animate-spin mr-2.5 shrink-0"
            />
          ) : (
            <Search
              size={size === "lg" ? 20 : 16}
              className="text-slate-400 mr-2.5 shrink-0"
            />
          )}

          <input
            ref={inputRef}
            type="text"
            value={query}
            autoFocus={autoFocus}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlightedIndex(-1);
            }}
            onFocus={() => {
              if (suggestions.length > 0) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="bg-transparent border-0 border-none outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ring-0 w-full font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-none appearance-none p-0"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSuggestions([]);
                setIsOpen(false);
                inputRef.current?.focus();
              }}
              aria-label="Clear search input"
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors mr-1 cursor-pointer"
            >
              <X size={14} />
            </button>
          )}

          <button
            type="submit"
            aria-label="Submit search"
            className="p-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
          >
            <ArrowRight size={13} />
          </button>
        </div>
      </form>

      {/* Autocomplete Suggestions Popup */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in duration-150 p-1.5 text-xs">
          <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
            <span>Catalogue Suggestions</span>
            <span>Jump to volume</span>
          </div>

          <div className="space-y-0.5">
            {suggestions.map((item, index) => {
              const isHighlighted = index === highlightedIndex;

              return (
                <Link
                  key={`${item.title}-${index}`}
                  href={item.url || `/search?q=${encodeURIComponent(item.title)}`}
                  onClick={() => setIsOpen(false)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
                    isHighlighted
                      ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-950 dark:text-indigo-200"
                      : "text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <Book size={13} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-xs truncate leading-snug">
                        {item.title}
                      </p>
                      {item.subtitle && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          by {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <ArrowRight
                    size={13}
                    className="text-slate-400 dark:text-slate-600 shrink-0"
                  />
                </Link>
              );
            })}
          </div>

          <div className="mt-1 pt-1.5 border-t border-slate-100 dark:border-slate-800 px-3 py-1 flex items-center justify-between text-[11px] text-slate-400">
            <span>Press Enter to search all results</span>
            <button
              type="button"
              onClick={() => handleSubmit()}
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
            >
              See all &ldquo;{query}&rdquo;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
