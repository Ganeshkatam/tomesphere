import { AnnotationSummaryDto } from "../application/dto/response/AnnotationsPageDto";
import { formatDistanceToNow } from "date-fns";
import { Book, MessageSquare, Highlighter } from "lucide-react";

interface AnnotationCardProps {
  annotation: AnnotationSummaryDto;
}

export function AnnotationCard({ annotation }: AnnotationCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-[var(--border-default)] rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col">

      {/* Highlight Section */}
      {annotation.highlightText && (
        <div className="relative mb-4 pb-4 border-b border-[var(--border-default)]">
          <div className="absolute -left-1 top-1 bottom-1 w-1 rounded-full bg-yellow-400"></div>
          <p className="text-sm italic text-slate-700 dark:text-slate-300 pl-3 line-clamp-3">
            &quot;{annotation.highlightText}&quot;
          </p>
        </div>
      )}

      {/* Annotation Comment */}
      <div className="flex gap-3 mb-4">
        <MessageSquare className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
        <p className="text-sm text-slate-800 dark:text-slate-100 whitespace-pre-wrap">
          {annotation.bodyMarkdown || <span className="italic text-slate-400">No comment</span>}
        </p>
      </div>

      <div className="mt-auto pt-2 flex flex-col gap-2 text-xs text-slate-400">
        {annotation.bookTitle && (
          <div className="flex items-center gap-1.5 font-medium text-slate-500">
            <Book className="w-3.5 h-3.5" />
            <span className="line-clamp-1">{annotation.bookTitle}</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span>Added {formatDistanceToNow(new Date(annotation.createdAt), { addSuffix: true })}</span>
        </div>
      </div>
    </div>
  );
}
