"use client";

import { forwardRef } from "react";
import { useReaderStore } from "@/modules/reader/state/reader-store";
import { Loader2 } from "lucide-react";

export const Viewer = forwardRef<HTMLDivElement>((_, ref) => {
  const { rendererReady } = useReaderStore();

  return (
    <div className="w-full h-full overflow-hidden bg-[var(--surface-default)] relative flex items-center justify-center">
      {/* Loading Overlay */}
      {!rendererReady && (
        <div className="absolute inset-0 z-10 bg-[var(--surface-default)] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-slate-300">Loading book...</span>
        </div>
      )}

      {/* The EPUB.js renderer will mount exactly into this div */}
      <div
        ref={ref}
        className="w-full h-full max-w-4xl mx-auto bg-white shadow-2xl relative"
      />
    </div>
  );
});

Viewer.displayName = "Viewer";
