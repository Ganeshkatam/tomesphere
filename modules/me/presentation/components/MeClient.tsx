"use client";

import { use, useState, useRef, useEffect, Suspense, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Compass,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Star,
  Layers,
  Clock,
  Sparkles,
  Brain,
  Atom,
  Feather,
  Landmark,
  Scroll,
  Palette,
  Gem,
  BookmarkCheck,
  Telescope,
  HeartHandshake,
  Lightbulb,
  PlusCircle,
  Loader2,
} from "lucide-react";
import { MePageDto } from "../../application/facades/MePageFacade";
import { CurrentReadingDto } from "@/modules/library/application/queries/GetCurrentReadingQuery/dto";
import { DiscoveryOverviewPageDto } from "@/modules/discovery/application/facades/DiscoveryFacade";
import BookCard from "@/modules/books/components/BookCard";
import MeHeroSection from "./MeHeroSection";
import UserStatisticsWidget from "./UserStatisticsWidget";

interface MeClientProps {
  data: MePageDto;
}

// ----------------------------------------------------------------------
// Lazy Section Wrapper using IntersectionObserver
// ----------------------------------------------------------------------

function LazySection({
  children,
  fallback,
  rootMargin = "120px",
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={containerRef} className="w-full transition-opacity duration-700">
      {isVisible ? children : (fallback || <BooksShelfSkeleton />)}
    </div>
  );
}

// ----------------------------------------------------------------------
// Main Authenticated Home View (5-7 Initial, Remaining On-Demand)
// ----------------------------------------------------------------------

