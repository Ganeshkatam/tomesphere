"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import { LibraryCollectionItemDto } from "@/modules/library/application/dto/response/LibraryEntryDto";

interface ReadingScreenProps {
  readingList: LibraryCollectionItemDto[];
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
    return item.library.state === activeStatus;
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
        <h2 className="text-2xl font-bold text-slate-50">Reading Tracker</h2>
        <p className="text-sm text-slate-400 mt-1">
          Manage and track your reading lifecycle.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-[var(--border-default)] pb-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key)}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap transition-all ${activeStatus === tab.key
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-[var(--surface-overlay)]"
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
              key={item.book.id}
              className="bg-[var(--surface-default)] border border-[var(--border-default)] rounded-xl p-4 flex items-center justify-between gap-4 hover:border-[var(--border-strong)] transition-all duration-200"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative w-12 h-16 shrink-0 border border-[var(--border-subtle)] rounded shadow-sm overflow-hidden">
                  <Image
                    src={
                      item.book.coverUrl ||
                      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=100"
                    }
                    alt={item.book.title}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-slate-50 truncate">
                    {item.book.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold truncate mt-0.5">
                    {item.book.authors?.map(a => a.name).join(", ") || "Unknown"}
                  </p>
                  <span className="inline-block mt-2 px-2 py-0.5 bg-indigo-600/10 text-indigo-400 rounded text-[10px] font-bold">
                    {item.book.genres?.[0]?.name || "Uncategorized"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.library.state === "finished"
                      ? "bg-emerald-600/10 text-emerald-400 border border-emerald-500/20"
                      : item.library.state === "currently_reading"
                        ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                        : "bg-yellow-600/10 text-yellow-400 border border-yellow-500/20"
                    }`}
                >
                  {item.library.state === "finished" && "Finished"}
                  {item.library.state === "currently_reading" && "Reading"}
                  {item.library.state === "want_to_read" && "Want to Read"}
                </span>

                {item.library.state === "currently_reading" && (
                  <Link
                    href={`/read/${item.book.id}`}
                    className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                  >
                    <BookOpen size={14} />
                  </Link>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 rounded-xl border border-dashed border-[var(--border-default)]">
            <p className="text-sm text-slate-400 font-medium">
              No books matches the filter.
            </p>
            <Link
              href="/discover"
              className="inline-block mt-2 text-xs font-bold text-indigo-400 hover:underline"
            >
              Browse and add books
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
