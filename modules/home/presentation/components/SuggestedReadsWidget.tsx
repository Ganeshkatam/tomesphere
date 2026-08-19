import { SuggestedReadsDto } from "@/modules/discovery/application/queries/GetSuggestedReadsQuery/dto";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, BookOpen, ChevronRight, ArrowRight } from "lucide-react";

interface SuggestedReadsWidgetProps {
  promise: Promise<SuggestedReadsDto | null>;
}

export async function SuggestedReadsWidget({
  promise,
}: SuggestedReadsWidgetProps) {
  let result: SuggestedReadsDto | null = null;
  try {
    result = await promise;
  } catch (e) {
    result = null;
  }

  const suggestions = result?.suggestions || [];

  if (suggestions.length === 0) {
    return (
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200/60 dark:border-purple-800/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Recommended For You
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Personalized archival discoveries
              </span>
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
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Start reading books in your favorite genres to receive tailored personalized recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200/60 dark:border-purple-800/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
              Recommended For You
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Curated based on your interests and reading habits
            </span>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {suggestions.slice(0, 4).map((book) => (
          <Link
            key={book.bookId}
            href={`/book/${book.bookId}`}
            className="flex flex-col p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50/40 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 transition-all duration-200 group"
          >
            <div className="w-full aspect-[3/4] rounded-xl bg-slate-200 dark:bg-slate-700 overflow-hidden relative mb-3 shadow-xs flex items-center justify-center">
              {book.coverUrl ? (
                <Image
                  src={book.coverUrl}
                  alt={book.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              ) : (
                <BookOpen size={32} className="text-slate-400" />
              )}
            </div>

            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 truncate mb-1">
              {book.reason || "Curated Pick"}
            </span>

            <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
              {book.title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
              {book.author}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function SuggestedReadsSkeleton() {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-80 animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="aspect-[3/4] bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="aspect-[3/4] bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="aspect-[3/4] bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="aspect-[3/4] bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>
    </div>
  );
}
