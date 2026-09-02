"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import { LibraryBookDto } from "@/modules/library/application/dto/response/LibraryBookDto";

interface ReadingScreenProps {
  readingList: LibraryBookDto[];
}

export default function ReadingScreen({ readingList }: ReadingScreenProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeStatus = searchParams.get("status") || "all";

  const setFilterStatus = (status: string) => {
    if (status === "all") {
      router.push("/me/reading");
    } else {
      router.push(`/me/reading?status=${status}`);
    }
  };

  const filteredItems = readingList.filter((item) => {
    if (activeStatus === "all") return true;
    return item.status === activeStatus;
  });

  const tabs = [
    { key: "all", label: "All Books" },
    { key: "currently_reading", label: "Currently Reading" },
    { key: "finished", label: "Finished" },
    { key: "want_to_read", label: "Want to Read" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Reading Tracker</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage and track your reading lifecycle.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key)}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              activeStatus === tab.key
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reading List Items */}
      <div className="space-y-3">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div
              key={item.bookId}
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 shadow-xs"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative w-12 h-16 shrink-0 border border-slate-200 dark:border-slate-700 rounded shadow-xs overflow-hidden">
                  <Image
                    src={
                      item.coverUrl ||
                      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=100"
                    }
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold truncate mt-0.5">
                    {item.authors?.map((a) => a.name).join(", ") || "Unknown"}
                  </p>
                  <span className="inline-block mt-2 px-2 py-0.5 bg-indigo-50 dark:bg-indigo-600/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 rounded-md text-[10px] font-bold uppercase tracking-wider">
                    {item.format || "Uncategorized"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    item.status === "finished"
                      ? "bg-emerald-50 dark:bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
                      : item.status === "reading"
                        ? "bg-blue-50 dark:bg-blue-600/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20"
                        : "bg-amber-50 dark:bg-amber-600/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20"
                  }`}
                >
                  {item.status === "finished" && "Finished"}
                  {item.status === "reading" && "Reading"}
                  {item.status === "want_to_read" && "Want to Read"}
                </span>

                {item.status === "reading" && (
                  <Link
                    href={`/read/${item.bookId}`}
                    className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                  >
                    <BookOpen size={14} />
                  </Link>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              No books matches the filter.
            </p>
            <Link
              href="/discover"
              className="inline-block mt-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Browse and add books
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
