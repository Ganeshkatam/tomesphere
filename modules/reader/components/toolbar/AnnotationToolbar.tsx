"use client";

import { useReaderStore } from "@/modules/reader/state/reader-store";
import { ReaderService } from "@/modules/reader/application/ReaderService";
import { Bookmark, MessageSquare } from "lucide-react";
import { useMemo } from "react";

interface AnnotationToolbarProps {
  service: ReaderService | null;
}

export function AnnotationToolbar({ service }: AnnotationToolbarProps) {
  const {
    bookmarks,
    currentAnchor,
    sidebarOpen,
    sidebarTab,
    setSidebarOpen,
    setSidebarTab,
    preferences,
  } = useReaderStore();

  const theme = preferences.theme || "light";

  const isBookmarked = useMemo(() => {
    if (!service || !bookmarks || currentAnchor === undefined) return false;
    return service.isCurrentLocationBookmarked();
  }, [service, bookmarks, currentAnchor]);

  const isNotesActive =
    sidebarOpen && (sidebarTab === "annotations" || sidebarTab === "bookmarks");

  const themeStyles = {
    light: {
      btn: "text-slate-700 hover:text-slate-900 hover:bg-slate-100",
      activeBtn: "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-500/20",
      bookmarkActive: "text-amber-600 bg-amber-50 ring-1 ring-amber-500/20",
    },
    dark: {
      btn: "text-slate-200 hover:text-white hover:bg-white/10",
      activeBtn: "bg-indigo-950/60 text-indigo-400 ring-1 ring-indigo-500/30",
      bookmarkActive: "text-amber-400 bg-amber-950/60 ring-1 ring-amber-500/30",
    },
    sepia: {
      btn: "text-[#5b4636] hover:text-[#382b21] hover:bg-[#ede3cc]",
      activeBtn: "bg-[#ede3cc] text-[#8b5a2b] ring-1 ring-[#c87a32]/30",
      bookmarkActive: "text-[#c87a32] bg-[#ede3cc] ring-1 ring-[#c87a32]/30",
    },
  }[theme];

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => service?.toggleBookmark()}
        className={`p-2 rounded-xl transition-colors cursor-pointer ${
          isBookmarked ? themeStyles.bookmarkActive : themeStyles.btn
        }`}
        title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
      >
        <Bookmark size={18} className={isBookmarked ? "fill-current" : ""} />
      </button>

      <button
        type="button"
        onClick={() => {
          if (isNotesActive) {
            setSidebarOpen(false);
          } else {
            setSidebarTab("annotations");
            setSidebarOpen(true);
          }
        }}
        className={`p-2 rounded-xl transition-colors cursor-pointer ${
          isNotesActive ? themeStyles.activeBtn : themeStyles.btn
        }`}
        title="Notes & Bookmarks"
      >
        <MessageSquare size={18} />
      </button>
    </div>
  );
}

export default AnnotationToolbar;
