"use client";

import { useState, useEffect } from "react";
import { TrendingBookDto } from "@/modules/discovery/application/queries/GetTrendingBooks/response";
import BookCard from "@/modules/books/components/BookCard";

interface TrendingClientProps {
  initialBooks: TrendingBookDto[];
  initialPeriod: "daily" | "weekly" | "monthly" | "all-time";
}

export function TrendingClient({ initialBooks, initialPeriod }: TrendingClientProps) {
  const [books, setBooks] = useState<TrendingBookDto[]>(initialBooks);
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly" | "all-time">(initialPeriod);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadBooks() {
      if (period === initialPeriod) {
        setBooks(initialBooks);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/v1/trending?period=${period}&limit=20`);
        const json = await res.json();
        if (json.success && active) {
          setBooks(json.books);
        }
      } catch (err) {
        console.error("Failed to load trending books:", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadBooks();
    return () => { active = false; };
  }, [period, initialPeriod, initialBooks]);

  const periods = [
    { id: "daily", label: "Daily" },
    { id: "weekly", label: "Weekly" },
    { id: "monthly", label: "Monthly" },
    { id: "all-time", label: "All Time" },
  ] as const;

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <div className="border-b border-[var(--border-default)]">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {periods.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPeriod(tab.id)}
              className={`
                whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors
                ${period === tab.id
                  ? "border-blue-500 text-blue-500"
                  : "border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-300"
                }
              `}
              aria-current={period === tab.id ? "page" : undefined}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Grid */}
      <div className="relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          </div>
        )}

        {books.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-default)] p-12 text-center">
            <h3 className="mt-2 text-sm font-semibold text-white">No trending books</h3>
            <p className="mt-1 text-sm text-gray-400">Check back later for new trending titles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {books.map((book) => (
              <div key={book.id} className="relative group">
                <div className="absolute -top-3 -left-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 font-bold text-white shadow-lg ring-4 ring-black">
                  #{book.rank}
                </div>
                <BookCard
                  book={book as any} 
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
