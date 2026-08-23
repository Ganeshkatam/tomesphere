"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useReaderStore } from "../state/reader-store";
import { ReaderNote } from "@/shared/core/events/types";
import { StickyNote, Edit3 } from "lucide-react";

interface HoveredNoteState {
  note: ReaderNote;
  highlightId: string;
  rect: {
    top: number;
    bottom: number;
    left: number;
    right: number;
    width: number;
    height: number;
  };
}

interface NoteHoverTooltipProps {
  onEditNote?: (highlightId: string) => void;
}

export function NoteHoverTooltip({ onEditNote }: NoteHoverTooltipProps) {
  const { notes, clickedHighlightId, activeNote } = useReaderStore();
  const [hovered, setHovered] = useState<HoveredNoteState | null>(null);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isOverTooltipRef = useRef(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const scheduleHide = useCallback(() => {
    clearHideTimer();
    hideTimerRef.current = setTimeout(() => {
      if (!isOverTooltipRef.current) {
        setHovered(null);
      }
    }, 180);
  }, [clearHideTimer]);

  useEffect(() => {
    // Hide tooltip if context menu or note editor is active
    if (clickedHighlightId || activeNote) {
      setHovered(null);
      return;
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Check if hovering over tooltip itself
      if (tooltipRef.current?.contains(target)) {
        isOverTooltipRef.current = true;
        clearHideTimer();
        return;
      }

      // Check if hovering over a highlight element
      const highlightEl = target.closest<HTMLElement>("[data-highlight-id]");
      if (!highlightEl) {
        if (!isOverTooltipRef.current) {
          scheduleHide();
        }
        return;
      }

      const highlightId = highlightEl.dataset.highlightId;
      if (!highlightId) return;

      // Find if there's a note attached to this highlight
      const attachedNote = notes.find(
        (n) =>
          n.target.type === "highlight" &&
          n.target.highlightId === highlightId &&
          n.bodyMarkdown?.trim().length > 0,
      );

      if (!attachedNote) {
        scheduleHide();
        return;
      }

      clearHideTimer();

      const elRect = highlightEl.getBoundingClientRect();
      setHovered({
        note: attachedNote,
        highlightId,
        rect: {
          top: elRect.top,
          bottom: elRect.bottom,
          left: elRect.left,
          right: elRect.right,
          width: elRect.width,
          height: elRect.height,
        },
      });
    };

    const handleMouseOut = (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement | null;
      if (tooltipRef.current?.contains(related)) {
        isOverTooltipRef.current = true;
        clearHideTimer();
        return;
      }

      const relatedHighlight = related?.closest("[data-highlight-id]");
      if (!relatedHighlight) {
        scheduleHide();
      }
    };

    const handleScrollOrResize = () => {
      setHovered(null);
    };

    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", handleMouseOut, { passive: true });
    window.addEventListener("scroll", handleScrollOrResize, { passive: true, capture: true });
    window.addEventListener("resize", handleScrollOrResize, { passive: true });

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("scroll", handleScrollOrResize, { capture: true });
      window.removeEventListener("resize", handleScrollOrResize);
      clearHideTimer();
    };
  }, [notes, clickedHighlightId, activeNote, clearHideTimer, scheduleHide]);

  if (!hovered) return null;

  const { note, highlightId, rect } = hovered;

  // Calculate tooltip position anchored to the right tip of the highlight
  const tooltipWidth = 270;
  const margin = 16;

  // Align to right edge of the highlight, with bounds clamping to screen
  let left = rect.right - tooltipWidth + 20;
  left = Math.max(margin, Math.min(window.innerWidth - tooltipWidth - margin, left));

  // Position above the right tip by default; if not enough space at top, show below
  const showBelow = rect.top < 120;
  const top = showBelow ? rect.bottom + 8 : rect.top - 8;

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHovered(null);
    onEditNote?.(highlightId);
  };

  return (
    <div
      ref={tooltipRef}
      onMouseEnter={() => {
        isOverTooltipRef.current = true;
        clearHideTimer();
      }}
      onMouseLeave={() => {
        isOverTooltipRef.current = false;
        scheduleHide();
      }}
      style={{
        position: "fixed",
        top: `${top}px`,
        left: `${left}px`,
        width: `${tooltipWidth}px`,
        transform: showBelow ? "none" : "translateY(-100%)",
        zIndex: 60,
      }}
      className="relative bg-slate-900/95 dark:bg-[#1e2227]/95 text-slate-100 border border-slate-700/80 rounded-xl shadow-2xl shadow-black/50 p-3 backdrop-blur-md text-xs transition-opacity duration-150 animate-in fade-in zoom-in-95 pointer-events-auto select-text"
    >
      {/* Pointer Arrow */}
      {showBelow ? (
        <div className="absolute -top-1.5 right-6 w-3 h-3 bg-slate-900/95 dark:bg-[#1e2227]/95 border-l border-t border-slate-700/80 rotate-45 pointer-events-none" />
      ) : (
        <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-slate-900/95 dark:bg-[#1e2227]/95 border-r border-b border-slate-700/80 rotate-45 pointer-events-none" />
      )}

      {/* Header with Note Icon, Label & Edit Button */}
      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-700/60 text-slate-400">
        <div className="flex items-center gap-1.5 font-semibold text-[11px] text-amber-400">
          <StickyNote size={13} className="text-amber-400" />
          <span>Attached Note</span>
        </div>
        {onEditNote && (
          <button
            type="button"
            onClick={handleEditClick}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer text-[10px]"
            title="Edit this note"
          >
            <Edit3 size={11} />
            <span>Edit</span>
          </button>
        )}
      </div>

      {/* Note Body Content */}
      <div className="text-slate-200 text-xs leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap break-words no-scrollbar">
        {note.bodyMarkdown}
      </div>
    </div>
  );
}
