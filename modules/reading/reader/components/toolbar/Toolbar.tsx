"use client";

import { useReaderStore } from "@/modules/reading/reader/state/reader-store";
import { ReaderService } from "@/modules/reading/reader/application/ReaderService";
import { ChevronLeft, Menu, Settings, Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

interface ToolbarProps {
  service: ReaderService | null;
}

export function Toolbar({ service }: ToolbarProps) {
  const router = useRouter();
  const {
    sessionState,
    rendererReady,
    isReading,
    sidebarOpen,
    bookmarks,
    currentAnchor,
  } = useReaderStore();

  // Recompute when bookmarks or current anchor changes
  const isBookmarked = useMemo(() => {
    // We reference bookmarks and currentAnchor to trigger re-evaluation
    if (!service || !bookmarks || currentAnchor === undefined) return false;
    return service.isCurrentLocationBookmarked();
  }, [service, bookmarks, currentAnchor]);

  const handleBookmark = () => {
    service?.toggleBookmark();
  };

  const handleMenu = () => {
    useReaderStore.getState().setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="h-14 bg-slate-900 border-b border-white/10 flex items-center justify-between px-4 sticky top-0 z-50">
      {/* Left Section */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
          title="Back to Library"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={handleMenu}
          className={`p-2 rounded-lg transition-colors ${sidebarOpen ? "bg-indigo-600 text-white" : "hover:bg-white/5 text-slate-400 hover:text-white"}`}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Center Section: Status */}
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

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleBookmark}
          className={`p-2 rounded-lg transition-colors ${isBookmarked ? "text-indigo-400 hover:bg-indigo-400/10" : "hover:bg-white/5 text-slate-400 hover:text-white"}`}
          title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
        >
          <Bookmark size={20} className={isBookmarked ? "fill-current" : ""} />
        </button>
        <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
          <Settings size={20} />
        </button>
      </div>
    </div>
  );
}
