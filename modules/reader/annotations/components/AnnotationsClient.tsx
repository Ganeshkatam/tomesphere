"use client";

import { AnnotationsPageDto } from "../application/dto/response/AnnotationsPageDto";
import { MessageSquare } from "lucide-react";
import { AnnotationCard } from "./AnnotationCard";

interface AnnotationsClientProps {
  initialData: AnnotationsPageDto;
}

export function AnnotationsClient({ initialData }: AnnotationsClientProps) {
  const annotations = initialData.items;

  return (
    <div className="min-h-screen relative w-full flex flex-col">
      <div className="p-6 md:p-8 max-w-7xl mx-auto w-full flex-1">

        <div className="flex flex-col mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-primary" />
            My Annotations
          </h1>
          <p className="text-slate-500 mt-2">
            Your commentary attached to specific book highlights.
          </p>
        </div>

        {annotations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-[var(--border-default)] rounded-2xl bg-slate-50/50 dark:bg-slate-900/20">
            <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 rounded-full flex items-center justify-center mb-6">
              <MessageSquare className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No annotations yet</h3>
            <p className="text-slate-500 max-w-sm">
              Highlight text in a book and add a note to see your annotations here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {annotations.map((annotation) => (
              <AnnotationCard key={annotation.id} annotation={annotation} />
            ))}
          </div>
        )}

        {/* Pagination stub for V1 */}
        {initialData.nextCursor && (
          <div className="mt-8 flex justify-center">
            <button className="px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
