"use client";

import { SlideUp } from "@/shared/ui/animations";
import ALL_GENRES from "@/modules/books/types/genres";
import React from "react";

interface HomeGenreFilterProps {
  genreSearch: string;
  setGenreSearch: (query: string) => void;
  selectedGenres: string[];
  setSelectedGenres: (genres: string[]) => void;
  sortedGenres: string[];
  genresToShow: number;
  setGenresToShow: React.Dispatch<React.SetStateAction<number>>;
  totalGenres: number;
}

export default function HomeGenreFilter({
  genreSearch,
  setGenreSearch,
  selectedGenres,
  setSelectedGenres,
  sortedGenres,
  genresToShow,
  setGenresToShow,
  totalGenres,
}: HomeGenreFilterProps) {
  const getAllGenres = () => ALL_GENRES;
  const getGenreConfig = (genre: string) => ({ icon: "" });

  return (
    <SlideUp delay={0.6}>
      <div id="genre-section" className="mt-8">
        {/* Search Bar with Dropdown */}
        <div className="max-w-2xl mx-auto mb-6 relative">
          <div className="relative">
            <input
              type="text"
              value={genreSearch}
              onChange={(e) => setGenreSearch(e.target.value)}
              placeholder="Search and select genres..."
              className="w-full px-4 py-3 pl-10 bg-white/5 border border-[var(--border-default)] rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {genreSearch && (
              <button
                onClick={() => setGenreSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                
              </button>
            )}

            {/* Dropdown Suggestion Box */}
            {genreSearch && (
              <div className="absolute top-full left-0 right-0 mt-2 max-h-96 overflow-y-auto bg-[var(--surface-default)] backdrop-blur-xl border border-[var(--border-default)] rounded-xl shadow-2xl z-50">
                <div className="p-2">
                  <p className="text-xs text-slate-400 px-3 py-2">
                    {
                      getAllGenres().filter((g) =>
                        g.toLowerCase().includes(genreSearch.toLowerCase()),
                      ).length
                    }{" "}
                    genres found - Click to select
                  </p>
                  {getAllGenres()
                    .filter((g) =>
                      g.toLowerCase().includes(genreSearch.toLowerCase()),
                    )
                    .slice(0, 20)
                    .map((genre, index) => {
                      const isSelected = selectedGenres.includes(genre);
                      return (
                        <button
                          key={`${genre}-${index}`}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedGenres(
                                selectedGenres.filter((g) => g !== genre),
                              );
                            } else {
                              setSelectedGenres([...selectedGenres, genre]);
                            }
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center justify-between ${
                            isSelected
                              ? "bg-indigo-600/30 text-white border border-indigo-500/50"
                              : "hover:bg-white/5 text-slate-300"
                          }`}
                        >
                          <span>{genre}</span>
                          {isSelected && (
                            <span className="text-green-400"></span>
                          )}
                        </button>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mb-4">
          <p className="text-base text-slate-300 font-semibold">
            {" "}
            {selectedGenres.length > 0
              ? `${selectedGenres.length} genre${selectedGenres.length > 1 ? "s" : ""} selected`
              : `Browse by Genre`}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto mb-4">
          {sortedGenres
            .filter((g) => g.toLowerCase().includes(genreSearch.toLowerCase()))
            .slice(0, genresToShow)
            .map((genre, index) => {
              const isSelected = selectedGenres.includes(genre);
              const { icon } = getGenreConfig(genre);
              return (
                <button
                  key={`${genre}-${index}`}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedGenres(
                        selectedGenres.filter((g) => g !== genre),
                      );
                    } else {
                      setSelectedGenres([...selectedGenres, genre]);
                    }
                  }}
                  className={`group px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 border-2 backdrop-blur-md relative overflow-hidden ${
                    isSelected
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-400 shadow-2xl shadow-indigo-500/50 scale-105"
                      : "bg-white/5 text-slate-300 border-[var(--border-default)] hover:bg-white/15 hover:border-primary/40 hover:text-white hover:scale-105"
                  }`}
                >
                  <div
                    className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isSelected ? "bg-white/10" : "bg-gradient-to-r from-primary/20 to-secondary/20"}`}
                  />
                  <span className="relative flex items-center gap-2">
                    <span className="text-lg">{icon}</span>
                    <span>{genre}</span>
                  </span>
                </button>
              );
            })}
          {selectedGenres.length > 0 && (
            <button
              onClick={() => setSelectedGenres([])}
              title="Clear filters"
              className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border backdrop-blur-md bg-red-600/20 text-red-300 border-red-500/30 hover:bg-red-600/30 hover:border-red-500/50"
            >
               Clear Filters
            </button>
          )}
        </div>

        {genresToShow <
          sortedGenres.filter((g) =>
            g.toLowerCase().includes(genreSearch.toLowerCase()),
          ).length && (
          <div className="text-center mt-4">
            <button
              onClick={() =>
                setGenresToShow((prev) => Math.min(prev + 15, totalGenres))
              }
              className="text-indigo-400 hover:text-indigo-300 font-medium text-sm px-4 py-2 rounded-full hover:bg-indigo-500/10 transition-colors"
            >
              Show More Genres ↓
            </button>
          </div>
        )}
      </div>
    </SlideUp>
  );
}
