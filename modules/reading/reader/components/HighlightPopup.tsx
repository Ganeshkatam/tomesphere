"use client";

import { useReaderStore } from "../state/reader-store";
import { MessageSquarePlus } from "lucide-react";

interface HighlightPopupProps {
  onCreateHighlight: (color: string) => void;
  onHighlightAndNote: (color: string) => void;
}

export function HighlightPopup({
  onCreateHighlight,
  onHighlightAndNote,
}: HighlightPopupProps) {
  const { activeSelection } = useReaderStore();

  if (!activeSelection) return null;

  const colors = [
    { name: "yellow", hex: "#fde047" },
    { name: "green", hex: "#86efac" },
    { name: "blue", hex: "#93c5fd" },
    { name: "pink", hex: "#f9a8d4" },
  ];

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-800 text-white shadow-2xl rounded-xl p-2 flex gap-2 items-center z-50 animate-in fade-in slide-in-from-bottom-4">
      {colors.map((color) => (
        <button
          key={color.name}
          className="w-8 h-8 rounded-full border-2 border-slate-700 hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-white"
          style={{ backgroundColor: color.hex }}
          title={`Highlight in ${color.name}`}
          onClick={() => onCreateHighlight(color.name)}
        />
      ))}
      <div className="w-px h-6 bg-slate-600 mx-1" />
      <button
        onClick={() => onHighlightAndNote("yellow")}
        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
        title="Highlight and add note"
      >
        <MessageSquarePlus size={18} className="text-indigo-400" />
      </button>
    </div>
  );
}
