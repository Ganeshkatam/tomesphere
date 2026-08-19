"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, ArrowRight } from "lucide-react";
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
      className="relative w-full min-h-[720px] lg:min-h-[780px] pt-20 pb-24 sm:pt-24 sm:pb-28 lg:pt-28 lg:pb-32 flex items-center z-10 bg-slate-950 overflow-hidden"
    >
      {/* Full-screen library sanctuary background backdrop with art-directed lighting balance */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <Image
          src="/hero_sanctuary_bg.jpg"
          alt="Digital library sanctuary at twilight"
          fill
          className="object-cover object-right lg:object-center brightness-[0.9] contrast-[1.05]"
          priority
        />
        {/* Softening overlays: Deeper negative space on left, softened lamp glow on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-slate-950/35" />
        <div className="absolute top-0 right-0 w-full sm:w-1/2 h-full bg-radial from-transparent via-slate-950/20 to-slate-950/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-transparent to-slate-950" />
      </div>

      {/* Hero Content (Positioned ~8-10% inward in a 1360px container) */}
      <div className="w-full max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-14 relative z-20">
        <div className="max-w-2xl lg:max-w-[760px] text-left">
          {/* Typographic Identity: Bold Modern Sans + Warm Editorial Serif Italic */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] mb-4 leading-[1.05] tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
            <span className="font-sans font-extrabold block text-white">
              Explore books.
            </span>
            <span className="font-serif italic font-normal text-amber-100/90 block mt-1.5">
              Discover ideas.
            </span>
          </h1>

          {/* Subtitle Statement */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-300 font-sans leading-relaxed mb-10 max-w-lg drop-shadow-md">
            Discover, read, and explore knowledge
            <br className="hidden sm:inline" />
            your way.
          </p>

          {/* Grand Search Bar: 720-760px wide × 72px high */}
          <div className="relative max-w-full sm:max-w-[760px] mb-6 w-full">
            <div className="relative group">
              {/* Subtle purple aura glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/40 via-purple-600/40 to-indigo-500/40 rounded-full opacity-40 group-hover:opacity-70 blur-md transition duration-500" />

              <div className="relative flex items-center gap-2 p-2 sm:p-2.5 rounded-full bg-slate-950/85 backdrop-blur-2xl border border-white/20 shadow-2xl shadow-black/90 focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-500/40 transition-all duration-300 min-h-[64px] sm:min-h-[72px]">
                {/* Search Icon */}
                <div className="pl-3 sm:pl-5 text-slate-400 group-focus-within:text-indigo-400 transition-colors pointer-events-none">
                  <Search size={22} />
                </div>

                {/* Input */}
                <div id="hero-search" className="relative flex-1 flex items-center h-12 sm:h-14">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch();
                    }}
                    placeholder="Search books, authors, subjects, or topics..."
                    className="w-full h-full pl-2 pr-10 bg-transparent border-none text-base sm:text-lg text-white placeholder:text-slate-400 focus:outline-none focus:ring-0 font-sans font-normal"
                  />

                  {/* Voice Input */}
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 z-10">
                    <VoiceInput
                      onTranscript={(text) => {
                        setSearchQuery(text);
                      }}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white cursor-pointer"
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

                {/* Explore CTA Button */}
                <button
                  onClick={handleSearch}
                  className="rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-md shadow-indigo-600/30 active:scale-95 whitespace-nowrap shrink-0 transition-all duration-200 h-11 sm:h-13 px-6 sm:px-8 text-sm sm:text-base flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Category Quick Links */}
          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2 text-xs sm:text-sm text-slate-400 font-normal">
            <span className="text-slate-300 font-medium">Explore</span>
            <span className="text-slate-600 select-none">·</span>
            {["Fiction", "Science", "History", "Technology", "Biography", "Fantasy"].map(
              (topic, idx, arr) => (
                <span key={topic} className="inline-flex items-center gap-3.5">
                  <button
                    onClick={() => {
                      setSearchQuery(topic);
                      router.push(
                        `/discover/search?q=${encodeURIComponent(topic)}`,
                      );
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    {topic}
                  </button>
                  {idx < arr.length - 1 && (
                    <span className="text-slate-600 select-none">·</span>
                  )}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