export function MeClient({ data }: MeClientProps) {
  const rawName =
    data.user.name ||
    data.user.displayName ||
    (data.user.email ? data.user.email.split("@")[0].replace(/[0-9._-]+/g, " ").trim() : "Reader") ||
    "Reader";

  const userName =
    rawName
      .split(" ")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(" ") || "Reader";

  // Progressive On-Demand Stream Management (loads remaining sections individually on user scroll/demand)
  const [loadedExtraSections, setLoadedExtraSections] = useState(0);
  const TOTAL_EXTRA_SECTIONS = 14;
  const bottomTriggerRef = useRef<HTMLDivElement>(null);
  const [isLoadingNext, setIsLoadingNext] = useState(false);

  const loadNextSection = useCallback(() => {
    if (loadedExtraSections < TOTAL_EXTRA_SECTIONS && !isLoadingNext) {
      setIsLoadingNext(true);
      setTimeout(() => {
        setLoadedExtraSections((prev) => Math.min(prev + 1, TOTAL_EXTRA_SECTIONS));
        setIsLoadingNext(false);
      }, 350);
    }
  }, [loadedExtraSections, isLoadingNext]);

  useEffect(() => {
    const el = bottomTriggerRef.current;
    if (!el || loadedExtraSections >= TOTAL_EXTRA_SECTIONS) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadNextSection();
        }
      },
      { rootMargin: "80px", threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loadedExtraSections, loadNextSection]);

  return (
    <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 flex flex-col gap-8 sm:gap-10">

      {/* 1. Header with greeting */}
      <section>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
          <Sparkles size={13} />
          <span>Reader Sanctuary</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
          Welcome back, {userName}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-serif mt-0.5">
          Explore curated public domain archives, resume your reading, and discover timeless literature.
        </p>
      </section>

      {/* User Statistics Widget */}
      <Suspense fallback={null}>
        <UserStatisticsWidget promise={data.userStatistics} />
      </Suspense>

      {/* 2. Billboard Spotlight Hero & Top Trending Carousel Showcase (Initial) */}
      <Suspense fallback={<NetflixTrendingSkeleton />}>
        <MeHeroSection promise={data.discovery} />
      </Suspense>

      {/* 3. Continue Reading (Rendered ONLY when user has active reading progress) (Initial) */}
      <Suspense fallback={null}>
        <ContinueReadingSection promise={data.currentReading} />
      </Suspense>

      {/* 4. Personalized Selection: Recommended For Your Sanctuary (Initial) */}
      <LazySection fallback={<BooksShelfSkeleton />}>
        <Suspense fallback={<BooksShelfSkeleton />}>
          <PersonalizedRecommendationsSection
            userName={userName}
            promise={data.discovery}
          />
        </Suspense>
      </LazySection>

      {/* 5. Featured Masterpieces (Initial) */}
      <LazySection fallback={<BooksShelfSkeleton />}>
        <Suspense fallback={<BooksShelfSkeleton />}>
          <PublicSizedShelfSection
            title="Featured Masterpieces"
            description="Handpicked literary discoveries from the TomeSphere collection."
            icon={<Star size={16} />}
            iconBg="bg-amber-50 dark:bg-amber-950/60 border-amber-200/60 dark:border-amber-800/60 text-amber-600 dark:text-amber-400"
            viewAllHref="/discover/featured"
            promiseKey="featured"
            promise={data.discovery}
          />
        </Suspense>
      </LazySection>

      {/* 6. Recently Added to Public Archives (Initial) */}
      <LazySection fallback={<BooksShelfSkeleton />}>
        <Suspense fallback={<BooksShelfSkeleton />}>
          <PublicSizedShelfSection
            title="Recently Added to Archives"
            description="Fresh additions to our growing digital catalog."
            icon={<Clock size={16} />}
            iconBg="bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200/60 dark:border-cyan-800/60 text-cyan-600 dark:text-cyan-400"
            viewAllHref="/discover/new"
            promiseKey="newArrivals"
            promise={data.discovery}
          />
        </Suspense>
      </LazySection>

      {/* 7. Curated Collections & Anthologies (Initial) */}
      <LazySection fallback={<DiscoveryTabsSkeleton />}>
        <Suspense fallback={<DiscoveryTabsSkeleton />}>
          <CuratedCollectionsSection promise={data.discovery} />
        </Suspense>
      </LazySection>

      {/* ------------------------------------------------------------- */}
      {/* On-Demand Progressive Shelves (Streamed individually on demand) */}
      {/* ------------------------------------------------------------- */}

      {/* Extra 1: Timeless Philosophy & Mind */}
      {loadedExtraSections >= 1 && (
        <LazySection fallback={<BooksShelfSkeleton />}>
          <Suspense fallback={<BooksShelfSkeleton />}>
            <CuratedDisciplineShelfSection
              title="Timeless Philosophy & Mind"
              description="Essential treatises on ethics, stoicism, logic, and human consciousness."
              icon={<Brain size={16} />}
              iconBg="bg-purple-50 dark:bg-purple-950/60 border-purple-200/60 dark:border-purple-800/60 text-purple-600 dark:text-purple-400"
              genre="Philosophy"
              offset={0}
              promise={data.discovery}
            />
          </Suspense>
        </LazySection>
      )}

      {/* Extra 2: Scientific Pioneers & Mathematics */}
      {loadedExtraSections >= 2 && (
        <LazySection fallback={<BooksShelfSkeleton />}>
          <Suspense fallback={<BooksShelfSkeleton />}>
            <CuratedDisciplineShelfSection
              title="Scientific Pioneers & Mathematics"
              description="Landmark discoveries that shaped modern physics, astronomy, and mathematics."
              icon={<Atom size={16} />}
              iconBg="bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/60 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400"
              genre="Science"
              offset={1}
              promise={data.discovery}
            />
          </Suspense>
        </LazySection>
      )}

      {/* Extra 3: Classical Literature & Masterpieces */}
      {loadedExtraSections >= 3 && (
        <LazySection fallback={<BooksShelfSkeleton />}>
          <Suspense fallback={<BooksShelfSkeleton />}>
            <CuratedDisciplineShelfSection
              title="Classical Literature & Masterpieces"
              description="Enduring poetry, dramatic works, and iconic epics preserved through ages."
              icon={<Feather size={16} />}
              iconBg="bg-rose-50 dark:bg-rose-950/60 border-rose-200/60 dark:border-rose-800/60 text-rose-600 dark:text-rose-400"
              genre="Literature"
              offset={2}
              promise={data.discovery}
            />
          </Suspense>
        </LazySection>
      )}

      {/* Extra 4: Poetry, Odes & Sonnets */}
      {loadedExtraSections >= 4 && (
        <LazySection fallback={<BooksShelfSkeleton />}>
          <Suspense fallback={<BooksShelfSkeleton />}>
            <CuratedDisciplineShelfSection
              title="Poetry, Odes & Sonnets"
              description="Lyrical verse, romantic odes, and timeless sonnets from world-renowned poets."
              icon={<Scroll size={16} />}
              iconBg="bg-rose-50 dark:bg-rose-950/60 border-rose-200/60 dark:border-rose-800/60 text-rose-600 dark:text-rose-400"
              genre="Poetry"
              offset={3}
              promise={data.discovery}
            />
          </Suspense>
        </LazySection>
      )}

      {/* Extra 5: Short Reads & Quick Explorations */}
      {loadedExtraSections >= 5 && (
        <LazySection fallback={<BooksShelfSkeleton />}>
          <Suspense fallback={<BooksShelfSkeleton />}>
            <CuratedDisciplineShelfSection
              title="Short Reads & Quick Explorations"
              description="Concise essays, compact treatises, and illuminating short works under 120 pages."
              icon={<Lightbulb size={16} />}
              iconBg="bg-amber-50 dark:bg-amber-950/60 border-amber-200/60 dark:border-amber-800/60 text-amber-600 dark:text-amber-400"
              genre="Short"
              offset={3}
              promise={data.discovery}
            />
          </Suspense>
        </LazySection>
      )}

      {/* Extra 6: Historical Chronicles & Ancient Civilizations */}
      {loadedExtraSections >= 6 && (
        <LazySection fallback={<BooksShelfSkeleton />}>
          <Suspense fallback={<BooksShelfSkeleton />}>
            <CuratedDisciplineShelfSection
              title="Historical Chronicles & Civilizations"
              description="Firsthand accounts, classical histories, and accounts of empires."
              icon={<Landmark size={16} />}
              iconBg="bg-blue-50 dark:bg-blue-950/60 border-blue-200/60 dark:border-blue-800/60 text-blue-600 dark:text-blue-400"
              genre="History"
              offset={4}
              promise={data.discovery}
            />
          </Suspense>
        </LazySection>
      )}

      {/* Extra 7: Psychology, Cognition & Human Nature */}
      {loadedExtraSections >= 7 && (
        <LazySection fallback={<BooksShelfSkeleton />}>
          <Suspense fallback={<BooksShelfSkeleton />}>
            <CuratedDisciplineShelfSection
              title="Psychology & The Human Condition"
              description="Pioneering explorations into behavior, dreams, memory, and perception."
              icon={<HeartHandshake size={16} />}
              iconBg="bg-pink-50 dark:bg-pink-950/60 border-pink-200/60 dark:border-pink-800/60 text-pink-600 dark:text-pink-400"
              genre="Psychology"
              offset={5}
              promise={data.discovery}
            />
          </Suspense>
        </LazySection>
      )}

      {/* Extra 8: Art, Architecture & Aesthetic Theory */}
      {loadedExtraSections >= 8 && (
        <LazySection fallback={<BooksShelfSkeleton />}>
          <Suspense fallback={<BooksShelfSkeleton />}>
            <CuratedDisciplineShelfSection
              title="Art, Architecture & Aesthetics"
              description="Treatises on visual arts, Renaissance sculpture, drafting, and artistic theory."
              icon={<Palette size={16} />}
              iconBg="bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200/60 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400"
              genre="Art"
              offset={6}
              promise={data.discovery}
            />
          </Suspense>
        </LazySection>
      )}

      {/* Extra 9: Astronomy & Celestial Observation */}
      {loadedExtraSections >= 9 && (
        <LazySection fallback={<BooksShelfSkeleton />}>
          <Suspense fallback={<BooksShelfSkeleton />}>
            <CuratedDisciplineShelfSection
              title="Astronomy & The Cosmos"
              description="Historic star charts, planetary treatises, and early cosmos observations."
              icon={<Telescope size={16} />}
              iconBg="bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200/60 dark:border-cyan-800/60 text-cyan-600 dark:text-cyan-400"
              genre="Astronomy"
              offset={7}
              promise={data.discovery}
            />
          </Suspense>
        </LazySection>
      )}

      {/* Extra 10: Mythology, Folklore & Ancient Sagas */}
      {loadedExtraSections >= 10 && (
        <LazySection fallback={<BooksShelfSkeleton />}>
          <Suspense fallback={<BooksShelfSkeleton />}>
            <CuratedDisciplineShelfSection
              title="Mythology & Ancient Sagas"
              description="Epic lore, folklore traditions, and timeless heroic mythologies of world cultures."
              icon={<Scroll size={16} />}
              iconBg="bg-orange-50 dark:bg-orange-950/60 border-orange-200/60 dark:border-orange-800/60 text-orange-600 dark:text-orange-400"
              genre="Mythology"
              offset={8}
              promise={data.discovery}
            />
          </Suspense>
        </LazySection>
      )}

      {/* Extra 11: Archivist Picks: Hidden Gems */}
      {loadedExtraSections >= 11 && (
        <LazySection fallback={<BooksShelfSkeleton />}>
          <Suspense fallback={<BooksShelfSkeleton />}>
            <CuratedDisciplineShelfSection
              title="Archivist's Choice: Hidden Gems"
              description="Lesser-known rare gems and overlooked treasures from deep digital vaults."
              icon={<Gem size={16} />}
              iconBg="bg-violet-50 dark:bg-violet-950/60 border-violet-200/60 dark:border-violet-800/60 text-violet-600 dark:text-violet-400"
              genre="Rare"
              offset={9}
              promise={data.discovery}
            />
          </Suspense>
        </LazySection>
      )}

      {/* Extra 12: Community Favorites & Heavily Bookmarked */}
      {loadedExtraSections >= 12 && (
        <LazySection fallback={<BooksShelfSkeleton />}>
          <Suspense fallback={<BooksShelfSkeleton />}>
            <CuratedDisciplineShelfSection
              title="Community Favorites & Saved Classics"
              description="The most frequently saved and bookmarked public domain works across our readers."
              icon={<BookmarkCheck size={16} />}
              iconBg="bg-teal-50 dark:bg-teal-950/60 border-teal-200/60 dark:border-teal-800/60 text-teal-600 dark:text-teal-400"
              genre="Popular"
              offset={10}
              promise={data.discovery}
            />
          </Suspense>
        </LazySection>
      )}

      {/* Extra 13: Explore by Discipline & Subject Chips */}
      {loadedExtraSections >= 13 && (
        <LazySection fallback={<DiscoveryTabsSkeleton />}>
          <Suspense fallback={<DiscoveryTabsSkeleton />}>
            <SubjectsExplorerSection promise={data.discovery} />
          </Suspense>
        </LazySection>
      )}

      {/* Progressive Stream Bottom Trigger / Load More Bar */}
      {loadedExtraSections < TOTAL_EXTRA_SECTIONS && (
        <div
          ref={bottomTriggerRef}
          className="w-full py-8 flex flex-col items-center justify-center gap-3 border-t border-slate-200/60 dark:border-slate-800/60 mt-4"
        >
          <button
            onClick={loadNextSection}
            disabled={isLoadingNext}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-bold transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-60"
          >
            {isLoadingNext ? (
              <>
                <Loader2 size={14} className="animate-spin text-indigo-600" />
                <span>Loading Curated Shelf...</span>
              </>
            ) : (
              <>
                <PlusCircle size={14} className="text-indigo-600 dark:text-indigo-400" />
                <span>Explore More Archive Shelves ({TOTAL_EXTRA_SECTIONS - loadedExtraSections} remaining)</span>
              </>
            )}
          </button>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-serif">
            Scroll down slowly to stream additional curated public archives
          </p>
        </div>
      )}

    </div>
  );
}

