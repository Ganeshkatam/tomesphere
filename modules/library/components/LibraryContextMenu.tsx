"use client";

import { useState } from "react";
import { LibraryBookDto } from "../application/dto/response/LibraryBookDto";

interface LibraryContextMenuProps {
  book: LibraryBookDto;
  onClose: () => void;
  x: number;
  y: number;
}

export default function LibraryContextMenu({
  book,
  onClose,
  x,
  y,
}: LibraryContextMenuProps) {
  // Real implementation would have actions to move collections, update status, delete etc.
  return (
    <div
      className="fixed z-50 w-48 bg-[#1a1b26] border border-white/10 rounded-lg shadow-2xl overflow-hidden py-1"
      style={{ top: y, left: x }}
    >
      <div className="px-3 py-2 border-b border-white/5 mb-1">
        <div className="text-sm font-semibold truncate text-white">
          {book.title}
        </div>
      </div>

      <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
        Read
      </button>

      <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors flex justify-between items-center">
        <span>Change Status</span>
        <span>▸</span>
      </button>

      <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors flex justify-between items-center">
        <span>Add to Collection</span>
        <span>▸</span>
      </button>

      <div className="h-px bg-white/5 my-1" />

      <button className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 transition-colors">
        Remove from Library
      </button>

      {/* Backdrop to capture clicks outside */}
      <div
        className="fixed inset-0 z-[-1]"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />
    </div>
  );
}
