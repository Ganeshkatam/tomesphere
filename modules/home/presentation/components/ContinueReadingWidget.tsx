import { ContinueReadingDto } from "@/modules/library/application/queries/GetContinueReadingQuery/dto";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Sparkles } from "lucide-react";
import Image from "next/image";

interface ContinueReadingWidgetProps {
  promise: Promise<ContinueReadingDto | null>;
}

export async function ContinueReadingWidget({
  promise,
}: ContinueReadingWidgetProps) {
  let result: ContinueReadingDto | null = null;
  try {
    result = await promise;
  } catch (e) {
    result = null;
  }

  if (!result || !result.bookId) {
    return (
      <div
        id="continue"
        className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-50/70 via-white to-purple-50/70 dark:from-slate-900 dark:via-slate-900/90 dark:to-indigo-950/40 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
            <BookOpen size={28} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white">
              Ready for your next adventure?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Pick a book from our vast catalog of timeless classics and curated archives.
            </p>
          </div>
        </div>
        <Link
          href="/discover"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-sm transition-all hover:scale-[1.02] flex-shrink-0"
        >
          <Sparkles size={16} />
          <span>Discover Books</span>
        </Link>
      </div>
    );
  }

  const progress = Math.min(Math.max(result.progressPercentage || 0, 0), 100);

  return (
    <div
      id="continue"
      className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Book details */}
        <div className="flex items-center gap-5 min-w-0">
          <div className="w-16 h-24 sm:w-20 sm:h-28 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden relative flex-shrink-0 shadow-sm flex items-center justify-center">
            {result.coverUrl ? (
              <Image
                src={result.coverUrl}
                alt={result.title}
                fill
                className="object-cover"
                sizes="80px"
              />
            ) : (
              <BookOpen size={28} className="text-slate-400" />
            )}
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Continue Reading
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-white truncate mt-1">
              {result.title}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium truncate mt-0.5">
              by {result.author || "Unknown Author"}
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-2">
              <Clock size={13} />
              <span>In progress • {progress}% complete</span>
            </div>
          </div>
        </div>

        {/* Progress Bar & Resume Button */}
        <div className="w-full md:w-80 flex flex-col gap-3">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <Link
            href={`/read/${result.bookId}`}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-xs transition-all hover:scale-[1.01]"
          >
            <span>Resume Reading</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ContinueReadingSkeleton() {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-40 animate-pulse flex items-center gap-6">
      <div className="w-20 h-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
      </div>
    </div>
  );
}
