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
  Loader2,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { AnnotationSummaryDto } from "../application/dto/response/AnnotationsPageDto";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

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
    <Card className="relative p-5 hover:shadow-lg transition-all flex flex-col group overflow-hidden border-border bg-card">
      {/* ── Top Header: Book Title & Actions ── */}
      <div className="flex items-start justify-between gap-3 mb-3 pb-3 border-b border-border">
        {annotation.bookTitle ? (
          <Link
            href={`/book/${annotation.bookId}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-foreground hover:text-primary transition-colors line-clamp-1 group/book"
            title={annotation.bookTitle}
          >
            <Book className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="truncate">{annotation.bookTitle}</span>
            <ExternalLink className="w-3 h-3 opacity-0 group-hover/book:opacity-100 transition-opacity shrink-0" />
          </Link>
        ) : (
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Book className="w-3.5 h-3.5 shrink-0" />
            <span>Unknown Book</span>
          </div>
        )}

        {/* Action Controls (Edit / Delete) with Tooltips and Accessible Labels */}
        {!isEditing && (
          <TooltipProvider delayDuration={200}>
            <div className="flex items-center gap-1 shrink-0 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditText(annotation.bodyMarkdown || "");
                      setIsEditing(true);
                    }}
                    className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-muted"
                    aria-label="Edit annotation"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Edit annotation</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsConfirmingDelete(true)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    aria-label="Delete annotation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Delete annotation</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        )}
      </div>

      {/* ── Highlighted Quote Section ── */}
      {annotation.highlightText && (
        <div className="relative mb-3.5 pb-3 border-b border-border">
          <div className="absolute left-0 top-1 bottom-1 w-1 rounded-full bg-amber-500 shadow-sm" />
          <p className="text-sm italic text-foreground/90 pl-3.5 line-clamp-3 leading-relaxed">
            &ldquo;{annotation.highlightText}&rdquo;
          </p>
        </div>
      )}

      {/* ── Commentary Section: Read Mode vs Edit Mode ── */}
      {!isEditing ? (
        <div className="flex gap-2.5 mb-4 flex-1">
          <MessageSquare className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed flex-1 break-words">
            {annotation.bodyMarkdown ? (
              annotation.bodyMarkdown
            ) : (
              <span className="italic text-muted-foreground">No commentary added</span>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 mb-4 flex-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Pencil className="w-3.5 h-3.5 text-primary" />
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
            className="w-full text-sm bg-muted/50 border border-input rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 resize-y transition-all"
            autoFocus
          />
          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="text-[11px] text-muted-foreground">
              Press <kbd className="px-1 py-0.5 rounded bg-muted border text-[10px]">Ctrl+Enter</kbd> to save
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancelEdit}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="gap-1.5"
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
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Footer: Timestamp & Reader Link ── */}
      <div className="mt-auto pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Added {formatDistanceToNow(new Date(annotation.createdAt), { addSuffix: true })}
          {annotation.updatedAt && annotation.updatedAt !== annotation.createdAt && (
            <span className="italic ml-1">(edited)</span>
          )}
        </span>

        <Link
          href={`/read/${annotation.bookId}`}
          className="font-medium text-primary hover:underline flex items-center gap-1"
        >
          Open Reader &rarr;
        </Link>
      </div>

      {/* ── Accessible Delete Confirmation Dialog ── */}
      <Dialog open={isConfirmingDelete} onOpenChange={setIsConfirmingDelete}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="items-center text-center sm:text-center">
            <div className="w-10 h-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-2">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <DialogTitle>Delete this annotation?</DialogTitle>
            <DialogDescription>
              This commentary will be permanently removed from your library.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-2 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsConfirmingDelete(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="gap-1.5"
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
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
