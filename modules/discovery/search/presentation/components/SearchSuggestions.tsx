"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Search, Book, User, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { searchBooks } from "@/modules/discovery/search/presentation/actions/search";

interface Suggestion {
  type: "book" | "author" | "genre";
  text: string;
  id?: string;
  subtitle?: string;
  score?: number;
}

interface SearchSuggestionsProps {
  query: string;
  onSelect?: (
    suggestion: string,
    type: "book" | "author" | "genre",
    id?: string,
  ) => void;
  className?: string;
  localBooks?: any[];
}

export default function SearchSuggestions({
  query,
  onSelect,
  className = "",
  localBooks,
}: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();
  const listRef = useRef<HTMLUListElement>(null);

  // Build Fuse index once when localBooks changes — O(n) upfront, O(1) per query
  const fuseIndex = useMemo(() => {
    if (!localBooks || localBooks.length === 0) return null;
    return new Fuse(localBooks, {
      keys: [
        { name: "title", weight: 0.5 },
        { name: "author", weight: 0.3 },
        { name: "genre", weight: 0.1 },
        { name: "description", weight: 0.1 },
      ],
      threshold: 0.35, // Tight enough for accuracy, loose enough for typos
      distance: 200, // Allow matches within long strings
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 2,
      ignoreLocation: true, // Don't penalise matches late in a string
    });
  }, [localBooks]);

  // Instant local search with Fuse.js — runs synchronously, <5ms for 1000 books
  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      setActiveIndex(-1);
      return;
    }

    // ── Fast path: local Fuse.js search ──
    if (fuseIndex) {
      const start = performance.now();
      const results = fuseIndex.search(query, { limit: 8 });
      const elapsed = performance.now() - start;

      const newSuggestions: Suggestion[] = [];
      const seenAuthors = new Set<string>();

      for (const result of results) {
        const book = result.item;
        // Always add book title
        const authorString =
          book.authors?.map((a: any) => a.name).join(", ") || "Unknown";
        newSuggestions.push({
          type: "book",
          text: book.title,
          id: book.id,
          subtitle: `by ${authorString}`,
          score: result.score,
        });

        // Deduplicated author suggestions
        book.authors?.forEach((authorObj: any) => {
          const author = authorObj.name;
          if (author && !seenAuthors.has(author.toLowerCase())) {
            seenAuthors.add(author.toLowerCase());
            newSuggestions.push({
              type: "author",
              text: author,
              subtitle: `Author`,
              score: (result.score || 0) + 0.1, // slightly lower priority
            });
          }
        });
      }

      // Sort by score (lower = better in Fuse.js) and take top 6
      newSuggestions.sort((a, b) => (a.score || 0) - (b.score || 0));
      setSuggestions(newSuggestions.slice(0, 6));
      setActiveIndex(-1);
      setLoading(false);
      return;
    }

    // ── Slow path: server action (fallback for /search page) ──
    setLoading(true);
    const controller = new AbortController();

    const timeoutId = setTimeout(async () => {
      try {
        const res = await searchBooks(query, "", 1);

        if (controller.signal.aborted) return;
        if (!res || !res.success) return;

        const newSuggestions: Suggestion[] = [];
        const seenAuthors = new Set<string>();

        res.data.books.forEach((book: any) => {
          const authorString =
            book.authors?.map((a: any) => a.name).join(", ") || "Unknown";
          if (book.title?.toLowerCase().includes(query.toLowerCase())) {
            newSuggestions.push({
              type: "book",
              text: book.title,
              id: book.id,
              subtitle: `by ${authorString}`,
            });
          }
          book.authors?.forEach((authorObj: any) => {
            const author = authorObj.name;
            if (author?.toLowerCase().includes(query.toLowerCase())) {
              if (!seenAuthors.has(author.toLowerCase())) {
                seenAuthors.add(author.toLowerCase());
                newSuggestions.push({
                  type: "author",
                  text: author,
                  subtitle: "Author",
                });
              }
            }
          });
        });

        setSuggestions(newSuggestions.slice(0, 6));
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("Error fetching suggestions:", err);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 150);

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [query, fuseIndex]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      const item = suggestions[activeIndex];
      if (onSelect) onSelect(item.text, item.type, item.id);
    }
  };

  if (!query || (suggestions.length === 0 && !loading)) return null;

  return (
    <div
      className={`absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden ${className}`}
      onKeyDown={handleKeyDown}
    >
      {loading ? (
        <div className="p-4 text-center text-slate-400 text-sm">
          <div className="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
          Searching...
        </div>
      ) : (
        <ul className="py-1" ref={listRef}>
          {suggestions.map((item, idx) => (
            <li key={`${item.type}-${item.text}-${idx}`}>
              <button
                onClick={() => {
                  if (onSelect) {
                    onSelect(item.text, item.type, item.id);
                  } else if (item.type === "book" && item.id) {
                    router.push(`/books/${item.id}`);
                  }
                }}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`w-full px-4 py-2.5 flex items-center gap-3 text-left transition-colors group ${
                  activeIndex === idx ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    activeIndex === idx
                      ? "bg-primary/20 text-primary"
                      : "bg-white/5 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary"
                  }`}
                >
                  {item.type === "book" && <Book size={14} />}
                  {item.type === "author" && <User size={14} />}
                  {item.type === "genre" && <Tag size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 font-medium group-hover:text-white truncate">
                    {item.text}
                  </p>
                  {item.subtitle && (
                    <p className="text-xs text-slate-500 truncate">
                      {item.subtitle}
                    </p>
                  )}
                </div>
                {item.type === "book" && (
                  <span className="text-[10px] text-slate-600 uppercase tracking-wider font-medium">
                    ↵
                  </span>
                )}
              </button>
            </li>
          ))}
          {suggestions.length > 0 && (
            <li className="border-t border-white/5 mt-1 pt-1">
              <button
                onClick={() => onSelect && onSelect(query, "genre")}
                className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-white/10 text-left transition-colors text-xs text-slate-400 hover:text-white"
              >
                <Search size={12} />
                See all results for &quot;{query}&quot;
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