// ----------------------------------------------------------------------
// 3. Continue Reading Section
// ----------------------------------------------------------------------

function ContinueReadingSection({
  promise,
}: {
  promise: Promise<CurrentReadingDto | null>;
}) {
  const result = use(promise);
  const books = result?.books || [];

  if (books.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-xs">
            <BookOpen size={16} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              Continue Reading
            </h2>
          </div>
        </div>
        <Link
          href="/library"
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
        >
          <span>All Books</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book) => {
          const progress = Math.min(Math.max(book.progressPercentage || 0, 0), 100);

          return (
            <Link
              key={book.bookId}
              href={`/read/${book.bookId}`}
              className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-300 group shadow-xs hover:shadow-xl hover:scale-[1.02] cursor-pointer"
            >
              <div className="w-14 sm:w-16 aspect-[2/3] rounded-lg bg-slate-200 dark:bg-slate-800 overflow-hidden relative flex-shrink-0 shadow-xs border border-slate-200/80 dark:border-slate-700/80">
                {book.coverUrl ? (
                  <Image
                    src={book.coverUrl}
                    alt={book.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="64px"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <BookOpen size={20} />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                  {book.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 mb-2">
                  {book.author}
                </p>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    <span>{Math.round(progress)}% read</span>
                    <span className="text-indigo-600 dark:text-indigo-400 group-hover:underline">
                      Resume →
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// 4. Personalized Recommendations Section
// ----------------------------------------------------------------------

function PersonalizedRecommendationsSection({
  userName,
  promise,
}: {
  userName: string;
  promise: Promise<DiscoveryOverviewPageDto>;
}) {
  const result = use(promise);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Combine and shuffle curated items for a distinct personalized experience
  const recommendedItems = useMemo(() => {
    const featured = result?.featured?.items || [];
    const trending = result?.trending?.books || [];
    const pool = [...featured.slice(2), ...trending.slice(3)];
    const seen = new Set<string>();
    const unique = pool.filter((book) => {
      const id = book?.id;
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    });
    return unique.slice(0, 8);
  }, [result]);

  if (recommendedItems.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg border flex items-center justify-center shadow-xs bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200/60 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400">
              <Sparkles size={16} />
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              Curated For You
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Personalized algorithmic recommendations based on your reading affinities.
          </p>
        </div>

        {/* Scroll Arrows */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-xs"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-xs"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto py-2 px-1 no-scrollbar scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {recommendedItems.map((item: any, idx: number) => (
            <div
              key={`personalized-${item.id || idx}-${idx}`}
              className="w-[130px] min-[400px]:w-[145px] sm:w-[170px] md:w-[190px] lg:w-[205px] xl:w-[215px] shrink-0 snap-start flex flex-col group/item transition-all duration-300 relative hover:z-50"
            >
              <BookCard book={item} priority={idx < 5} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// 5, 6. Public Sized Horizontal Shelf Section
// ----------------------------------------------------------------------

interface PublicSizedShelfSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  viewAllHref: string;
  promiseKey: "featured" | "trending" | "newArrivals";
  promise: Promise<DiscoveryOverviewPageDto>;
}

function PublicSizedShelfSection({
  title,
  description,
  icon,
  iconBg,
  viewAllHref,
  promiseKey,
  promise,
}: PublicSizedShelfSectionProps) {
  const result = use(promise);
  const rawItems =
    promiseKey === "featured"
      ? result?.featured?.items
      : promiseKey === "trending"
        ? result?.trending?.books
        : result?.newArrivals?.items;

  const items = rawItems || [];
  const scrollRef = useRef<HTMLDivElement>(null);

  if (items.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shadow-xs ${iconBg}`}>
              {icon}
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              {title}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {description}
          </p>
        </div>

        {/* Scroll Arrows */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            onClick={() => scroll("left")}
            aria-label={`Scroll ${title} left`}
            className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-xs"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label={`Scroll ${title} right`}
            className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-xs"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Adaptive BookCard Shelf */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto py-2 px-1 no-scrollbar scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.slice(0, 10).map((item: any, idx: number) => (
            <div
              key={`shelf-${promiseKey}-${item.id || idx}-${idx}`}
              className="w-[130px] min-[400px]:w-[145px] sm:w-[170px] md:w-[190px] lg:w-[205px] xl:w-[215px] shrink-0 snap-start flex flex-col group/item transition-all duration-300 relative hover:z-50"
            >
              <BookCard book={item} />
            </div>
          ))}
          <div className="w-[130px] min-[400px]:w-[145px] sm:w-[170px] md:w-[190px] lg:w-[205px] xl:w-[215px] shrink-0 snap-start flex flex-col">
            <Link
              href={viewAllHref}
              className="w-full h-full min-h-[220px] sm:min-h-[260px] rounded-xl sm:rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 flex flex-col items-center justify-center p-4 sm:p-6 text-center group transition-all duration-300 hover:scale-[1.03] hover:shadow-lg cursor-pointer bg-slate-50/50 dark:bg-slate-900/50"
            >
              <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform mb-3">
                <ArrowRight size={20} />
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                View All {title}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Explore entire archive
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// Reusable Curated Discipline & Category Shelf
// ----------------------------------------------------------------------

function CuratedDisciplineShelfSection({
  title,
  description,
  icon,
  iconBg,
  genre,
  offset = 0,
  promise,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  genre: string;
  offset?: number;
  promise: Promise<DiscoveryOverviewPageDto>;
}) {
  const result = use(promise);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filter or smartly slice diverse books with offset rotation
  const disciplineBooks = useMemo(() => {
    const rawBooks = [
      ...(result?.featured?.items || []),
      ...(result?.trending?.books || []),
      ...(result?.newArrivals?.items || []),
    ];
    const seen = new Set<string>();
    const allBooks = rawBooks.filter((book) => {
      const id = book?.id;
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    });

    const matched = allBooks.filter((b) =>
      b.genres?.some((g: any) =>
        (typeof g === "string" ? g : g.name)
          .toLowerCase()
          .includes(genre.toLowerCase())
      )
    );

    if (matched.length >= 3) {
      return matched.slice(0, 8);
    }

    // Diverse rotated slice so each distinct shelf shows distinct books
    const start = (offset * 2) % Math.max(1, allBooks.length);
    const rotated = [...allBooks.slice(start), ...allBooks.slice(0, start)];
    return rotated.slice(0, 8);
  }, [result, genre, offset]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shadow-xs ${iconBg}`}>
              {icon}
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              {title}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {description}
          </p>
        </div>

        {/* Scroll Arrows */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            onClick={() => scroll("left")}
            aria-label={`Scroll ${title} left`}
            className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-xs"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label={`Scroll ${title} right`}
            className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-xs"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto py-2 px-1 no-scrollbar scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {disciplineBooks.map((item: any, i: number) => (
            <div
              key={`discipline-${genre}-${item.id || i}-${i}`}
              className="w-[130px] min-[400px]:w-[145px] sm:w-[170px] md:w-[190px] lg:w-[205px] xl:w-[215px] shrink-0 snap-start flex flex-col group/item transition-all duration-300 relative hover:z-50"
            >
              <BookCard book={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// 7. Curated Collections Showcase
// ----------------------------------------------------------------------

function CuratedCollectionsSection({
  promise,
}: {
  promise: Promise<DiscoveryOverviewPageDto>;
}) {
  const result = use(promise);
  const collections = result?.collections?.items || [];

  if (collections.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-200/60 dark:border-purple-800/60 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-xs">
            <Compass size={16} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              Curated Collections & Anthologies
            </h2>
          </div>
        </div>
        <Link
          href="/discover/collections"
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
        >
          <span>All collections</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {collections.slice(0, 4).map((col: any, i: number) => (
          <Link
            key={`collection-${col.id || i}-${i}`}
            href={`/discover/collections`}
            className="p-5 rounded-2xl bg-gradient-to-br from-white via-slate-50/70 to-slate-100/50 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 border border-slate-200/80 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 group shadow-xs hover:shadow-2xl flex flex-col justify-between cursor-pointer"
          >
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-1.5 block">
                Archive Series
              </span>
              <h4 className="font-display font-bold text-base text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {col.name || col.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1.5 font-serif leading-relaxed">
                {col.description}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-between">
              <span>{col.bookCount || 12} volumes</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}



// ----------------------------------------------------------------------
// Subjects & Disciplines Explorer Chips
// ----------------------------------------------------------------------

function SubjectsExplorerSection({
  promise,
}: {
  promise: Promise<DiscoveryOverviewPageDto>;
}) {
  const result = use(promise);
  const subjects = result?.subjects?.items || result?.genres?.items || [];

  const defaultTopics = [
    { name: "Philosophy", count: "120+ books", slug: "philosophy", gradient: "from-purple-500 to-indigo-600" },
    { name: "Mathematics", count: "85+ books", slug: "mathematics", gradient: "from-blue-500 to-cyan-600" },
    { name: "Science & Physics", count: "90+ books", slug: "science", gradient: "from-emerald-500 to-teal-600" },
    { name: "Classical Literature", count: "240+ books", slug: "literature", gradient: "from-rose-500 to-orange-600" },
    { name: "World History", count: "160+ books", slug: "history", gradient: "from-amber-500 to-yellow-600" },
    { name: "Mind & Psychology", count: "75+ books", slug: "psychology", gradient: "from-indigo-500 to-purple-600" },
  ];

  const topicsToDisplay = subjects.length > 0
    ? subjects.slice(0, 6).map((s: any, idx: number) => {
      const name = typeof s === "string" ? s : s?.name || "Literature";
      const slug = typeof s === "string" ? s.toLowerCase() : s?.slug || (s?.name ? s.name.toLowerCase() : "literature");
      const count = typeof s === "object" && s?.bookCount ? `${s.bookCount}+ titles` : "20+ titles";
      const defaultGrad = defaultTopics[idx % defaultTopics.length].gradient;
      return { name, slug, count, gradient: defaultGrad };
    })
    : defaultTopics;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xs">
            <Layers size={16} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              Explore by Discipline & Subject
            </h2>
          </div>
        </div>
        <Link
          href="/discover"
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
        >
          <span>Catalog index</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-2 min-[400px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {topicsToDisplay.map((topic, i) => (
          <Link
            key={`subject-pill-${topic.slug || i}-${i}`}
            href={`/search?genre=${encodeURIComponent(topic.slug)}`}
            className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 p-4 transition-all duration-300 hover:scale-[1.04] hover:-translate-y-1 shadow-xs hover:shadow-xl flex flex-col justify-between cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-tr ${topic.gradient} shadow-xs group-hover:scale-125 transition-transform`} />
              <ArrowRight size={12} className="text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div>
              <h4 className="font-display font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {topic.name}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {topic.count}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// Skeletons
// ----------------------------------------------------------------------

function NetflixTrendingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-64 sm:h-80 bg-slate-200 dark:bg-slate-900 rounded-3xl" />
      <div className="h-36 bg-slate-200 dark:bg-slate-900 rounded-2xl" />
    </div>
  );
}

function BooksShelfSkeleton() {
  return (
    <div className="flex gap-5 overflow-hidden animate-pulse">
      <div className="w-[145px] sm:w-[195px] h-64 bg-slate-200 dark:bg-slate-900 rounded-2xl shrink-0" />
      <div className="w-[145px] sm:w-[195px] h-64 bg-slate-200 dark:bg-slate-900 rounded-2xl shrink-0" />
      <div className="w-[145px] sm:w-[195px] h-64 bg-slate-200 dark:bg-slate-900 rounded-2xl shrink-0" />
      <div className="w-[145px] sm:w-[195px] h-64 bg-slate-200 dark:bg-slate-900 rounded-2xl shrink-0" />
    </div>
  );
}

function DiscoveryTabsSkeleton() {
  return (
    <div className="h-32 bg-slate-200 dark:bg-slate-900 rounded-xl animate-pulse" />
  );
}
