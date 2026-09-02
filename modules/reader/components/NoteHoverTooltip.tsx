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
  const hoveredRef = useRef<HoveredNoteState | null>(null);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isOverTooltipRef = useRef(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const updateHovered = useCallback((val: HoveredNoteState | null) => {
    hoveredRef.current = val;
    setHovered(val);
  }, []);

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
        updateHovered(null);
      }
    }, 180);
  }, [clearHideTimer, updateHovered]);

  useEffect(() => {
    // Hide tooltip if context menu or note editor is active
    if (clickedHighlightId || activeNote) {
      updateHovered(null);
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

      // If already displaying tooltip for this highlight, stay firmly anchored at the top right
      // and avoid recalculating or jumping between lines
      if (hoveredRef.current?.highlightId === highlightId) {
        clearHideTimer();
        return;
      }

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

      // Query all elements on the page belonging to this highlight to calculate
      // the composite bounding box of the entire highlight block
      const allHighlightEls = Array.from(
        document.querySelectorAll<HTMLElement>(`[data-highlight-id="${highlightId}"]`),
      );

      const rects = allHighlightEls
        .map((el) => el.getBoundingClientRect())
        .filter((r) => r.width > 0 && r.height > 0);

      let targetRect: HoveredNoteState["rect"];

      if (rects.length > 0) {
        // Top-most vertical boundary of the entire highlight
        const minTop = Math.min(...rects.map((r) => r.top));

        // Find all line rects on the top line row (within 8px tolerance)
        const topRowRects = rects.filter((r) => Math.abs(r.top - minTop) < 8);
        const topRowRight = Math.max(...topRowRects.map((r) => r.right));
        const topRowBottom = Math.max(...topRowRects.map((r) => r.bottom));
        const overallMaxRight = Math.max(...rects.map((r) => r.right));
        const overallMinLeft = Math.min(...rects.map((r) => r.left));
        const overallMaxBottom = Math.max(...rects.map((r) => r.bottom));

        // Anchor to the right edge at the top of the highlight
        const anchorRight = Math.max(topRowRight, overallMaxRight);

        targetRect = {
          top: minTop,
          bottom: topRowBottom,
          left: overallMinLeft,
          right: anchorRight,
          width: anchorRight - overallMinLeft,
          height: overallMaxBottom - minTop,
        };
      } else {
        const elRect = highlightEl.getBoundingClientRect();
        targetRect = {
          top: elRect.top,
          bottom: elRect.bottom,
          left: elRect.left,
          right: elRect.right,
          width: elRect.width,
          height: elRect.height,
        };
      }

      updateHovered({
        note: attachedNote,
        highlightId,
        rect: targetRect,
      });
    };

    const handleMouseOut = (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement | null;
      if (tooltipRef.current?.contains(related)) {
        isOverTooltipRef.current = true;
        clearHideTimer();
        return;
      }

      const relatedHighlight = related?.closest<HTMLElement>("[data-highlight-id]");
      // If moving to another line or element of the same highlight, do NOT hide
      if (relatedHighlight?.dataset.highlightId === hoveredRef.current?.highlightId) {
        clearHideTimer();
        return;
      }

      scheduleHide();
    };

    const handleScrollOrResize = () => {
      updateHovered(null);
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
  }, [notes, clickedHighlightId, activeNote, clearHideTimer, scheduleHide, updateHovered]);

  if (!hovered) return null;

  const { note, highlightId, rect } = hovered;

  // Calculate tooltip position anchored to the top-right of the overall highlight
  const tooltipWidth = 270;
  const margin = 16;

  // Align to right edge of the highlight, with bounds clamping to screen
  let left = rect.right - tooltipWidth + 24;
  left = Math.max(margin, Math.min(window.innerWidth - tooltipWidth - margin, left));

  // Position above the top of the highlight; if not enough space at top, show below
  const showBelow = rect.top < 120;
  const top = showBelow ? rect.bottom + 8 : rect.top - 8;

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateHovered(null);
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
