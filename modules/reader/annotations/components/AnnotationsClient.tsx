"use client";

import { useState } from "react";
import { MessageSquare, Search, Filter } from "lucide-react";
import { AnnotationsPageDto, AnnotationSummaryDto } from "../application/dto/response/AnnotationsPageDto";
import { AnnotationCard } from "./AnnotationCard";
import { updateAnnotationAction, deleteAnnotationAction } from "../actions/annotationActions";
import { showSuccess, showError } from "@/lib/toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface AnnotationsClientProps {
  initialData: AnnotationsPageDto;
}

export function AnnotationsClient({ initialData }: AnnotationsClientProps) {
  const [annotations, setAnnotations] = useState<AnnotationSummaryDto[]>(initialData.items);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedBook, setSelectedBook] = useState<string>("all");

  const handleUpdate = async (id: string, newBodyMarkdown: string): Promise<boolean> => {
    try {
      const res = await updateAnnotationAction({ id, bodyMarkdown: newBodyMarkdown });
      if (!res.success) {
        showError(res.error?.message || "Failed to update annotation");
        return false;
      }

      setAnnotations((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                bodyMarkdown: res.data.bodyMarkdown,
                updatedAt: res.data.updatedAt,
              }
            : item
        )
      );

      showSuccess("Annotation updated successfully");
      return true;
    } catch (err: any) {
      showError(err.message || "An unexpected error occurred while updating");
      return false;
    }
  };

  const handleDelete = async (id: string): Promise<boolean> => {
    try {
      const res = await deleteAnnotationAction(id);
      if (!res.success) {
        showError(res.error?.message || "Failed to delete annotation");
        return false;
      }

      setAnnotations((prev) => prev.filter((item) => item.id !== id));
      showSuccess("Annotation deleted successfully");
      return true;
    } catch (err: any) {
      showError(err.message || "An unexpected error occurred while deleting");
      return false;
    }
  };

  // Derive unique book titles for the book filter
  const uniqueBooks = Array.from(
    new Set(annotations.map((a) => a.bookTitle).filter((t): t is string => Boolean(t)))
  );

  const hasActiveFilter = filterType !== "all" || selectedBook !== "all";

  const filteredAnnotations = annotations.filter((a) => {
    // 1. Text Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        (a.bodyMarkdown && a.bodyMarkdown.toLowerCase().includes(q)) ||
        (a.highlightText && a.highlightText.toLowerCase().includes(q)) ||
        (a.bookTitle && a.bookTitle.toLowerCase().includes(q));
      if (!matchesSearch) return false;
    }

    // 2. Type Filter
    if (filterType === "highlights" && !a.highlightText) {
      return false;
    }
    if (filterType === "edited" && (!a.updatedAt || a.updatedAt === a.createdAt)) {
      return false;
    }

    // 3. Book Filter
    if (selectedBook !== "all" && a.bookTitle !== selectedBook) {
      return false;
    }

    return true;
  });

  const clearAllFilters = () => {
    setSearchQuery("");
    setFilterType("all");
    setSelectedBook("all");
  };

  return (
    <div className="min-h-screen relative w-full flex flex-col bg-[var(--surface-canvas)]">
      <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full flex-1">
        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
              <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <MessageSquare className="w-6 h-6" />
              </span>
              My Annotations
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
              Your commentary attached to specific book highlights.
            </p>
          </div>

          {/* Quick Search & Filter Controls */}
          {annotations.length > 0 && (
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search annotations..."
                  className="pl-9 pr-4"
                />
              </div>

              {/* Filter Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={hasActiveFilter ? "default" : "outline"}
                    size="sm"
                    className="h-10 px-3.5 gap-2 text-xs font-semibold shrink-0 cursor-pointer"
                    aria-label="Filter annotations"
                  >
                    <Filter className="w-4 h-4" />
                    <span className="hidden sm:inline">Filter</span>
                    {hasActiveFilter && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={filterType} onValueChange={setFilterType}>
                    <DropdownMenuRadioItem value="all">All annotations</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="highlights">With highlights only</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="edited">Edited commentary only</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>

                  {uniqueBooks.length > 1 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Filter by Book</DropdownMenuLabel>
                      <DropdownMenuRadioGroup value={selectedBook} onValueChange={setSelectedBook}>
                        <DropdownMenuRadioItem value="all">All books</DropdownMenuRadioItem>
                        {uniqueBooks.map((title) => (
                          <DropdownMenuRadioItem key={title} value={title} className="truncate">
                            {title}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </>
                  )}

                  {hasActiveFilter && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setFilterType("all");
                          setSelectedBook("all");
                        }}
                        className="text-primary justify-center text-xs font-semibold"
                      >
                        Reset filters
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* ── Content Grid / Empty State ── */}
        {annotations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-[var(--border-default)] rounded-3xl bg-slate-50/50 dark:bg-slate-900/20">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1.5">
              No annotations yet
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
              Highlight text in a book and add notes while reading to build your personal library commentary.
            </p>
          </div>
        ) : filteredAnnotations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No annotations match your active filters
              {searchQuery ? ` and search "${searchQuery}"` : ""}.
            </p>
            <Button
              variant="link"
              size="sm"
              onClick={clearAllFilters}
              className="mt-1 h-auto p-0 text-xs font-semibold text-primary"
            >
              Reset all search and filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnnotations.map((annotation) => (
              <AnnotationCard
                key={annotation.id}
                annotation={annotation}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Pagination stub for V1 */}
        {initialData.nextCursor && (
          <div className="mt-10 flex justify-center">
            <Button variant="secondary" className="px-6 font-semibold">
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
