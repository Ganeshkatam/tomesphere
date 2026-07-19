"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { GridSkeleton } from "@/shared/ui/skeletons";
import BookCard from "@/modules/books/components/BookCard";

interface LandingBookGridProps {
  filteredBooks: any[];
  allBooks: any[];
  loading: boolean;
  selectedGenres: string[];
  searchOrigin: "book" | "genre" | null;
  handleBackToSearch: () => void;
  booksToShow: number;
  setBooksToShow: (fn: (prev: number) => number) => void;
}

export default function LandingBookGrid({
  filteredBooks,
  allBooks,
  loading,
  selectedGenres,
  searchOrigin,
  handleBackToSearch,
  booksToShow,
  setBooksToShow,
}: LandingBookGridProps) {
  return (
    <section id="all-books-section" className="py-20 sm:py-28 relative">
      <div className="w-full max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16">
        {/* Back to Search Button - Shows when filtering or from search */}
        {(selectedGenres.length > 0 || searchOrigin) && (
          <div className="flex justify-center mb-6">
            <button
              onClick={handleBackToSearch}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 hover:border-indigo-500/50 transition-all duration-300 hover:scale-105 font-medium group"
            >
              <svg
                className="w-5 h-5 transition-transform group-hover:-translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>
                {searchOrigin === "genre"
                  ? "Back to Genres"
                  : searchOrigin === "book"
                    ? "Back to Search"
                    : "Back to Filters"}
              </span>
              {selectedGenres.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-indigo-600/30 text-xs">
                  {selectedGenres.length} filter
                  {selectedGenres.length > 1 ? "s" : ""} active
                </span>
              )}
            </button>
          </div>
        )}

        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-2 gradient-text">
            {selectedGenres.length > 0
              ? "Filtered Results"
              : "Explore the Collection"}
          </h2>
          <p className="text-base sm:text-lg text-slate-400">
            {filteredBooks.length} books ready to read
            {selectedGenres.length > 0 &&
              ` — filtered by ${selectedGenres.length} genre${selectedGenres.length > 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Books Grid - With increased spacing and smaller cards */}
        {loading ? (
          <div className="mt-8">
            <GridSkeleton count={14} />
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-20 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-slate-400" />
            </div>
            <p className="text-xl text-slate-400 mb-4">
              No books available yet.
            </p>
            <p className="text-sm text-slate-500">
              {allBooks.length === 0
                ? "Add books to your database to see them here."
                : `No books match the selected ${selectedGenres.length} genre${selectedGenres.length > 1 ? "s" : ""}.`}
            </p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05,
                },
              },
            }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-6 mb-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredBooks.slice(0, booksToShow).map((book: any) => (
                <motion.div
                  key={book.id}
                  layout
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 24,
                      },
                    },
                  }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="h-full"
                >
                  <BookCard book={book} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Load More Button */}
        {booksToShow < filteredBooks.length && (
          <div className="text-center">
            <button
              onClick={() =>
                setBooksToShow((prev) =>
                  Math.min(prev + 10, filteredBooks.length),
                )
              }
              className="backdrop-blur-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-white px-8 py-3 rounded-full border border-indigo-500/50 hover:border-indigo-400 transition-all duration-300 hover:scale-105 font-medium"
            >
              Load More Books ({filteredBooks.length - booksToShow} remaining)
            </button>
          </div>
        )}

        {/* Show All Loaded Message */}
        {booksToShow >= filteredBooks.length && filteredBooks.length > 10 && (
          <div className="text-center">
            <p className="text-slate-400">
              All {filteredBooks.length} books displayed ✨
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
