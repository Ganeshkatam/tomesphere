"use client";

import { use, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Compass,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Flame,
  Star,
  Sparkles,
  Layers,
  Clock,
  Bookmark,
} from "lucide-react";
import { MePageDto } from "../../application/facades/MePageFacade";
import { CurrentReadingDto } from "@/modules/library/application/queries/GetCurrentReadingQuery/dto";
import { DiscoveryOverviewPageDto } from "@/modules/discovery/application/facades/DiscoveryFacade";
import BookCard from "@/modules/books/components/BookCard";

interface MeClientProps {
  data: MePageDto;
}

export function MeClient({ data }: MeClientProps) {
  const userName = data.user.email?.split("@")[0] || "Reader";

  return (
    <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 flex flex-col gap-10 sm:gap-14">
      
      {/* 1. Serene Authenticated Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
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
        </div>

        {/* Quick Nav Pills */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/library"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-400 dark:hover:border-indigo-600 text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Bookmark size={14} className="text-emerald-500" />
            <span>My Shelves</span>
          </Link>
          <Link
            href="/discover"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Compass size={14} />
            <span>Explore Catalog</span>
          </Link>
        </div>
      </section>

      {/* 2. Continue Reading (Authenticated User In-Progress Books) */}
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

        <Suspense fallback={<BooksShelfSkeleton />}>
          <ContinueReadingShelf promise={data.currentReading} />
        </Suspense>
      </section>

      {/* 3. Trending Books (Exact same clean shelf style as public page) */}
      <Suspense fallback={<BooksShelfSkeleton />}>
        <PublicSizedShelfSection
          title="Trending in Digital Archives"
          description="Popular titles our community is actively reading this week."
          icon={<Flame size={16} />}
          iconBg="bg-red-50 dark:bg-red-950/60 border-red-200/60 dark:border-red-800/60 text-red-600 dark:text-red-400"
          viewAllHref="/discover/trending"
          promiseKey="trending"
          promise={data.discovery}
        />
      </Suspense>

      {/* 4. Featured Books (Exact same clean shelf style as public page) */}
      <Suspense fallback={<BooksShelfSkeleton />}>
        <PublicSizedShelfSection
          title="Featured Masterpieces"
          description="Handpicked discoveries from the TomeSphere collection."
          icon={<Star size={16} />}
          iconBg="bg-amber-50 dark:bg-amber-950/60 border-amber-200/60 dark:border-amber-800/60 text-amber-600 dark:text-amber-400"
          viewAllHref="/discover/featured"
          promiseKey="featured"
          promise={data.discovery}
        />
      </Suspense>

      {/* 5. Recently Added (Exact same clean shelf style as public page) */}
      <Suspense fallback={<BooksShelfSkeleton />}>
        <PublicSizedShelfSection
          title="Recently Added to Archives"
          description="Fresh additions to our growing digital public domain catalog."
          icon={<Clock size={16} />}
          iconBg="bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200/60 dark:border-cyan-800/60 text-cyan-600 dark:text-cyan-400"
          viewAllHref="/discover/new"
          promiseKey="newArrivals"
          promise={data.discovery}
        />
      </Suspense>

      {/* 6. Curated Collections (Public Showcase) */}
      <Suspense fallback={<DiscoveryTabsSkeleton />}>
        <CuratedCollectionsSection promise={data.discovery} />
      </Suspense>

      {/* 7. Browse by Subject & Discipline (Public Showcase) */}
      <Suspense fallback={<DiscoveryTabsSkeleton />}>
        <SubjectsExplorerSection promise={data.discovery} />
      </Suspense>

    </div>
  );
}

// ----------------------------------------------------------------------
// Continue Reading Shelf
// ----------------------------------------------------------------------

function ContinueReadingShelf({
  promise,
}: {
  promise: Promise<CurrentReadingDto | null>;
}) {
  const result = use(promise);
  const books = result?.books || [];

  if (books.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-center gap-3 shadow-xs">
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-serif">
          You don&apos;t have any books currently in progress.
        </p>
        <Link
          href="/discover"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <span>Find a book to read</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {books.map((book) => {
        const progress = Math.min(Math.max(book.progressPercentage || 0, 0), 100);

        return (
          <Link
            key={book.bookId}
            href={`/read/${book.bookId}`}
            className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-200 group shadow-xs hover:shadow-md cursor-pointer"
          >
            <div className="w-14 sm:w-16 aspect-[2/3] rounded-lg bg-slate-200 dark:bg-slate-800 overflow-hidden relative flex-shrink-0 shadow-xs border border-slate-200/80 dark:border-slate-700/80">
              {book.coverUrl ? (
                <Image
                  src={book.coverUrl}
                  alt={book.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="64px"
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
  );
}

// ----------------------------------------------------------------------
// Public Sized Horizontal Shelf Section (Exact BookCard & scroll rows)
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

        {/* Scroll Arrows & View All */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <Link
            href={viewAllHref}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline mr-1"
          >
            See all →
          </Link>
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

      {/* Public Page BookCard Shelf with EXACT sizing */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.slice(0, 10).map((item: any) => (
            <div
              key={item.id}
              className="w-[170px] sm:w-[195px] md:w-[210px] shrink-0 snap-start flex flex-col"
            >
              <BookCard book={item} />
            </div>
          ))}
          <div className="w-[170px] sm:w-[195px] md:w-[210px] shrink-0 snap-start flex flex-col">
            <Link
              href={viewAllHref}
              className="w-full h-full min-h-[260px] rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 flex flex-col items-center justify-center p-6 text-center group transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/50"
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
// Curated Collections Showcase
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
        {collections.slice(0, 4).map((col: any) => (
          <Link
            key={col.id}
            href={`/discover/collections`}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all group shadow-xs hover:shadow-md flex flex-col justify-between cursor-pointer"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1 block">
                Archive Series
              </span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {col.name || col.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 font-serif">
                {col.description}
              </p>
            </div>
            <div className="mt-3.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-between">
              <span>{col.bookCount || 12} volumes</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// Subjects & Disciplines Explorer
// ----------------------------------------------------------------------

function SubjectsExplorerSection({
  promise,
}: {
  promise: Promise<DiscoveryOverviewPageDto>;
}) {
  const result = use(promise);
  const subjects = result?.subjects?.items || result?.genres?.items || [];

  const defaultTopics = [
    { name: "Philosophy", count: "120+ books", slug: "philosophy" },
    { name: "Mathematics", count: "85+ books", slug: "mathematics" },
    { name: "Astrophysics & Science", count: "90+ books", slug: "science" },
    { name: "Classical Literature", count: "240+ books", slug: "literature" },
    { name: "World History", count: "160+ books", slug: "history" },
    { name: "Psychology & Mind", count: "75+ books", slug: "psychology" },
  ];

  const topicsToDisplay = subjects.length > 0
    ? subjects.slice(0, 6).map((s: any) => {
        const name = typeof s === "string" ? s : s?.name || "Literature";
        const slug = typeof s === "string" ? s.toLowerCase() : s?.slug || (s?.name ? s.name.toLowerCase() : "literature");
        const count = typeof s === "object" && s?.bookCount ? `${s.bookCount}+ titles` : "20+ titles";
        return { name, slug, count };
      })
    : defaultTopics;

  return (
    <section className="space-y-3.5">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
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

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {topicsToDisplay.map((topic, i) => (
          <Link
            key={i}
            href={`/search?genre=${encodeURIComponent(topic.slug)}`}
            className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-200 group shadow-xs hover:shadow-md flex flex-col justify-between cursor-pointer"
          >
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {topic.name}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {topic.count}
              </p>
            </div>
            <div className="mt-3 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-end">
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
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

function BooksShelfSkeleton() {
  return (
    <div className="flex gap-5 overflow-hidden animate-pulse">
      <div className="w-[195px] h-64 bg-slate-200 dark:bg-slate-900 rounded-2xl shrink-0" />
      <div className="w-[195px] h-64 bg-slate-200 dark:bg-slate-900 rounded-2xl shrink-0" />
      <div className="w-[195px] h-64 bg-slate-200 dark:bg-slate-900 rounded-2xl shrink-0" />
      <div className="w-[195px] h-64 bg-slate-200 dark:bg-slate-900 rounded-2xl shrink-0" />
    </div>
  );
}

function DiscoveryTabsSkeleton() {
  return (
    <div className="h-32 bg-slate-200 dark:bg-slate-900 rounded-xl animate-pulse" />
  );
}
