"use client";

import React, { useEffect, useState, useCallback, useTransition, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LibraryPageDto } from "../application/dto/response/LibraryPageDto";
import { useLibraryStore } from "../store/library-store";
import { getLibraryPageAction } from "../presentation/actions/library";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, RefreshCw } from "lucide-react";

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
  const [error, setError] = useState<string | null>(null);

  const {
    activeViewId,
    viewMode,
    searchQuery,
    sortBy,
    sortDirection,
    setLoadingView,
  } = useLibraryStore();

  const [page, setPage] = useState(1);
  const isInitialMount = useRef(true);

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
    setError(null);

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
    } catch (err: any) {
      console.error("Failed to fetch library page data", err);
      setError(err?.message || "Failed to load library books. Please try again.");
    } finally {
      setLoadingView(false);
    }
  }, [activeViewId, sortBy, sortDirection, page, setLoadingView]);

  useEffect(() => {
    // Reset page when view changes
    setPage(1);
  }, [activeViewId, searchQuery, sortBy, sortDirection]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    fetchPageData();
  }, [fetchPageData]);

  const isOverview = activeViewId === "overview";
  const hasBooks = data.books.items.length > 0;

  return (
    <div className="min-h-screen relative w-full">
      <main className="w-full flex flex-col relative">
        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full flex-1">
          {isOverview && <LibraryOverview summary={data.summary} />}

          <LibraryToolbar />

          {isPending && (
            <div
              role="status"
              aria-live="polite"
              className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="sr-only">Loading library...</span>
            </div>
          )}

          {/* Error & Retry State */}
          {error && !isPending && (
            <Card className="flex flex-col items-center justify-center py-16 px-6 text-center border-destructive/40 bg-destructive/5 my-8">
              <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
                Unable to Load Library
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
                {error}
              </p>
              <Button
                type="button"
                variant="default"
                onClick={fetchPageData}
                className="gap-2"
                aria-label="Retry loading library"
              >
                <RefreshCw size={16} />
                <span>Retry</span>
              </Button>
            </Card>
          )}

          {/* Empty State */}
          {!hasBooks && !isPending && !error && (
            <Card className="flex flex-col items-center justify-center py-20 px-6 text-center border-dashed my-8">
              <div className="mb-6 relative w-20 h-20 mx-auto opacity-50">
                <Image
                  src="/book-placeholder.svg"
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">
                No books found
              </h3>
              <p className="text-slate-400 max-w-sm mb-6 text-sm">
                Your current view has no books in it. Add books to your library to track your reading journey.
              </p>
              {isOverview && (
                <Button asChild size="lg" className="rounded-xl font-bold">
                  <Link href="/discover">Explore Books</Link>
                </Button>
              )}
            </Card>
          )}

          {/* Book Display */}
          {hasBooks && !error && (
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
          {data.books.totalPages > 1 && !error && (
            <div className="flex items-center justify-center gap-4 mt-12 mb-8">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!data.books.hasPrevious}
                onClick={() => setPage((p) => p - 1)}
                aria-label="Previous page"
              >
                Previous
              </Button>
              <span className="text-sm text-slate-400">
                Page {data.books.page} of {data.books.totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!data.books.hasNext}
                onClick={() => setPage((p) => p + 1)}
                aria-label="Next page"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
