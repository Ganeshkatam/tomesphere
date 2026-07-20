"use client";

import { useReaderStore } from "@/modules/reader/state/reader-store";

export function ProgressToolbar() {
  const { sessionState, rendererReady, isReading } = useReaderStore();

  return (
    <div className="flex items-center gap-4">
      <div className="text-sm font-medium text-slate-300">
        {!rendererReady ? (
          <span className="text-slate-500">Loading...</span>
        ) : (
          <span className="text-slate-300">
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
