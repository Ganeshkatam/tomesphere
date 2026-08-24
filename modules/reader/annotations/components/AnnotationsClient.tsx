"use client";

import { useState } from "react";
import { MessageSquare, Search, Filter } from "lucide-react";
import { AnnotationsPageDto, AnnotationSummaryDto } from "../application/dto/response/AnnotationsPageDto";
import { AnnotationCard } from "./AnnotationCard";
import { updateAnnotationAction, deleteAnnotationAction } from "../actions/annotationActions";
import { showSuccess, showError } from "@/lib/toast";

interface AnnotationsClientProps {
  initialData: AnnotationsPageDto;
}

export function AnnotationsClient({ initialData }: AnnotationsClientProps) {
  const [annotations, setAnnotations] = useState<AnnotationSummaryDto[]>(initialData.items);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredAnnotations = annotations.filter((a) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (a.bodyMarkdown && a.bodyMarkdown.toLowerCase().includes(q)) ||
      (a.highlightText && a.highlightText.toLowerCase().includes(q)) ||
      (a.bookTitle && a.bookTitle.toLowerCase().includes(q))
    );
  });

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

          {/* Quick Search / Filter Bar */}
          {annotations.length > 0 && (
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search annotations..."
                className="w-full text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
              />
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
              No annotations match &quot;{searchQuery}&quot;.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Clear search filter
            </button>
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
            <button className="px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm cursor-pointer">
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
