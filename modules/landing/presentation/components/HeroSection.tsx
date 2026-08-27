"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search,
  ArrowRight,
  BookMarked,
  Atom,
  Landmark,
  Cpu,
  Feather,
  Sparkles,
  Compass,
} from "lucide-react";
import { useTheme } from "@/shared/providers/theme-context";
import VoiceInput from "@/modules/discovery/search/presentation/components/VoiceInput";
import SearchSuggestions from "@/modules/discovery/search/presentation/components/SearchSuggestions";

interface HeroSectionProps {
  searchSuggestions?: any[];
}

const CATEGORIES = [
  { name: "Fiction", icon: BookMarked },
  { name: "Science", icon: Atom },
  { name: "History", icon: Landmark },
  { name: "Technology", icon: Cpu },
  { name: "Biography", icon: Feather },
  { name: "Fantasy", icon: Sparkles },
];

export default function HeroSection({
  searchSuggestions = [],
}: HeroSectionProps) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const isDark = resolvedTheme === "dark";

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(
        `/search?q=${encodeURIComponent(searchQuery.trim())}`,
      );
    }
  };

  return (
    <section
      className="relative w-full min-h-[740px] lg:min-h-[820px] pt-20 pb-24 sm:pt-24 sm:pb-28 lg:pt-28 lg:pb-32 flex items-center z-10 overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: isDark ? "#020617" : "#f8fafc" }}
    >
      {/* Background Image -- bespoke sunlit daylight sanctuary for light mode & dusk sanctuary for dark mode */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        <Image
          src={isDark ? "/hero_sanctuary_bg.jpg" : "/hero_light_bg.jpg"}
          alt={isDark ? "Digital library sanctuary at dusk" : "Sunlit classical library sanctuary"}
          fill
          className="object-cover object-right lg:object-center transition-all duration-700 scale-105"
          style={{
            opacity: isDark ? 1 : 0.95,
            filter: isDark
              ? "contrast(1.05) brightness(0.85) blur(1.5px)"
              : "contrast(1.02) brightness(0.98) blur(2px)",
            mixBlendMode: "normal",
            maskImage: isDark
              ? "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 25%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.85) 55%, black 75%), linear-gradient(to top, transparent 0%, black 12%)"
              : "linear-gradient(to right, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.65) 30%, rgba(0,0,0,0.9) 60%, black 90%), linear-gradient(to top, transparent 0%, black 6%)",
            maskComposite: "intersect",
            WebkitMaskImage: isDark
              ? "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 25%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.85) 55%, black 75%), linear-gradient(to top, transparent 0%, black 12%)"
              : "linear-gradient(to right, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.65) 30%, rgba(0,0,0,0.9) 60%, black 90%), linear-gradient(to top, transparent 0%, black 6%)",
            WebkitMaskComposite: "source-in",
          }}
          priority
        />

        {/* Subtle bottom fade into page surface */}
        <div
          className="absolute bottom-0 left-0 w-full h-24 pointer-events-none"
          style={{
            background: isDark
              ? "linear-gradient(to top, #020617, transparent)"
              : "linear-gradient(to top, #f8fafc, transparent)",
          }}
        />
      </div>

      {/* Floating Micro-Illustrations (Atmospheric Celestial & Archive Accents) */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {/* Outer orbit ring -- slow rotation */}
        <div
          className="absolute top-8 left-6 lg:left-16 w-44 h-44 rounded-full animate-[spin_90s_linear_infinite] flex items-center justify-center"
          style={{
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: isDark ? "rgba(129,140,248,0.08)" : "rgba(99,102,241,0.1)",
          }}
        >
          {/* Inner astrolabe ring -- counter-rotation */}
          <div
            className="w-28 h-28 rounded-full animate-[spin_60s_linear_infinite_reverse] flex items-center justify-center"
            style={{
              borderWidth: 1,
              borderStyle: "dashed",
              borderColor: isDark ? "rgba(217,160,70,0.12)" : "rgba(180,120,40,0.14)",
            }}
          >
            <Compass
              size={24}
              strokeWidth={1}
              style={{ color: isDark ? "rgba(217,160,70,0.18)" : "rgba(160,120,40,0.2)" }}
            />
          </div>
        </div>

        {/* Open book wireframe -- top area */}
        <svg
          className="absolute top-20 left-52 lg:left-72"
          width="56"
          height="40"
          viewBox="0 0 56 40"
          fill="none"
          style={{ opacity: isDark ? 0.15 : 0.18 }}
        >
          <path
            d="M28 6C22 4 14 3 4 5V35C14 33 22 34 28 36C34 34 42 33 52 35V5C42 3 34 4 28 6Z"
            stroke={isDark ? "#a5b4fc" : "#6366f1"}
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <line x1="28" y1="6" x2="28" y2="36" stroke={isDark ? "#a5b4fc" : "#6366f1"} strokeWidth="0.8" />
        </svg>

        {/* Constellation dots -- scattered in the top-left quadrant */}
        {[
          { top: "15%", left: "8%", size: 3, delay: "0ms" },
          { top: "10%", left: "22%", size: 4, delay: "400ms" },
          { top: "25%", left: "5%", size: 2.5, delay: "800ms" },
          { top: "8%", left: "35%", size: 3, delay: "1200ms" },
          { top: "30%", left: "18%", size: 2, delay: "600ms" },
          { top: "18%", left: "42%", size: 3.5, delay: "1000ms" },
          { top: "35%", left: "8%", size: 2, delay: "200ms" },
        ].map((dot, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              top: dot.top,
              left: dot.left,
              width: dot.size,
              height: dot.size,
              backgroundColor: isDark ? "rgba(217,160,70,0.3)" : "rgba(180,120,40,0.25)",
              animationDelay: dot.delay,
            }}
          />
        ))}

        {/* Connecting constellation lines */}
        <svg
          className="absolute top-[8%] left-[8%]"
          width="380"
          height="200"
          viewBox="0 0 380 200"
          fill="none"
          style={{ opacity: isDark ? 0.06 : 0.07 }}
        >
          <line x1="0" y1="50" x2="120" y2="15" stroke={isDark ? "#fbbf24" : "#92400e"} strokeWidth="0.5" />
          <line x1="120" y1="15" x2="230" y2="60" stroke={isDark ? "#a5b4fc" : "#6366f1"} strokeWidth="0.5" />
          <line x1="0" y1="50" x2="80" y2="110" stroke={isDark ? "#fbbf24" : "#92400e"} strokeWidth="0.5" />
          <line x1="120" y1="15" x2="80" y2="110" stroke={isDark ? "#a5b4fc" : "#6366f1"} strokeWidth="0.5" />
        </svg>

        {/* Quill pen silhouette */}
        <svg
          className="absolute top-32 left-[38%] lg:left-[30%]"
          width="28"
          height="44"
          viewBox="0 0 28 44"
          fill="none"
          style={{ opacity: isDark ? 0.12 : 0.15, transform: "rotate(-20deg)" }}
        >
          <path
            d="M14 0C14 0 6 12 6 24C6 32 10 40 14 44C18 40 22 32 22 24C22 12 14 0 14 0Z"
            stroke={isDark ? "#fbbf24" : "#92400e"}
            strokeWidth="1"
            fill="none"
          />
          <line x1="14" y1="24" x2="14" y2="44" stroke={isDark ? "#fbbf24" : "#92400e"} strokeWidth="0.8" />
        </svg>

        {/* Starburst accent 1 */}
        <div
          className="absolute top-[22%] left-[28%] animate-pulse"
          style={{ color: isDark ? "rgba(217,160,70,0.25)" : "rgba(180,120,40,0.22)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
          </svg>
        </div>

        {/* Starburst accent 2 */}
        <div
          className="absolute bottom-1/3 left-12 animate-pulse"
          style={{
            color: isDark ? "rgba(129,140,248,0.2)" : "rgba(99,102,241,0.18)",
            animationDelay: "700ms",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
          </svg>
        </div>

        {/* Small diamond */}
        <div
          className="absolute top-[40%] left-[25%] animate-pulse"
          style={{ animationDelay: "1500ms" }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <rect
              x="5"
              y="0"
              width="5"
              height="5"
              transform="rotate(45 5 0)"
              stroke={isDark ? "rgba(217,160,70,0.2)" : "rgba(160,120,40,0.2)"}
              strokeWidth="0.8"
            />
          </svg>
        </div>
      </div>

      {/* Editorial Text Contrast Scrim (Pristine typography readability against illustration) */}
      <div
        className="absolute inset-y-0 left-0 w-full lg:w-[65%] xl:w-[58%] z-10 pointer-events-none transition-all duration-500"
        style={{
          background: isDark
            ? "linear-gradient(to right, rgba(2,6,23,0.92) 0%, rgba(2,6,23,0.78) 45%, rgba(2,6,23,0.3) 80%, transparent 100%)"
            : "linear-gradient(to right, rgba(248,250,252,0.94) 0%, rgba(248,250,252,0.82) 45%, rgba(248,250,252,0.35) 80%, transparent 100%)",
        }}
      />

      {/* Hero Content */}
      <div className="w-full max-w-[1760px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-20 relative z-20">
        <div className="max-w-3xl xl:max-w-4xl text-left">
          {/* Typographic Identity with Enhanced Contrast */}
          <h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] xl:text-[88px] mb-4 leading-[1.02] tracking-tight transition-colors"
            style={{ color: isDark ? "#ffffff" : "#020617" }}
          >
            <span className="font-sans font-extrabold block drop-shadow-xs">
              Explore books.
            </span>
            <span
              className="font-serif italic font-normal block mt-1"
              style={{ color: isDark ? "rgba(255,237,213,0.95)" : "#78350f" }}
            >
              Discover ideas.
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg sm:text-xl lg:text-2xl font-sans leading-relaxed mb-10 max-w-xl transition-colors font-normal"
            style={{ color: isDark ? "#e2e8f0" : "#334155" }}
          >
            Discover, read, and explore knowledge
            <br className="hidden sm:inline" />
            your way.
          </p>

          {/* Grand Expanded Search Bar */}
          <div className="relative max-w-full sm:max-w-[820px] mb-8 w-full">
            <div className="relative group">
              {/* Subtle purple aura glow */}
              <div
                className="absolute -inset-1 rounded-full blur-md transition duration-500 opacity-40 group-hover:opacity-70"
                style={{
                  background: isDark
                    ? "linear-gradient(to right, rgba(99,102,241,0.4), rgba(147,51,234,0.4), rgba(99,102,241,0.4))"
                    : "linear-gradient(to right, rgba(99,102,241,0.25), rgba(147,51,234,0.25), rgba(99,102,241,0.25))",
                }}
              />

              <div
                className="relative flex items-center gap-2.5 p-2 sm:p-3 rounded-full backdrop-blur-2xl focus-within:ring-1 transition-all duration-300 min-h-[68px] sm:min-h-[76px]"
                style={{
                  backgroundColor: isDark ? "rgba(2,6,23,0.85)" : "rgba(255,255,255,0.95)",
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(203,213,225,0.8)",
                  boxShadow: isDark
                    ? "0 25px 50px -12px rgba(0,0,0,0.9)"
                    : "0 20px 25px -5px rgba(100,116,139,0.12), 0 8px 10px -6px rgba(100,116,139,0.08)",
                }}
              >
                {/* Search Icon */}
                <div
                  className="pl-3 sm:pl-5 transition-colors pointer-events-none"
                  style={{ color: isDark ? "#94a3b8" : "#94a3b8" }}
                >
                  <Search size={24} />
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
                    className="w-full h-full pl-2 pr-10 bg-transparent border-0 border-none outline-none text-base sm:text-lg lg:text-xl placeholder:text-slate-400 focus:outline-none focus:ring-0 focus:border-0 focus:shadow-none appearance-none font-sans font-normal"
                    style={{ color: isDark ? "#ffffff" : "#0f172a", boxShadow: "none" }}
                  />

                  {/* Voice Input */}
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 z-10">
                    <VoiceInput
                      onTranscript={(text) => {
                        setSearchQuery(text);
                      }}
                      className={`p-2.5 rounded-full transition-colors cursor-pointer ${
                        isDark ? "text-slate-400 hover:text-white hover:bg-white/10" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                      }`}
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
                        router.push(`/search?q=${encodeURIComponent(text)}`);
                      }
                    }}
                  />
                </div>

                {/* Explore CTA Button */}
                <button
                  onClick={handleSearch}
                  className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md shadow-indigo-600/30 active:scale-95 whitespace-nowrap shrink-0 transition-all duration-200 h-12 sm:h-14 px-7 sm:px-9 text-base sm:text-lg flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore</span>
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Category Quick Links with Bespoke Micro-Icons */}
          <div className="flex items-center gap-x-3 gap-y-3 text-sm sm:text-base font-normal overflow-x-auto">
            <span
              className="font-semibold flex items-center gap-1.5"
              style={{ color: isDark ? "#e2e8f0" : "#0f172a" }}
            >
              <Compass
                size={15}
                style={{ color: isDark ? "rgba(217,160,70,0.8)" : "#b45309" }}
              />
              <span>Explore</span>
            </span>
            <span style={{ color: isDark ? "#334155" : "#cbd5e1" }} className="select-none">
              ·
            </span>
            {CATEGORIES.map(({ name, icon: Icon }, idx, arr) => (
              <span key={name} className="inline-flex items-center gap-4">
                <button
                  onClick={() => {
                    setSearchQuery(name);
                    router.push(
                      `/search?q=${encodeURIComponent(name)}`,
                    );
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer group ${
                    isDark ? "hover:bg-white/10" : "hover:bg-slate-200"
                  }`}
                  style={{ color: isDark ? "#94a3b8" : "#475569" }}
                >
                  <Icon
                    size={14}
                    className="transition-colors"
                    style={{ color: isDark ? "#475569" : "#94a3b8" }}
                  />
                  <span>{name}</span>
                </button>
                {idx < arr.length - 1 && (
                  <span style={{ color: isDark ? "#334155" : "#cbd5e1" }} className="select-none">
                    ·
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
