"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search } from "lucide-react";
import { FadeIn, SlideUp } from "@/shared/ui/animations";
import VoiceInput from "@/modules/discovery/search/presentation/components/VoiceInput";
import SearchSuggestions from "@/modules/discovery/search/presentation/components/SearchSuggestions";

interface HeroSectionProps {
  searchSuggestions?: any[];
}

export default function HeroSection({
  searchSuggestions = [],
}: HeroSectionProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(
        `/discover/search?q=${encodeURIComponent(searchQuery.trim())}`,
      );
    }
  };

  return (
    <section
      className="relative pt-12 pb-12 sm:pt-16 sm:pb-16 lg:pt-20 lg:pb-20 overflow-hidden flex items-center justify-center z-10 bg-slate-950"
    >
      {/* Full-screen library background illustration */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <Image
          src="/hero_library_bg.jpg"
          alt="Digital library sanctuary backdrop"
          fill
          className="object-cover object-center brightness-[0.7] dark:brightness-[0.55]"
          priority
        />
        {/* Dark tint scrim for text contrast - completely clean with NO white highlight/fog */}
        <div className="absolute inset-0 bg-slate-950/45" />
      </div>

      <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <FadeIn className="text-center w-full mx-auto relative" delay={0.2}>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-4 leading-[1.1] tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
            Explore books. Discover ideas.
          </h1>

          <p className="text-base sm:text-lg mb-8 text-balance max-w-2xl mx-auto leading-relaxed text-slate-100 font-medium drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
            Discover, read, and explore knowledge your way.
          </p>

          {/* Central Search Bar */}
          <div className="relative max-w-3xl mx-auto mb-4 px-4 sm:px-0 w-full">
            <SlideUp className="w-full" delay={0.4}>
              <div className="relative group">
                <div
                  className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl opacity-30 group-hover:opacity-60 blur transition duration-500"
                />

                <div
                  className="relative flex flex-row items-center gap-2 sm:gap-4 p-2 sm:p-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/40 dark:border-slate-700/80 shadow-2xl shadow-black/40 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/40"
                >
                  {/* Search Input Container */}
                  <div
                    id="hero-search"
                    className="relative flex-1 group/input flex items-center h-12 sm:h-14"
                  >
                    <div className="absolute inset-y-0 left-3 sm:left-4 flex items-center pointer-events-none">
                      <Search size={20} className="text-slate-500 dark:text-slate-400 group-focus-within/input:text-indigo-600 dark:group-focus-within/input:text-indigo-400 transition-colors" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch();
                      }}
                      placeholder="Search books, authors, subjects, or topics..."
                      className="w-full h-full pl-10 sm:pl-12 pr-10 sm:pr-14 bg-transparent border-none text-base sm:text-lg text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-0 transition-all font-sans"
                    />

                    {/* Voice Input */}
                    <div className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-10 hidden sm:block">
                      <VoiceInput
                        onTranscript={(text) => {
                          setSearchQuery(text);
                        }}
                        className="p-1 sm:p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      />
                    </div>

                    {/* Search Suggestions */}
                    <SearchSuggestions
                      query={searchQuery}
                      localBooks={searchSuggestions}
                      onSelect={(text, type, id) => {
                        if (type === "book" && id) {
                          router.push(`/book/${id}`);
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
                    className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md shadow-indigo-500/20 active:scale-95 whitespace-nowrap shrink-0 transition-all duration-200 h-11 sm:h-12 px-5 sm:px-7 text-sm sm:text-base cursor-pointer"
                  >
                    <span className="hidden sm:inline">Explore</span>
                    <span className="sm:hidden">Go</span>
                  </button>
                </div>
              </div>
            </SlideUp>
          </div>

          {/* Quick Command Filters */}
          <SlideUp
            className="w-full max-w-3xl mx-auto mt-5 px-4 sm:px-0 flex flex-wrap items-center gap-2.5 justify-center text-xs"
            delay={0.5}
          >
            <span className="font-semibold text-white/95 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] mr-1">Browse:</span>
            {["Fiction", "Science", "History", "Technology", "Biography", "Fantasy"].map(
              (topic) => (
                <button
                  key={topic}
                  onClick={() => {
                    setSearchQuery(topic);
                    router.push(
                      `/discover/search?q=${encodeURIComponent(topic)}`,
                    );
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 border border-white/50 dark:border-slate-600 text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-all shadow-md backdrop-blur-xs cursor-pointer active:scale-95"
                >
                  {topic}
                </button>
              ),
            )}
          </SlideUp>
        </FadeIn>
      </div>
    </section>
  );
}
