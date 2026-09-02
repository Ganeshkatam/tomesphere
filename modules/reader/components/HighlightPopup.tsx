"use client";

import { useReaderStore } from "../state/reader-store";
import { MessageSquarePlus, Copy, X } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

interface HighlightPopupProps {
  onCreateHighlight: (color: string) => void;
  onHighlightAndNote: (color: string) => void;
}

/**
 * Floating contextual toolbar that appears directly above selected text.
 * Position is derived from the ephemeral SelectionRect (browser Range geometry)
 * stored in activeSelection.rect. Falls back to bottom-center fixed positioning
 * when rect is unavailable or stale.
 */
export function HighlightPopup({
  onCreateHighlight,
  onHighlightAndNote,
}: HighlightPopupProps) {
  const { activeSelection, setActiveSelection } = useReaderStore();
  const [copied, setCopied] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // Dismiss selection on scroll or viewport change (rect becomes stale)
  const handleDismiss = useCallback(() => {
    if (activeSelection) {
      setActiveSelection(null);
      if (typeof window !== "undefined") {
        window.getSelection()?.removeAllRanges();
      }
    }
  }, [activeSelection, setActiveSelection]);

  useEffect(() => {
    if (!activeSelection) return;

    // Listen for scroll events on all scrollable ancestors to invalidate
    // the ephemeral selection rect when the viewport changes.
    window.addEventListener("scroll", handleDismiss, { passive: true, capture: true });
    window.addEventListener("resize", handleDismiss, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleDismiss, { capture: true });
      window.removeEventListener("resize", handleDismiss);
    };
  }, [activeSelection, handleDismiss]);

  if (!activeSelection) return null;

  const colors = [
    { name: "yellow", hex: "#fde047", label: "Yellow" },
    { name: "green", hex: "#86efac", label: "Green" },
    { name: "blue", hex: "#93c5fd", label: "Blue" },
    { name: "pink", hex: "#f9a8d4", label: "Pink" },
  ];

  const handleCopy = () => {
    if (activeSelection?.text) {
      navigator.clipboard.writeText(activeSelection.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  // Compute floating position from the ephemeral selection rect.
  // When rect is available, the popup floats directly above the selection.
  // When unavailable, falls back to a centered bottom position.
  const computeStyle = (): React.CSSProperties => {
    const rect = activeSelection.rect;
    if (!rect || rect.width === 0) {
      // Fallback: static bottom-center positioning
      return {
        position: "fixed",
        bottom: 80,
        left: "50%",
        transform: "translateX(-50%)",
      };
    }

    const POPUP_HEIGHT = 48; // approximate popup height
    const MARGIN = 10;
    const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1024;
    const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 768;

    // Center horizontally over the selection, clamped to viewport edges
    let left = rect.left + rect.width / 2;
    const popupWidth = 320; // approximate width
    left = Math.max(MARGIN + popupWidth / 2, Math.min(viewportWidth - MARGIN - popupWidth / 2, left));

    // Position above the selection. If insufficient top space, flip below.
    let top: number;
    if (rect.top > POPUP_HEIGHT + MARGIN) {
      top = rect.top - POPUP_HEIGHT - MARGIN;
    } else {
      top = rect.bottom + MARGIN;
    }

    // Final boundary clamp
    top = Math.max(MARGIN, Math.min(viewportHeight - POPUP_HEIGHT - MARGIN, top));

    return {
      position: "fixed",
      top,
      left,
      transform: "translateX(-50%)",
    };
  };

  return (
    <div
      ref={popupRef}
      style={computeStyle()}
      className="bg-slate-900/95 dark:bg-slate-850/95 backdrop-blur-lg text-white border border-slate-700/80 shadow-2xl shadow-black/40 rounded-2xl p-2 sm:p-2.5 flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-3 duration-150"
    >
      {/* Color Highlights */}
      <div className="flex items-center gap-1.5 pl-1">
        {colors.map((color) => (
          <button
            key={color.name}
            type="button"
            className="w-7 h-7 rounded-full border-2 border-white/20 hover:border-white hover:scale-110 active:scale-95 transition-all focus:outline-none cursor-pointer"
            style={{ backgroundColor: color.hex }}
            title={`Highlight with ${color.label}`}
            onClick={() => {
              onCreateHighlight(color.hex);
              if (typeof window !== "undefined") {
                window.getSelection()?.removeAllRanges();
              }
            }}
          />
        ))}
      </div>

      <div className="w-px h-5 bg-slate-700 mx-0.5" />

      {/* Highlight & Add Note Action */}
      <button
        type="button"
        onClick={() => {
          onHighlightAndNote("#fde047");
          if (typeof window !== "undefined") {
            window.getSelection()?.removeAllRanges();
          }
        }}
        className="px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
        title="Highlight & create attached note"
      >
        <MessageSquarePlus size={14} />
        <span>Add Note</span>
      </button>

      {/* Copy Text */}
      <button
        type="button"
        onClick={handleCopy}
        className="p-1.5 rounded-xl hover:bg-white/10 active:scale-95 text-slate-300 hover:text-white transition-all cursor-pointer"
        title={copied ? "Copied!" : "Copy selected text"}
      >
        <Copy size={14} />
      </button>

      {/* Dismiss Selection */}
      <button
        type="button"
        onClick={handleDismiss}
        className="p-1.5 rounded-xl hover:bg-white/10 active:scale-95 text-slate-400 hover:text-white transition-all cursor-pointer"
        title="Clear selection"
      >
        <X size={14} />
      </button>
    </div>
  );
}
