"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { LibraryBookDto } from "../application/dto/response/LibraryBookDto";
import { useLibraryStore } from "../store/library-store";
import { BookOpen, Check, Bookmark } from "lucide-react";

interface LibraryListProps {
  books: LibraryBookDto[];
}

export default function LibraryList({ books }: LibraryListProps) {
  const router = useRouter();
  const { toggleSelection, selection } = useLibraryStore();

  if (books.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-3">
      {books.map((item) => {
        const isSelected = selection.includes(item.bookId);

        return (
          <div
            key={item.bookId}
            className={`flex items-center gap-4 p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
              isSelected
                ? "bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 shadow-md"
                : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md"
            }`}
            onClick={() => router.push(`/read/${item.bookId}`)}
          >
            {/* Cover */}
            <div className="relative w-12 sm:w-14 aspect-[2/3] flex-shrink-0 rounded-xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800">
              {item.coverUrl ? (
                <Image
                  src={item.coverUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <span className="text-[10px] text-slate-400">No cover</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                {item.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                {item.authors.map((a) => a.name).join(", ") || "Unknown Author"}
              </p>
            </div>

            {/* Status & Progress Bar */}
            <div className="flex flex-col items-end w-32 sm:w-44 flex-shrink-0 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold">
                {item.status === "reading" ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[10px] sm:text-xs">
                    <BookOpen size={11} />
                    <span>Reading ({item.progress}%)</span>
                  </span>
                ) : item.status === "finished" ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] sm:text-xs">
                    <Check size={11} />
                    <span>Finished</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] sm:text-xs">
                    <Bookmark size={11} />
                    <span>Want to Read</span>
                  </span>
                )}
              </div>

              {item.status === "reading" && (
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(4, item.progress)}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
