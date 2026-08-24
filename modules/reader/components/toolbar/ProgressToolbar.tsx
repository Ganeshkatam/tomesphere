"use client";

import { useReaderStore } from "@/modules/reader/state/reader-store";
import { ReaderService } from "@/modules/reader/application/ReaderService";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

interface ProgressToolbarProps {
  service: ReaderService | null;
}

export function ProgressToolbar({ service }: ProgressToolbarProps) {
  const {
    sessionState,
    rendererReady,
    isReading,
    currentAnchor,
    preferences,
    updatePreference,
  } = useReaderStore();

  const theme = preferences.theme || "light";
  const currentPage = currentAnchor?.value || "1";

  const themeStyles = {
    light: {
      btn: "text-slate-700 hover:text-slate-900 hover:bg-slate-100",
      pageText: "text-slate-800",
      zoomText: "text-slate-600",
      divider: "bg-slate-200",
      statusText: "text-slate-500",
      readingDot: "bg-emerald-500",
      idleDot: "bg-slate-400",
    },
    dark: {
      btn: "text-slate-200 hover:text-white hover:bg-white/10",
      pageText: "text-slate-100",
      zoomText: "text-slate-300",
      divider: "bg-[#3c4043]",
      statusText: "text-slate-400",
      readingDot: "bg-emerald-400",
      idleDot: "bg-slate-500",
    },
    sepia: {
      btn: "text-[#5b4636] hover:text-[#382b21] hover:bg-[#ede3cc]",
      pageText: "text-[#5b4636]",
      zoomText: "text-[#8a725b]",
      divider: "bg-[#dfd3b9]",
      statusText: "text-[#8a725b]",
      readingDot: "bg-emerald-600",
      idleDot: "bg-[#8a725b]",
    },
  }[theme];

  return (
    <div className="flex items-center gap-4 sm:gap-6">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => service?.previous()}
          disabled={!rendererReady || !service}
          className={`p-1.5 rounded-xl transition-colors cursor-pointer disabled:opacity-30 disabled:hover:bg-transparent ${themeStyles.btn}`}
          title="Previous Page (Left Arrow)"
        >
          <ChevronLeft size={18} />
        </button>
        <span className={`text-xs sm:text-sm font-bold min-w-[56px] text-center font-mono ${themeStyles.pageText}`}>
          Page {currentPage}
        </span>
        <button
          type="button"
          onClick={() => service?.next()}
          disabled={!rendererReady || !service}
          className={`p-1.5 rounded-xl transition-colors cursor-pointer disabled:opacity-30 disabled:hover:bg-transparent ${themeStyles.btn}`}
          title="Next Page (Right Arrow or Space)"
        >
          <ChevronRight size={18} />
        </button>

        <div className={`w-px h-4 mx-1.5 sm:mx-2 ${themeStyles.divider}`} />

        <button
          type="button"
          onClick={() => {
            const newZoom = Math.max(80, (preferences.zoom || 100) - 10);
            updatePreference("zoom", newZoom);
            service?.applyPreferences({ ...preferences, zoom: newZoom });
          }}
          disabled={!rendererReady || !service || (preferences.zoom || 100) <= 80}
          className={`p-1.5 rounded-xl transition-colors cursor-pointer disabled:opacity-30 disabled:hover:bg-transparent ${themeStyles.btn}`}
          title="Zoom Out (Min 80%)"
        >
          <ZoomOut size={16} />
        </button>
        <span className={`text-xs font-semibold w-10 text-center font-mono ${themeStyles.zoomText}`}>
          {preferences.zoom || 100}%
        </span>
        <button
          type="button"
          onClick={() => {
            const newZoom = Math.min(300, (preferences.zoom || 100) + 10);
            updatePreference("zoom", newZoom);
            service?.applyPreferences({ ...preferences, zoom: newZoom });
          }}
          disabled={!rendererReady || !service || (preferences.zoom || 100) >= 300}
          className={`p-1.5 rounded-xl transition-colors cursor-pointer disabled:opacity-30 disabled:hover:bg-transparent ${themeStyles.btn}`}
          title="Zoom In (Max 300%)"
        >
          <ZoomIn size={16} />
        </button>
      </div>

      <div className={`text-xs font-semibold hidden md:block ${themeStyles.statusText}`}>
        {!rendererReady ? (
          <span>Loading...</span>
        ) : (
          <span className="inline-flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${isReading ? `${themeStyles.readingDot} animate-pulse` : themeStyles.idleDot}`}
            />
            <span>
              {isReading
                ? "Reading"
                : sessionState === "paused"
                  ? "Paused"
                  : "Ready"}
            </span>
          </span>
        )}
      </div>
    </div>
  );
}

export default ProgressToolbar;
