import { CurrentReadingDto } from "@/modules/library/application/queries/GetCurrentReadingQuery/dto";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, ChevronRight, ArrowRight } from "lucide-react";

interface CurrentReadingWidgetProps {
  promise: Promise<CurrentReadingDto | null>;
}

export async function CurrentReadingWidget({
  promise,
}: CurrentReadingWidgetProps) {
  let result: CurrentReadingDto | null = null;
  try {
    result = await promise;
  } catch (e) {
    result = null;
  }

  const books = result?.books || [];

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200/60 dark:border-purple-800/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <BookOpen size={20} />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Currently Reading
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {books.length} {books.length === 1 ? "book" : "books"} in progress
            </span>
          </div>
        </div>

        <Link
          href="/me/library"
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
        >
          <span>View All</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      {books.length > 0 ? (
        <div className="space-y-3">
          {books.slice(0, 3).map((book) => (
            <Link
              key={book.bookId}
              href={`/read/${book.bookId}`}
              className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50/50 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 transition-all duration-200 group"
            >
              <div className="w-11 h-14 rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden relative flex-shrink-0 flex items-center justify-center">
                {book.coverUrl ? (
                  <Image
                    src={book.coverUrl}
                    alt={book.title}
                    fill
                    className="object-cover"
                    sizes="44px"
                  />
                ) : (
                  <BookOpen size={18} className="text-slate-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                  {book.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {book.author}
                </p>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full"
                    style={{ width: `${Math.min(book.progressPercentage || 0, 100)}%` }}
                  />
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {Math.round(book.progressPercentage || 0)}%
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            You don&apos;t have any books currently in progress.
          </p>
          <Link
            href="/discover"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <span>Start a new book</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      )}
    </div>
  );
}

export function CurrentReadingSkeleton() {
  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-64 animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-16" />
      </div>
      <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
    </div>
  );
}
