"use client";

import { useReaderStore } from "../state/reader-store";
import { MessageSquarePlus, Copy, X } from "lucide-react";
import { useState } from "react";

interface HighlightPopupProps {
  onCreateHighlight: (color: string) => void;
  onHighlightAndNote: (color: string) => void;
}

export function HighlightPopup({
  onCreateHighlight,
  onHighlightAndNote,
}: HighlightPopupProps) {
  const { activeSelection, setActiveSelection } = useReaderStore();
  const [copied, setCopied] = useState(false);

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

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-slate-900/95 dark:bg-slate-850/95 backdrop-blur-lg text-white border border-slate-700/80 shadow-2xl shadow-black/40 rounded-2xl p-2 sm:p-2.5 flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-3 duration-150">
      {/* Color Highlights */}
      <div className="flex items-center gap-1.5 pl-1">
        {colors.map((color) => (
          <button
            key={color.name}
            type="button"
            className="w-7 h-7 rounded-full border-2 border-white/20 hover:border-white hover:scale-110 active:scale-95 transition-all focus:outline-none cursor-pointer"
            style={{ backgroundColor: color.hex }}
            title={`Highlight with ${color.label}`}
            onClick={() => onCreateHighlight(color.hex)}
          />
        ))}
      </div>

      <div className="w-px h-5 bg-slate-700 mx-0.5" />

      {/* Highlight & Add Note Action */}
      <button
        type="button"
        onClick={() => onHighlightAndNote("#fde047")}
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
        onClick={() => setActiveSelection(null)}
        className="p-1.5 rounded-xl hover:bg-white/10 active:scale-95 text-slate-400 hover:text-white transition-all cursor-pointer"
        title="Clear selection"
      >
        <X size={14} />
      </button>
    </div>
  );
}
