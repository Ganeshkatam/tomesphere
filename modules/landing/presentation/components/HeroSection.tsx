"use client";

import { useState, useEffect } from "react";
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
      className="relative pt-16 pb-16 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-24 overflow-hidden min-h-[70vh] flex items-center justify-center z-10"
    >
      {/* Full-screen library background illustration */}
      <div className="absolute inset-0 w-full h-full opacity-35 z-0 pointer-events-none">
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
          className="absolute top-20 left-10 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse"
          style={{ animationDuration: "4s" }}
        />
        <div
          className="absolute top-40 right-10 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse"
          style={{ animationDuration: "6s", animationDelay: "1s" }}
        />
      </div>

      <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <FadeIn className="text-center w-full mx-auto relative" delay={0.2}>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-5 leading-[1.1] tracking-tight text-[var(--text-primary)]">
            Search 250,000+ Books
          </h1>

          <p className="text-base sm:text-lg mb-10 text-balance max-w-2xl mx-auto leading-relaxed text-[var(--text-secondary)]">
            Explore our massive catalog of fiction, history, science, and more.
          </p>

          {/* Central Search Bar */}
          <div className="relative max-w-3xl mx-auto mb-4 px-4 sm:px-0 w-full">
            <SlideUp className="w-full" delay={0.4}>
              <div className="relative group">
                <div
                  className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl opacity-20 group-hover:opacity-40 blur transition duration-500"
                />

                <div
                  className="relative flex flex-row items-center gap-2 sm:gap-4 p-2 sm:p-2.5 rounded-2xl bg-[var(--surface-default)] border border-[var(--border-default)] shadow-2xl focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
                >
                  {/* Search Input Container */}
                  <div
                    id="hero-search"
                    className="relative flex-1 group/input flex items-center h-12 sm:h-14"
                  >
                    <div className="absolute inset-y-0 left-3 sm:left-4 flex items-center pointer-events-none">
                      <Search size={20} className="text-[var(--text-tertiary)] group-focus-within/input:text-indigo-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch();
                      }}
                      placeholder="Search titles, authors, or topics..."
                      className="w-full h-full pl-10 sm:pl-12 pr-10 sm:pr-14 bg-transparent border-none text-base sm:text-lg text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-0 transition-all font-sans"
                    />

                    {/* Voice Input */}
                    <div className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-10 hidden sm:block">
                      <VoiceInput
                        onTranscript={(text) => {
                          setSearchQuery(text);
                        }}
                        className="p-1 sm:p-2 hover:bg-[var(--surface-overlay)] rounded-full transition-colors text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
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
                    className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md shadow-indigo-500/20 active:scale-95 whitespace-nowrap shrink-0 transition-all duration-200 h-11 sm:h-12 px-5 sm:px-7 text-sm sm:text-base"
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
            className="w-full max-w-3xl mx-auto mt-6 px-4 sm:px-0 flex flex-wrap items-center gap-2 justify-center text-xs"
            delay={0.5}
          >
            <span className="font-semibold text-[var(--text-tertiary)] mr-1">Browse:</span>
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
                  className="px-3 py-1 rounded-full bg-[var(--surface-default)] hover:bg-[var(--surface-raised)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-indigo-500 transition-all shadow-xs"
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
