"use client";

import React, { useMemo } from "react";
import { useReaderStore } from "@/modules/reader/state/reader-store";
import { ReaderService } from "@/modules/reader/application/ReaderService";
import { Bookmark, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

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
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => service?.toggleBookmark()}
              aria-label={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
              aria-pressed={isBookmarked}
              className={`p-2 rounded-xl transition-colors cursor-pointer h-auto w-auto ${
                isBookmarked ? themeStyles.bookmarkActive : themeStyles.btn
              }`}
            >
              <Bookmark size={18} className={isBookmarked ? "fill-current" : ""} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isBookmarked ? "Remove Bookmark" : "Add Bookmark"}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                if (isNotesActive) {
                  setSidebarOpen(false);
                } else {
                  setSidebarTab("annotations");
                  setSidebarOpen(true);
                }
              }}
              aria-label="Notes & Bookmarks"
              aria-expanded={isNotesActive}
              className={`p-2 rounded-xl transition-colors cursor-pointer h-auto w-auto ${
                isNotesActive ? themeStyles.activeBtn : themeStyles.btn
              }`}
            >
              <MessageSquare size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Notes & Bookmarks</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

export default AnnotationToolbar;
