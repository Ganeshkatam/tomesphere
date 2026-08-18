"use client";

import { useEffect, useState, useCallback, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LibraryPageDto } from "../application/dto/response/LibraryPageDto";
import { useLibraryStore } from "../store/library-store";
import { getLibraryPageAction } from "@/app/(workspace)/library/actions";

import LibrarySidebar from "./LibrarySidebar";
import LibraryOverview from "./LibraryOverview";
import LibraryToolbar from "./LibraryToolbar";
import LibraryGrid from "./LibraryGrid";
import LibraryList from "./LibraryList";

interface LibraryClientProps {
  initialData: LibraryPageDto;
}

export default function LibraryClient({ initialData }: LibraryClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<LibraryPageDto>(initialData);

  const {
    activeViewId,
    viewMode,
    searchQuery,
    sortBy,
    sortDirection,
    setLoadingView,
  } = useLibraryStore();

  const [page, setPage] = useState(1);

  // Parse viewId to determine type
  const fetchPageData = useCallback(async () => {
    let viewType: "overview" | "status" | "collection" | "smart-filter" =
      "overview";
    let viewId = activeViewId;

    if (activeViewId.startsWith("status:")) {
      viewType = "status";
      viewId = activeViewId.split(":")[1];
    } else if (activeViewId.startsWith("collection:")) {
      viewType = "collection";
      viewId = activeViewId.split(":")[1];
    } else if (activeViewId.startsWith("smart:")) {
      viewType = "smart-filter";
      viewId = activeViewId.split(":")[1];
    }

    setLoadingView(true);

    try {
      const result = await getLibraryPageAction({
        viewType,
        viewId,
        sortBy,
        sortDirection,
        page,
        pageSize: 24,
      });

      startTransition(() => {
        setData(result);
      });
    } catch (err) {
      console.error("Failed to fetch library page data", err);
    } finally {
      setLoadingView(false);
    }
  }, [activeViewId, searchQuery, sortBy, sortDirection, page, setLoadingView]);

  useEffect(() => {
    // Reset page when view changes
    setPage(1);
  }, [activeViewId, searchQuery, sortBy, sortDirection]);

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);

  const isOverview = activeViewId === "overview";
  const hasBooks = data.books.items.length > 0;

  return (
    <div className="flex bg-gradient-page min-h-screen relative">
      {/* Sidebar */}
      <LibrarySidebar navigation={data.navigation} />

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col relative">
        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full flex-1">
          {isOverview && <LibraryOverview summary={data.summary} />}

          <LibraryToolbar />

          {isPending && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Empty State */}
          {!hasBooks && !isPending && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-6 relative w-24 h-24 mx-auto opacity-50">
                <Image
                  src="/book-placeholder.svg"
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold mb-2">No books found</h3>
              <p className="text-slate-400 mb-6">
                Your current view has no books in it.
              </p>
              {isOverview && (
                <button
                  onClick={() => router.push("/discover")}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-105"
                >
                  Explore Books
                </button>
              )}
            </div>
          )}

          {/* Book Display */}
          {hasBooks && (
            <div
              className={`animate-fadeIn ${isPending ? "opacity-50" : "opacity-100"} transition-opacity duration-200`}
            >
              {viewMode === "grid" ? (
                <LibraryGrid books={data.books.items} />
              ) : (
                <LibraryList books={data.books.items} />
              )}
            </div>
          )}

          {/* Pagination Controls */}
          {data.books.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12 mb-8">
              <button
                disabled={!data.books.hasPrevious}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 border border-[var(--border-default)] rounded-lg text-sm"
              >
                Previous
              </button>
              <span className="text-sm text-slate-400">
                Page {data.books.page} of {data.books.totalPages}
              </span>
              <button
                disabled={!data.books.hasNext}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 border border-[var(--border-default)] rounded-lg text-sm"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
