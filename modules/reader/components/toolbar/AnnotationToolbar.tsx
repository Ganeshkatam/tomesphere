"use client";

import { useReaderStore } from "@/modules/reader/state/reader-store";
import { ReaderService } from "@/modules/reader/application/ReaderService";
import { Bookmark } from "lucide-react";
import { useMemo } from "react";

interface AnnotationToolbarProps {
  service: ReaderService | null;
}

export function AnnotationToolbar({ service }: AnnotationToolbarProps) {
  const { bookmarks, currentAnchor } = useReaderStore();

  const isBookmarked = useMemo(() => {
    if (!service || !bookmarks || currentAnchor === undefined) return false;
    return service.isCurrentLocationBookmarked();
  }, [service, bookmarks, currentAnchor]);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => service?.toggleBookmark()}
        className={`p-2 rounded-lg transition-colors ${isBookmarked ? "text-indigo-400 hover:bg-indigo-400/10" : "hover:bg-white/5 text-slate-400 hover:text-white"}`}
        title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
      >
        <Bookmark size={20} className={isBookmarked ? "fill-current" : ""} />
      </button>
    </div>
  );
}
