"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  Book,
  MessageSquare,
  Pencil,
  Trash2,
  Check,
  X,
  Loader2,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { AnnotationSummaryDto } from "../application/dto/response/AnnotationsPageDto";

interface AnnotationCardProps {
  annotation: AnnotationSummaryDto;
  onUpdate: (id: string, newBodyMarkdown: string) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

export function AnnotationCard({
  annotation,
  onUpdate,
  onDelete,
}: AnnotationCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [editText, setEditText] = useState(annotation.bodyMarkdown || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async () => {
    if (editText.trim() === annotation.bodyMarkdown.trim()) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    const success = await onUpdate(annotation.id, editText.trim());
    setIsSaving(false);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const success = await onDelete(annotation.id);
    setIsDeleting(false);
    if (success) {
      setIsConfirmingDelete(false);
    }
  };

  const handleCancelEdit = () => {
    setEditText(annotation.bodyMarkdown || "");
    setIsEditing(false);
  };

  return (
    <div className="relative bg-white dark:bg-slate-900 border border-[var(--border-default)] rounded-2xl p-5 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col group overflow-hidden">
      {/* ── Top Header: Book Title & Actions ── */}
      <div className="flex items-start justify-between gap-3 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        {annotation.bookTitle ? (
          <Link
            href={`/book/${annotation.bookId}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-1 group/book"
            title={annotation.bookTitle}
          >
            <Book className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="truncate">{annotation.bookTitle}</span>
            <ExternalLink className="w-3 h-3 opacity-0 group-hover/book:opacity-100 transition-opacity shrink-0" />
          </Link>
        ) : (
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <Book className="w-3.5 h-3.5 shrink-0" />
            <span>Unknown Book</span>
          </div>
        )}

        {/* Action Controls (Edit / Delete) */}
        {!isEditing && !isConfirmingDelete && (
          <div className="flex items-center gap-1 shrink-0 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => {
                setEditText(annotation.bodyMarkdown || "");
                setIsEditing(true);
              }}
              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-400 transition-colors cursor-pointer"
              title="Edit annotation"
              aria-label="Edit annotation"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsConfirmingDelete(true)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 dark:hover:text-rose-400 transition-colors cursor-pointer"
              title="Delete annotation"
              aria-label="Delete annotation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* ── Highlighted Quote Section ── */}
      {annotation.highlightText && (
        <div className="relative mb-3.5 pb-3 border-b border-slate-100 dark:border-slate-800/60">
          <div className="absolute left-0 top-1 bottom-1 w-1 rounded-full bg-amber-400 dark:bg-amber-500 shadow-sm" />
          <p className="text-sm italic text-slate-700 dark:text-slate-300 pl-3.5 line-clamp-3 leading-relaxed">
            &ldquo;{annotation.highlightText}&rdquo;
          </p>
        </div>
      )}

      {/* ── Commentary Section: Read Mode vs Edit Mode ── */}
      {!isEditing ? (
        <div className="flex gap-2.5 mb-4 flex-1">
          <MessageSquare className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-sm text-slate-800 dark:text-slate-100 whitespace-pre-wrap leading-relaxed flex-1 break-words">
            {annotation.bodyMarkdown ? (
              annotation.bodyMarkdown
            ) : (
              <span className="italic text-slate-400 dark:text-slate-500">No commentary added</span>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 mb-4 flex-1">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Pencil className="w-3.5 h-3.5 text-indigo-500" />
            Edit Commentary
          </label>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                handleSave();
              } else if (e.key === "Escape") {
                e.preventDefault();
                handleCancelEdit();
              }
            }}
            placeholder="Write your thoughts or notes..."
            rows={3}
            disabled={isSaving}
            className="w-full text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-y transition-all"
            autoFocus
          />
          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              Press <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border text-[10px]">Ctrl+Enter</kbd> to save
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Footer: Timestamp & Reader Link ── */}
      <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
        <span>
          Added {formatDistanceToNow(new Date(annotation.createdAt), { addSuffix: true })}
          {annotation.updatedAt && annotation.updatedAt !== annotation.createdAt && (
            <span className="italic ml-1">(edited)</span>
          )}
        </span>

        <Link
          href={`/read/${annotation.bookId}`}
          className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          Open Reader &rarr;
        </Link>
      </div>

      {/* ── Delete Confirmation Overlay ── */}
      {isConfirmingDelete && (
        <div className="absolute inset-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-5 flex flex-col justify-center items-center text-center animate-in fade-in zoom-in-95 duration-150 rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            Delete this annotation?
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-xs">
            This commentary will be permanently removed from your library.
          </p>
          <div className="flex items-center gap-2.5 w-full max-w-xs">
            <button
              type="button"
              onClick={() => setIsConfirmingDelete(false)}
              disabled={isDeleting}
              className="flex-1 py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
