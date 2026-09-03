"use client";

import { useReaderStore } from "../state/reader-store";
import { MessageSquarePlus, Trash2, X } from "lucide-react";
import React, { useEffect, useRef } from "react";

interface HighlightContextMenuProps {
  onAddNote: (highlightId: string) => void;
  onDeleteHighlight: (highlightId: string) => void;
}

export function HighlightContextMenu({
  onAddNote,
  onDeleteHighlight,
}: HighlightContextMenuProps) {
  const { clickedHighlightId, setClickedHighlightId, currentAnchor } = useReaderStore();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on actual page navigation / location change (not on initial mount)
  const prevAnchorRef = useRef(currentAnchor);
  useEffect(() => {
    if (prevAnchorRef.current !== currentAnchor) {
      prevAnchorRef.current = currentAnchor;
      if (clickedHighlightId) {
        setClickedHighlightId(null);
      }
    }
  }, [currentAnchor, clickedHighlightId, setClickedHighlightId]);

  useEffect(() => {
    if (!clickedHighlightId) return;

    const handleDismiss = () => {
      setClickedHighlightId(null);
    };

    const handlePointerDown = (e: PointerEvent | MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        handleDismiss();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "Escape" ||
        e.key === "PageDown" ||
        e.key === "PageUp" ||
        e.key === "ArrowDown" ||
        e.key === "ArrowUp" ||
        e.key === " "
      ) {
        handleDismiss();
      }
    };

    // Autohide immediately when user tries to scroll or interacts outside
    window.addEventListener("scroll", handleDismiss, { passive: true, capture: true });
    window.addEventListener("wheel", handleDismiss, { passive: true, capture: true });
    window.addEventListener("touchmove", handleDismiss, { passive: true, capture: true });
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleDismiss, { capture: true });
      window.removeEventListener("wheel", handleDismiss, { capture: true });
      window.removeEventListener("touchmove", handleDismiss, { capture: true });
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [clickedHighlightId, setClickedHighlightId]);

  if (!clickedHighlightId) return null;

  return (
    <div
      ref={menuRef}
      className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-slate-900/95 dark:bg-[#1e2227]/95 text-white border border-slate-700/80 shadow-2xl rounded-2xl p-1.5 flex items-center gap-1.5 z-50 animate-in fade-in slide-in-from-bottom-3 duration-150 backdrop-blur-md"
    >
      <button
        type="button"
        onClick={() => {
          onAddNote(clickedHighlightId);
          setClickedHighlightId(null);
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold text-xs transition-all cursor-pointer shadow-sm"
        title="Add or edit note"
      >
        <MessageSquarePlus size={14} />
        <span>Add Note</span>
      </button>

      <div className="w-px h-5 bg-white/10 mx-0.5" />

      <button
        type="button"
        onClick={() => {
          onDeleteHighlight(clickedHighlightId);
          setClickedHighlightId(null);
        }}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-red-500/20 active:scale-95 text-red-400 hover:text-red-300 font-medium text-xs transition-all cursor-pointer"
        title="Delete highlight"
      >
        <Trash2 size={14} />
        <span>Delete</span>
      </button>

      <button
        type="button"
        onClick={() => setClickedHighlightId(null)}
        className="p-1.5 rounded-xl hover:bg-white/10 active:scale-95 text-slate-400 hover:text-white transition-all cursor-pointer"
        title="Close menu"
      >
        <X size={13} />
      </button>
    </div>
  );
}
