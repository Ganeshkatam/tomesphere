"use client";

import { use, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  BookOpen,
  Bookmark,
  Compass,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { MePageDto } from "../../application/facades/MePageFacade";
import { CurrentReadingDto } from "@/modules/library/application/queries/GetCurrentReadingQuery/dto";
import { LibrarySnapshotDto } from "@/modules/library/application/queries/GetLibrarySnapshotQuery/dto";
import { DiscoveryOverviewPageDto } from "@/modules/discovery/application/facades/DiscoveryFacade";

interface MeClientProps {
  data: MePageDto;
}

export function MeClient({ data }: MeClientProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12 flex flex-col gap-12 sm:gap-16">

      {/* 1. Explore Something New — Serene Search Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-xs transition-colors duration-200 text-center flex flex-col items-center">
        <div className="max-w-2xl mx-auto w-full">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold mb-4">
            <Compass size={14} className="text-indigo-500" />
            <span>Digital Library Sanctuary</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight mb-3">
            Explore something new
          </h1>
          <p className="text-sm sm:text-base font-serif text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto leading-relaxed">
            Search our curated digital archives of timeless classics, philosophical treatises, and literary masterpieces.
          </p>

          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xl mx-auto">
            <div className="relative flex items-center">
              <Search
                size={20}
                className="absolute left-4 text-slate-400 dark:text-slate-500 pointer-events-none"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search books, authors, subjects..."
                className="w-full h-13 pl-12 pr-28 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Subject Tags */}
          <div className="flex items-center justify-center gap-2 flex-wrap mt-6 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold">Popular:</span>
            {["Philosophy", "Literature", "History", "Science", "Essays"].map((tag) => (
              <Link
                key={tag}
                href={`/search?genre=${encodeURIComponent(tag.toLowerCase())}`}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700/60 transition-colors font-medium"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Continue Reading */}
      <section className="space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <BookOpen size={18} />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
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

      {/* 3. Your Library */}
      <section className="space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Bookmark size={18} />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
                Your Library
              </h2>
            </div>
          </div>
          <Link
            href="/library"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
          >
            <span>Manage Shelves</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <Suspense fallback={<LibraryOverviewSkeleton />}>
          <YourLibrarySection promise={data.librarySnapshot} />
        </Suspense>
      </section>

      {/* 4. Discover Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-200/60 dark:border-purple-800/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Compass size={18} />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
                Discover
              </h2>
            </div>
          </div>
          <Link
            href="/discover"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
          >
            <span>Explore All</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <Suspense fallback={<DiscoveryTabsSkeleton />}>
          <DiscoverShowcase promise={data.discovery} />
        </Suspense>
      </section>

    </div>
  );
}

// ----------------------------------------------------------------------
// Sub-components
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
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-center gap-3">
        <p className="text-sm text-slate-500 dark:text-slate-400 font-serif">
          You don&apos;t have any books currently in progress.
        </p>
        <Link
          href="/discover"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs"
        >
          <span>Find a book to read</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {books.map((book) => {
        const progress = Math.min(Math.max(book.progressPercentage || 0, 0), 100);

        return (
          <Link
            key={book.bookId}
            href={`/read/${book.bookId}`}
            className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-200 group shadow-xs hover:shadow-md"
          >
            <div className="w-16 h-22 rounded-xl bg-slate-200 dark:bg-slate-800 overflow-hidden relative flex-shrink-0 shadow-xs border border-slate-200/80 dark:border-slate-700/80">
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
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 mb-2.5">
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

function YourLibrarySection({
  promise,
}: {
  promise: Promise<LibrarySnapshotDto | null>;
}) {
  const result = use(promise);
  const wantToRead = result?.wantToReadCount ?? 0;
  const reading = result?.currentlyReadingCount ?? 0;
  const finished = result?.finishedCount ?? 0;
  const total = wantToRead + reading + finished;
  const covers = result?.recentCovers || [];

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">

      {/* 3 Shelves Metrics */}
      <div className="grid grid-cols-3 gap-3 w-full md:w-auto flex-1 max-w-xl">
        <Link
          href="/library?status=want_to_read"
          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50/50 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 transition-colors text-center"
        >
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Want to Read
          </div>
          <div className="text-2xl font-display font-extrabold text-slate-900 dark:text-white">
            {wantToRead}
          </div>
        </Link>

        <Link
          href="/library?status=reading"
          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50/50 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 transition-colors text-center"
        >
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Reading
          </div>
          <div className="text-2xl font-display font-extrabold text-slate-900 dark:text-white">
            {reading}
          </div>
        </Link>

        <Link
          href="/library?status=finished"
          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50/50 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 transition-colors text-center"
        >
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Finished
          </div>
          <div className="text-2xl font-display font-extrabold text-slate-900 dark:text-white">
            {finished}
          </div>
        </Link>
      </div>

      {/* Recent Covers Strip */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-slate-800">
        {covers.length > 0 ? (
          <div className="flex items-center gap-2">
            {covers.slice(0, 4).map((cov, i) => (
              <div
                key={i}
                className="w-11 h-16 rounded-lg bg-slate-200 dark:bg-slate-800 overflow-hidden relative flex-shrink-0 border border-slate-200 dark:border-slate-700 shadow-xs"
              >
                <Image
                  src={cov}
                  alt="Saved book"
                  fill
                  className="object-cover"
                  sizes="44px"
                />
              </div>
            ))}
          </div>
        ) : (
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {total} titles in your collection
          </span>
        )}

        <Link
          href="/library"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors ml-2"
        >
          <span>Open Shelves</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}

function DiscoverShowcase({
  promise,
}: {
  promise: Promise<DiscoveryOverviewPageDto>;
}) {
  const result = use(promise);
  const featured = result?.featured?.items || [];
  const trending = result?.trending?.books || [];
  const collections = result?.collections?.items || [];

  return (
    <div className="space-y-8">
      {/* Featured Shelf */}
      {featured.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Featured Selections
            </h3>
            <Link
              href="/discover/featured"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              See all →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
            {featured.slice(0, 6).map((book: any) => (
              <Link
                key={book.id}
                href={`/book/${book.id}`}
                className="flex flex-col p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-200 group shadow-xs hover:shadow-md"
              >
                <div className="w-full aspect-[3/4] rounded-xl bg-slate-200 dark:bg-slate-800 overflow-hidden relative mb-2 shadow-xs">
                  {book.coverUrl ? (
                    <Image
                      src={book.coverUrl}
                      alt={book.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, 16vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <BookOpen size={24} />
                    </div>
                  )}
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                  {book.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                  {book.author}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Trending Shelf */}
      {trending.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Trending in Digital Archives
            </h3>
            <Link
              href="/discover/trending"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              See all →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
            {trending.slice(0, 6).map((book: any) => (
              <Link
                key={book.id}
                href={`/book/${book.id}`}
                className="flex flex-col p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-200 group shadow-xs hover:shadow-md"
              >
                <div className="w-full aspect-[3/4] rounded-xl bg-slate-200 dark:bg-slate-800 overflow-hidden relative mb-2 shadow-xs">
                  {book.coverUrl ? (
                    <Image
                      src={book.coverUrl}
                      alt={book.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, 16vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <BookOpen size={24} />
                    </div>
                  )}
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                  {book.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                  {book.author}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Curated Collections Shelf */}
      {collections.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Curated Collections
            </h3>
            <Link
              href="/discover/collections"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              All collections →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {collections.slice(0, 4).map((col: any) => (
              <Link
                key={col.id}
                href={`/discover/collections`}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all group shadow-xs hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1 block">
                    Curated Collection
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {col.name || col.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {col.description}
                  </p>
                </div>
                <div className="mt-3 text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center justify-between">
                  <span>{col.bookCount || 12} volumes</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BooksShelfSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-pulse">
      <div className="h-28 bg-slate-200 dark:bg-slate-900 rounded-2xl" />
      <div className="h-28 bg-slate-200 dark:bg-slate-900 rounded-2xl" />
      <div className="h-28 bg-slate-200 dark:bg-slate-900 rounded-2xl" />
    </div>
  );
}

function LibraryOverviewSkeleton() {
  return (
    <div className="h-32 bg-slate-200 dark:bg-slate-900 rounded-3xl animate-pulse" />
  );
}

function DiscoveryTabsSkeleton() {
  return (
    <div className="h-64 bg-slate-200 dark:bg-slate-900 rounded-3xl animate-pulse" />
  );
}
