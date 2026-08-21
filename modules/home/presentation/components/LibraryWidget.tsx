import { LibrarySnapshotDto } from "@/modules/library/application/queries/GetLibrarySnapshotQuery/dto";
import Link from "next/link";
import Image from "next/image";
import { Bookmark, ChevronRight, CheckCircle2, BookOpen, Clock } from "lucide-react";

interface LibraryWidgetProps {
  promise: Promise<LibrarySnapshotDto | null>;
}

export async function LibraryWidget({ promise }: LibraryWidgetProps) {
  let result: LibrarySnapshotDto | null = null;
  try {
    result = await promise;
  } catch (e) {
    result = null;
  }

  const wantToRead = result?.wantToReadCount ?? 0;
  const currentlyReading = result?.currentlyReadingCount ?? 0;
  const finished = result?.finishedCount ?? 0;
  const total = wantToRead + currentlyReading + finished;
  const covers = result?.recentCovers || [];

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Bookmark size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Library Snapshot
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {total} total {total === 1 ? "title" : "titles"} in your collection
              </span>
            </div>
          </div>

          <Link
            href="/me/mylibrary"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
          >
            <span>My Library</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* 3 Metric Counters */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
              <Clock size={13} className="text-indigo-500" />
              <span>Want to Read</span>
            </div>
            <div className="text-xl font-display font-extrabold text-slate-900 dark:text-white">
              {wantToRead}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
              <BookOpen size={13} className="text-purple-500" />
              <span>Reading</span>
            </div>
            <div className="text-xl font-display font-extrabold text-slate-900 dark:text-white">
              {currentlyReading}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
              <CheckCircle2 size={13} className="text-emerald-500" />
              <span>Finished</span>
            </div>
            <div className="text-xl font-display font-extrabold text-slate-900 dark:text-white">
              {finished}
            </div>
          </div>
        </div>
      </div>

      {/* Cover Thumbnails */}
      {covers.length > 0 ? (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-2 flex-shrink-0">
            Recent:
          </span>
          {covers.slice(0, 5).map((cov, i) => (
            <div
              key={i}
              className="w-8 h-11 rounded-md bg-slate-200 dark:bg-slate-700 overflow-hidden relative flex-shrink-0 border border-slate-200 dark:border-slate-700"
            >
              <Image
                src={cov}
                alt="Book cover"
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 text-center">
          Save books to your library to access them across all devices.
        </div>
      )}
    </div>
  );
}

export function LibrarySkeleton() {
  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-64 animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-16" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>
    </div>
  );
}
