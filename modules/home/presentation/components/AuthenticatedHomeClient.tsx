import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import {
  BookOpen,
  Bookmark,
  BarChart3,
  Compass,
  ArrowRight,
  Sparkles,
  Flame,
  Search,
  CheckCircle2,
} from "lucide-react";
import { HomePageDto } from "../../application/facades/HomePageFacade";

interface AuthenticatedHomeClientProps {
  data: HomePageDto;
}

export function AuthenticatedHomeClient({ data }: AuthenticatedHomeClientProps) {
  const displayName =
    data.user.email?.split("@")[0] ||
    "Reader";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12 flex flex-col gap-10">
        
        {/* Welcome Header */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-3">
              <Sparkles size={13} />
              <span>Personal Reading Sanctuary</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome back, {displayName}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-1.5 font-serif max-w-2xl">
              Immerse yourself in digital literature, track your intellectual milestones, and explore timeless archival treasures.
            </p>
          </div>

          {/* Quick Hub Navigation */}
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/library"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-sm font-semibold hover:border-indigo-500 transition-colors shadow-xs"
            >
              <Bookmark size={16} className="text-indigo-500" />
              <span>My Library</span>
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-sm font-semibold hover:border-indigo-500 transition-colors shadow-xs"
            >
              <BarChart3 size={16} className="text-purple-500" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-all shadow-md shadow-indigo-500/20"
            >
              <Compass size={16} />
              <span>Browse Catalog</span>
            </Link>
          </div>
        </section>

        {/* Hero Active Reading Section */}
        <Suspense fallback={<HeroActiveSkeleton />}>
          <HeroActiveSection promise={data.continueReading} />
        </Suspense>

        {/* 3 Main Workspace Portals */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/library"
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-200 group shadow-xs hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 group-hover:scale-105 transition-transform">
                <Bookmark size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                Your Bookshelves
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Organize your reading list, want-to-read stack, and completed classics.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <span>Open Library</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/dashboard"
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-200 group shadow-xs hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200/60 dark:border-purple-800/60 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4 group-hover:scale-105 transition-transform">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                Reading Dashboard
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Track reading streaks, daily goals, 7-day habit heatmap, and lifetime milestones.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400">
              <span>View Dashboard</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/discover"
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-200 group shadow-xs hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
                <Compass size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                Digital Catalog
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Discover trending literature, curated anthologies, and philosophy manuscripts.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>Discover Books</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </section>

        {/* Personalized Recommendations */}
        <Suspense fallback={<SuggestedSkeleton />}>
          <SuggestedSection promise={data.suggestedReads} />
        </Suspense>

        {/* Currently in Progress Shelf */}
        <Suspense fallback={<CurrentReadingShelfSkeleton />}>
          <CurrentReadingShelf promise={data.currentReading} />
        </Suspense>

      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Subcomponents
// -------------------------------------------------------------

async function HeroActiveSection({
  promise,
}: {
  promise: Promise<any>;
}) {
  let book = null;
  try {
    book = await promise;
  } catch {
    book = null;
  }

  if (!book) {
    return (
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white border border-indigo-800/50 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="max-w-xl">
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight mb-2">
            Ready for your next journey?
          </h2>
          <p className="text-indigo-200 text-sm font-serif leading-relaxed">
            Pick a book from our vast catalog of timeless classics, treatises, and curated archival collections.
          </p>
        </div>
        <Link
          href="/discover"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-indigo-950 hover:bg-indigo-50 text-sm font-extrabold transition-all shadow-lg flex-shrink-0"
        >
          <Sparkles size={16} className="text-indigo-600" />
          <span>Explore Catalog</span>
        </Link>
      </div>
    );
  }

  const progress = Math.min(Math.max(book.progressPercentage || 0, 0), 100);

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white border border-indigo-800/50 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="flex items-center gap-6 flex-1 min-w-0">
        <div className="w-20 h-28 sm:w-24 sm:h-36 rounded-xl bg-indigo-950 border border-indigo-700/50 overflow-hidden relative flex-shrink-0 shadow-md">
          {book.coverUrl ? (
            <Image
              src={book.coverUrl}
              alt={book.title}
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-indigo-400">
              <BookOpen size={28} />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold uppercase tracking-wider mb-2">
            <span>Continue Reading</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold truncate text-white">
            {book.title}
          </h2>
          <p className="text-indigo-200 text-xs sm:text-sm font-serif truncate mt-0.5 mb-4">
            by {book.author}
          </p>

          <div className="max-w-md space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-indigo-200">
              <span>{Math.round(progress)}% completed</span>
              {book.currentPage && book.totalPages && (
                <span>Page {book.currentPage} of {book.totalPages}</span>
              )}
            </div>
            <div className="w-full h-2 rounded-full bg-indigo-950/80 border border-indigo-800/60 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <Link
        href={`/read/${book.bookId}`}
        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-extrabold transition-all shadow-lg shadow-indigo-500/30 flex-shrink-0"
      >
        <BookOpen size={18} />
        <span>Resume Reading</span>
      </Link>
    </div>
  );
}

function HeroActiveSkeleton() {
  return (
    <div className="h-48 rounded-3xl bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 animate-pulse" />
  );
}

async function SuggestedSection({ promise }: { promise: Promise<any> }) {
  let result = null;
  try {
    result = await promise;
  } catch {
    result = null;
  }

  const suggestions = result?.suggestions || [];
  if (suggestions.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Sparkles size={20} className="text-purple-500" />
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            Recommended For You
          </h2>
        </div>
        <Link
          href="/discover"
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          View all recommendations →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        {suggestions.slice(0, 4).map((b: any) => (
          <Link
            key={b.bookId}
            href={`/book/${b.bookId}`}
            className="flex flex-col p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-200 group shadow-xs hover:shadow-md"
          >
            <div className="w-full aspect-[3/4] rounded-xl bg-slate-200 dark:bg-slate-800 overflow-hidden relative mb-3 shadow-xs flex items-center justify-center">
              {b.coverUrl ? (
                <Image
                  src={b.coverUrl}
                  alt={b.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              ) : (
                <BookOpen size={28} className="text-slate-400" />
              )}
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 truncate mb-1">
              {b.reason || "Curated Pick"}
            </span>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
              {b.title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
              {b.author}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function SuggestedSkeleton() {
  return (
    <div className="h-64 rounded-3xl bg-slate-200 dark:bg-slate-900 animate-pulse" />
  );
}

async function CurrentReadingShelf({ promise }: { promise: Promise<any> }) {
  let result = null;
  try {
    result = await promise;
  } catch {
    result = null;
  }

  const books = result?.books || [];
  if (books.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <BookOpen size={20} className="text-indigo-500" />
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            Currently In Progress
          </h2>
        </div>
        <Link
          href="/library"
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          View all in library →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((b: any) => (
          <Link
            key={b.bookId}
            href={`/read/${b.bookId}`}
            className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-200 group shadow-xs hover:shadow-md"
          >
            <div className="w-14 h-20 rounded-xl bg-slate-200 dark:bg-slate-800 overflow-hidden relative flex-shrink-0">
              {b.coverUrl ? (
                <Image
                  src={b.coverUrl}
                  alt={b.title}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              ) : (
                <BookOpen size={20} className="text-slate-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                {b.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mb-2">
                {b.author}
              </p>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full"
                  style={{ width: `${Math.min(b.progressPercentage || 0, 100)}%` }}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function CurrentReadingShelfSkeleton() {
  return (
    <div className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-900 animate-pulse" />
  );
}
