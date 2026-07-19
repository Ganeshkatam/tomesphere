"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FadeIn, SlideUp } from "@/shared/ui/animations";
import VoiceInput from "@/modules/discovery/search/presentation/components/VoiceInput";
import SearchSuggestions from "@/modules/discovery/search/presentation/components/SearchSuggestions";

interface LandingHeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  fetchBooks: (query: string, genres: string[]) => void;
  selectedGenres: string[];
  allBooks: any[];
}

export default function LandingHero({
  searchQuery,
  setSearchQuery,
  handleSearch,
  fetchBooks,
  selectedGenres,
  allBooks,
}: LandingHeroProps) {
  const router = useRouter();
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 320) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      className={`relative pt-12 pb-12 sm:pt-16 sm:pb-16 lg:pt-20 lg:pb-20 overflow-hidden min-h-[75vh] flex items-center justify-center ${isSticky ? "z-40" : "z-10"}`}
    >
      {/* Full-screen library background illustration */}
      <div className="absolute inset-0 w-full h-full opacity-45 z-0 pointer-events-none">
        <Image
          src="/library_bg.png"
          alt="Digital library backdrop"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Theme-aware overlay gradient to ensure text readability */}
        <div
          className="absolute inset-0"
          style={{ backgroundImage: "var(--hero-overlay)" }}
        />
      </div>

      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[2000px] pointer-events-none z-10">
        <div
          className="absolute top-20 left-10 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] mix-blend-screen animate-pulse"
          style={{ animationDuration: "4s" }}
        />
        <div
          className="absolute top-40 right-10 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[100px] mix-blend-screen animate-pulse"
          style={{ animationDuration: "6s", animationDelay: "1s" }}
        />
      </div>

      <div className="w-full max-w-[2000px] mx-auto px-2 sm:px-4 lg:px-6 relative z-20">
        <FadeIn className="text-center w-full mx-auto relative" delay={0.2}>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold mb-6 leading-[1.1] tracking-tight text-[var(--text-primary)] drop-shadow-sm">
            Search 250,000+ Books
          </h1>

          <p className="text-lg sm:text-xl mb-12 text-balance max-w-2xl mx-auto leading-relaxed text-[var(--text-secondary)]">
            Explore our massive catalog of fiction, history, science, and more.
          </p>

          {/* Central Search Bar - Premium Glass / Sticky Morph */}
          <div
            className={`w-full transition-all duration-300 ${isSticky ? "fixed top-6 left-1/2 -translate-x-1/2 max-w-3xl w-[92%] z-40 px-4 animate-in fade-in slide-in-from-top-6 duration-300" : "relative max-w-3xl mx-auto mb-4 px-4 sm:px-0"}`}
          >
            <SlideUp className="w-full" delay={0.4}>
              <div className="relative group">
                <div
                  className={`absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-3xl opacity-25 group-hover:opacity-50 blur transition duration-1000 group-hover:duration-200 ${isSticky ? "rounded-2xl" : "rounded-3xl"}`}
                />

                <div
                  className={`relative flex flex-row items-center transition-all duration-300 ${isSticky ? "gap-3 p-2 rounded-2xl bg-[var(--surface-default)]/95 backdrop-blur-3xl border border-[var(--primary)]/60 shadow-[0_0_50px_rgba(99,102,241,0.25)]" : "gap-2 sm:gap-4 p-1.5 sm:p-3 rounded-2xl bg-[var(--surface-default)] border border-[var(--border-default)] shadow-2xl"} focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50`}
                >
                  {/* Search Input Container */}
                  <div
                    id="hero-search"
                    className={`relative flex-1 group/input flex items-center transition-all duration-300 ${isSticky ? "h-11 sm:h-12" : "h-12 sm:h-14"}`}
                  >
                    <div className="absolute inset-y-0 left-2 sm:left-4 flex items-center pointer-events-none">
                      <span className="text-xl sm:text-2xl opacity-50 text-slate-400 group-focus-within/input:text-primary transition-colors">
                        🔍
                      </span>
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSearchQuery(val);
                        fetchBooks(val, selectedGenres);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch();
                      }}
                      placeholder="Search titles, authors, or topics..."
                      className="w-full h-full pl-10 sm:pl-14 pr-10 sm:pr-16 bg-transparent border-none text-base sm:text-lg text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-0 transition-all font-sans"
                    />

                    {/* Voice Input */}
                    <div className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-10 hidden sm:block">
                      <VoiceInput
                        onTranscript={(text) => {
                          setSearchQuery(text);
                        }}
                        className="p-1 sm:p-2 hover:bg-white/10 rounded-full transition-colors"
                      />
                    </div>

                    {/* Search Suggestions */}
                    <SearchSuggestions
                      query={searchQuery}
                      localBooks={allBooks}
                      onSelect={(text, type, id) => {
                        if (type === "book" && id) {
                          router.push(`/books/${id}`);
                        } else {
                          setSearchQuery(text);
                          router.push(`/discover/search?q=${text}`);
                        }
                      }}
                    />
                  </div>

                  {/* Search Button */}
                  <button
                    onClick={handleSearch}
                    className={`rounded-xl btn-primary font-semibold tracking-wide shadow-glow hover:shadow-glow-lg active:scale-95 whitespace-nowrap shrink-0 transition-all duration-300 ${isSticky ? "h-11 sm:h-12 px-6 text-sm" : "h-12 sm:h-14 px-4 sm:px-8 text-sm sm:text-lg"}`}
                  >
                    <span className="hidden sm:inline">Explore</span>
                    <span className="sm:hidden text-white">Go</span>
                  </button>
                </div>
              </div>
            </SlideUp>
          </div>

          {/* Quick Command Filters */}
          <SlideUp
            className="w-full max-w-3xl mx-auto mt-6 px-4 sm:px-0 flex flex-wrap gap-2 justify-center text-xs text-slate-400"
            delay={0.5}
          >
            <span className="font-semibold text-slate-500">Browse:</span>
            {[
              "Fantasy",
              "History",
              "Science",
              "Biography",
              "Programming",
            ].map((topic) => (
              <button
                key={topic}
                onClick={() => {
                  setSearchQuery(topic);
                  router.push(`/discover/search?q=${encodeURIComponent(topic)}`);
                }}
                className="hover:text-indigo-400 transition-colors underline decoration-slate-800 hover:decoration-indigo-400"
              >
                {topic}
              </button>
            ))}
          </SlideUp>
        </FadeIn>
      </div>
    </section>
  );
}
