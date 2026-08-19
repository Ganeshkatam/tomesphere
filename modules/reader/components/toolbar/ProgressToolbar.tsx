"use client";

import { useReaderStore } from "@/modules/reader/state/reader-store";
import { ReaderService } from "@/modules/reader/application/ReaderService";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

interface ProgressToolbarProps {
  service: ReaderService | null;
}

export function ProgressToolbar({ service }: ProgressToolbarProps) {
  const { sessionState, rendererReady, isReading, currentAnchor, preferences, updatePreference } = useReaderStore();

  const currentPage = currentAnchor?.value || "1";

  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-1">
        <button
          onClick={() => service?.previous()}
          disabled={!rendererReady || !service}
          className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Previous Page (Left Arrow)"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-sm font-medium text-slate-300 min-w-[60px] text-center">
          Page {currentPage}
        </span>
        <button
          onClick={() => service?.next()}
          disabled={!rendererReady || !service}
          className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Next Page (Right Arrow or Space)"
        >
          <ChevronRight size={20} />
        </button>

        <div className="w-px h-5 bg-slate-700 mx-2" />

        <button
          onClick={() => {
            const newZoom = Math.max(50, preferences.zoom - 10);
            updatePreference("zoom", newZoom);
            service?.applyPreferences({ ...preferences, zoom: newZoom });
          }}
          disabled={!rendererReady || !service}
          className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Zoom Out"
        >
          <ZoomOut size={18} />
        </button>
        <span className="text-xs font-medium text-slate-400 w-10 text-center">
          {preferences.zoom}%
        </span>
        <button
          onClick={() => {
            const newZoom = Math.min(270, preferences.zoom + 10);
            updatePreference("zoom", newZoom);
            service?.applyPreferences({ ...preferences, zoom: newZoom });
          }}
          disabled={!rendererReady || !service}
          className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Zoom In"
        >
          <ZoomIn size={18} />
        </button>
      </div>

      <div className="text-xs font-medium text-slate-500 hidden sm:block">
        {!rendererReady ? (
          <span>Loading...</span>
        ) : (
          <span>
            {isReading
              ? "Reading"
              : sessionState === "paused"
                ? "Paused"
                : "Ready"}
          </span>
        )}
      </div>
    </div>
  );
}
