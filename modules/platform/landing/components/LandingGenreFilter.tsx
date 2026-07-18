'use client';

import { useState } from 'react';
import { SlideUp } from '@/modules/shared/ui/animations';

interface LandingGenreFilterProps {
  genres: string[];
  selectedGenres: string[];
  setSelectedGenres: (genres: string[]) => void;
  searchQuery: string;
  fetchBooks: (query: string, genres: string[]) => void;
  setSearchOrigin: (origin: 'book' | 'genre' | null) => void;
}

export default function LandingGenreFilter({
  genres,
  selectedGenres,
  setSelectedGenres,
  searchQuery,
  fetchBooks,
  setSearchOrigin
}: LandingGenreFilterProps) {
  const [genreSearch, setGenreSearch] = useState('');
  const [genresToShow, setGenresToShow] = useState(5);

  const sortedGenres = [...genres].sort((a, b) => {
    const isSelectedA = selectedGenres.includes(a);
    const isSelectedB = selectedGenres.includes(b);
    if (isSelectedA && !isSelectedB) return -1;
    if (!isSelectedA && isSelectedB) return 1;
    return a.localeCompare(b);
  });

  return (
    <SlideUp>
      <div id="genre-section" className="mt-8">
        {/* Search Bar with Dropdown and Search Button */}
        <div className="max-w-3xl mx-auto mb-6 relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={genreSearch}
                onChange={(e) => setGenreSearch(e.target.value)}
                placeholder="Search and select genres..."
                className="w-full px-4 py-3 pl-10 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {genreSearch && (
                <button
                  onClick={() => setGenreSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}

              {/* Dropdown Suggestion Box */}
              {genreSearch && (
                <div className="absolute top-full left-0 right-0 mt-2 max-h-96 overflow-y-auto bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50">
                  <div className="p-2">
                    <p className="text-xs text-slate-400 px-3 py-2">
                      {genres.filter(g => g.toLowerCase().includes(genreSearch.toLowerCase())).length} genres found - Click to select
                    </p>
                    {genres
                      .filter(g => g.toLowerCase().includes(genreSearch.toLowerCase()))
                      .slice(0, 20)
                      .map((genre) => {
                        const isSelected = selectedGenres.includes(genre);
                        return (
                          <button
                            key={genre}
                            onClick={() => {
                              let newGenres;
                              if (isSelected) {
                                newGenres = selectedGenres.filter(g => g !== genre);
                              } else {
                                newGenres = [...selectedGenres, genre];
                              }
                              setSelectedGenres(newGenres);
                              fetchBooks(searchQuery, newGenres);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center justify-between ${isSelected
                              ? 'bg-indigo-600/30 text-white border border-indigo-500/50'
                              : 'hover:bg-white/5 text-slate-300'
                              }`}
                          >
                            <span>{genre}</span>
                            {isSelected && <span className="text-green-400">✓</span>}
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>

            {/* Search Button - Scrolls to Results */}
            <button
              onClick={() => {
                if (selectedGenres.length > 0) {
                  setSearchOrigin('genre');
                  setTimeout(() => {
                    document.getElementById('all-books-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }}
              disabled={selectedGenres.length === 0}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 whitespace-nowrap h-fit ${selectedGenres.length > 0
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-white/5 text-slate-500 cursor-not-allowed'
                }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden sm:inline">Find Books</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mb-6">
          <p className="text-lg text-slate-200 font-bold">
            📚 {selectedGenres.length > 0
              ? `${selectedGenres.length} Genre${selectedGenres.length > 1 ? 's' : ''} Selected`
              : `Explore ${genres.length} Genres`}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 max-w-6xl mx-auto mb-5">
          {sortedGenres.filter(g => g.toLowerCase().includes(genreSearch.toLowerCase())).slice(0, genresToShow).map((genre) => {
            const isSelected = selectedGenres.includes(genre);

            const genreEmojis: Record<string, string> = {
              'Fiction': '📚', 'Non-Fiction': '📖', 'Science': '🔬', 'Technology': '💻',
              'History': '🏛️', 'Biography': '👤', 'Mystery & Thriller': '🔍', 'Romance': '💕',
              'Fantasy': '🐉', 'Science Fiction': '🚀', 'Horror': '👻', 'Thriller': '⚡',
              'Self-Help': '🌟', 'Business': '💼', 'Cooking': '🍳', 'Poetry & Art': '🎨',
              'Music': '🎵', 'Philosophy': '🤔', 'Religion': '📿', 'Politics': '🏛️',
              'Economics': '📊', 'Psychology': '🧠', 'Education': '🎓', 'Health': '⚕️',
              'Travel': '✈️', 'Sports': '⚽', 'Nature': '🌿',
            };

            const emoji = genreEmojis[genre] || '📕';

            return (
              <button
                key={genre}
                onClick={() => {
                  let newGenres;
                  if (isSelected) {
                    newGenres = selectedGenres.filter(g => g !== genre);
                  } else {
                    newGenres = [...selectedGenres, genre];
                  }
                  setSelectedGenres(newGenres);
                  fetchBooks(searchQuery, newGenres);
                }}
                className={`group px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 border-2 backdrop-blur-md relative overflow-hidden ${isSelected
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-400 shadow-2xl shadow-indigo-500/50 scale-105'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/15 hover:border-primary/40 hover:text-white hover:scale-105'
                  }`}
              >
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isSelected ? 'bg-white/10' : 'bg-gradient-to-r from-primary/20 to-secondary/20'
                  }`} />
                <span className="relative flex items-center gap-2">
                  <span className="text-lg">{emoji}</span>
                  <span>{genre}</span>
                </span>
              </button>
            );
          })}
          {selectedGenres.length > 0 && (
            <>
              <button
                onClick={() => {
                  setSelectedGenres([]);
                  fetchBooks(searchQuery, []); // Instant clear
                }}
                title="Clear filters"
                className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border backdrop-blur-md bg-red-600/20 text-red-300 border-red-500/30 hover:bg-red-600/30 hover:border-red-500/50"
              >
                Clear ({selectedGenres.length})
              </button>
              <button
                onClick={() => {
                  setSearchOrigin('genre');
                  setTimeout(() => {
                    document.getElementById('all-books-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border backdrop-blur-md bg-indigo-600 text-white border-indigo-500 hover:bg-indigo-700 hover:border-indigo-400"
              >
                Apply
              </button>
            </>
          )}
        </div>

        {/* Load More / Show Less Buttons */}
        <div className="flex justify-center gap-3 mt-4">
          {genresToShow < genres.filter(g => g.toLowerCase().includes(genreSearch.toLowerCase())).length && (
            <button
              onClick={() => setGenresToShow(prev => Math.min(prev + 5, genres.length))}
              className="px-6 py-2 rounded-full bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-all text-sm font-medium"
            >
              Load 5 More ({genres.filter(g => g.toLowerCase().includes(genreSearch.toLowerCase())).length - genresToShow} remaining)
            </button>
          )}
          {genresToShow > 5 && (
            <button
              onClick={() => setGenresToShow(5)}
              className="px-6 py-2 rounded-full bg-slate-600/20 hover:bg-slate-600/30 text-slate-300 border border-slate-500/30 transition-all text-sm font-medium"
            >
              Show Less ▲
            </button>
          )}
        </div>
      </div>
    </SlideUp>
  );
}
