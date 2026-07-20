"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { LibraryBookDto } from "../application/dto/response/LibraryBookDto";
import { useLibraryStore } from "../store/library-store";

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
    <div className="flex flex-col space-y-2">
      {books.map((item) => {
        const isSelected = selection.includes(item.bookId);

        return (
          <div
            key={item.bookId}
            className={`flex items-center gap-4 p-3 rounded-lg border transition-colors cursor-pointer ${
              isSelected
                ? "bg-primary/10 border-primary"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
            onClick={() => router.push(`/read/${item.bookId}`)}
          >
            {/* Checkbox for selection could go here */}

            {/* Cover */}
            <div className="relative w-12 h-16 flex-shrink-0 rounded overflow-hidden">
              {item.coverUrl ? (
                <Image
                  src={item.coverUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                  <span className="text-xs text-slate-500">No cover</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-white truncate">
                {item.title}
              </h4>
              <p className="text-sm text-slate-400 truncate">
                {item.authors.map((a) => a.name).join(", ") || "Unknown Author"}
              </p>
            </div>

            {/* Status / Progress */}
            <div className="hidden sm:flex flex-col items-end w-32 flex-shrink-0">
              <span className="text-xs text-slate-500 mb-1 uppercase tracking-wider">
                {item.status.replace(/_/g, " ")}
              </span>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div
                  className="bg-primary h-1.5 rounded-full"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
