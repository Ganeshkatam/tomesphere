"use client";

import { SearchResultDto } from "@/modules/discovery/application/queries/SearchBooks/read-model";
import BookCard from "@/modules/books/components/BookCard";
import { FadeIn, StaggerContainer, StaggerItem } from "@/shared/ui/motion";
import { EmptyState } from "@/shared/ui/EmptyState";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import { Search } from "lucide-react";
import { useDebounce } from "@/lib/hooks/useDebounce";// created new debounce hook in lib/hooks/useDebounce.ts

interface SearchClientProps {
  initialResults: SearchResultDto;
  query: string;
}

export default function SearchClient({ initialResults, query }: SearchClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(query);
  const [isPending, startTransition] = useTransition();

  // Debounce the search term to avoid hitting the server on every keystroke
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    // When the debounced term changes, update the URL
    const params = new URLSearchParams(searchParams.toString());

    // We only want to push if the term is different from what's in the URL
    const currentQ = searchParams.get("q") || "";
    if (debouncedSearchTerm === currentQ) return;

    if (debouncedSearchTerm.trim()) {
      params.set("q", debouncedSearchTerm.trim());
    } else {
      params.delete("q");
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }, [debouncedSearchTerm, pathname, router, searchParams]);

  useEffect(() => {
    // Sync external query changes back to local state if needed (e.g. back button)
    if (query !== debouncedSearchTerm) {
      setSearchTerm(query);
    }
  }, [query]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gradient-page pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <form onSubmit={handleSearch} className="relative group max-w-2xl mx-auto mb-12">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400 transition-colors"
            size={20}
          />
          <input
            type="text"
            name="q"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, author, or subject..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all placeholder:text-slate-500 shadow-2xl"
          />
        </form>

        {!searchTerm.trim() ? (
          <FadeIn>
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
                <Search className="text-indigo-400" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Search the Catalog</h2>
              <p className="text-slate-400 max-w-md">
                Type a book title, author, or genre above to discover your next great read.
              </p>
            </div>
          </FadeIn>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white mb-2">Search Results</h1>
              <p className="text-slate-400">Found {initialResults.totalCount} results for &quot;{query}&quot;</p>
            </div>

            {initialResults.books.length === 0 ? (
              <FadeIn>
                <EmptyState
                  title="No books found"
                  description="Try adjusting your search terms"
                />
              </FadeIn>
            ) : (
              <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {initialResults.books.map((book) => (
                  <StaggerItem key={book.id}>
                    <div className="h-full transform hover:-translate-y-2 transition-transform duration-300">
                      <BookCard book={book} onAddToList={() => { }} />
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </>
        )}
      </div>
    </div>
  );
}
