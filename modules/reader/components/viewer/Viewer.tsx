"use client";

import { forwardRef } from "react";
import { useReaderStore } from "@/modules/reader/state/reader-store";
import { Loader2 } from "lucide-react";

export const Viewer = forwardRef<HTMLDivElement>((_, ref) => {
  const { rendererReady, preferences } = useReaderStore();
  const theme = preferences.theme || "light";

  const themeBg = {
    light: "bg-slate-100",
    dark: "bg-[#18191c]",
    sepia: "bg-[#f4ecd8]",
  }[theme];

  const textStyle = {
    light: "text-slate-600",
    dark: "text-slate-300",
    sepia: "text-[#5b4636]",
  }[theme];

  return (
    <div
      className={`w-full h-full overflow-hidden relative flex items-center justify-center transition-colors ${themeBg}`}
    >
      {/* Loading Overlay */}
      {!rendererReady && (
        <div
          className={`absolute inset-0 z-10 flex items-center justify-center transition-colors ${themeBg}`}
        >
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <span className={`ml-3 font-medium text-sm ${textStyle}`}>
            Loading book...
          </span>
        </div>
      )}

      {/* The EPUB.js or PDF.js renderer mounts into this div */}
      <div ref={ref} className="w-full h-full relative" />
    </div>
  );
});

Viewer.displayName = "Viewer";
