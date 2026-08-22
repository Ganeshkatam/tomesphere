"use client";

import { useReaderStore } from "../../state/reader-store";
import { ReaderService } from "../../application/ReaderService";
import {
  Bookmark,
  MessageSquare,
  Clock,
  Trash2,
  X,
  ChevronRight,
  Search,
  List,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface AnnotationSidebarProps {
  service: ReaderService | null;
}

export function AnnotationSidebar({ service }: AnnotationSidebarProps) {
  const { sidebarOpen, setSidebarOpen, sidebarTab, setSidebarTab, preferences } =
    useReaderStore();
  const theme = preferences.theme || "light";

  if (!sidebarOpen || !service) return null;

  const annotations = service.getAnnotations();
  const bookmarkViews = service.getBookmarkViews();

  const handleTabChange = (
    tab: "annotations" | "bookmarks" | "toc" | "search",
  ) => {
    setSidebarTab(tab);
  };

  const themeStyles = {
    light: {
      sidebar: "bg-white border-l border-slate-200 text-slate-800 shadow-xl",
      headerBorder: "border-slate-200 bg-slate-50/50",
      closeBtn: "text-slate-400 hover:text-slate-700 hover:bg-slate-100",
      tabActive: "text-indigo-600 border-b-2 border-indigo-600 font-bold",
      tabInactive: "text-slate-500 hover:text-slate-900",
      card: "bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-slate-100/80 shadow-xs",
      cardActive: "ring-2 ring-indigo-500 border-indigo-500 bg-indigo-50/50",
      textPrimary: "text-slate-800",
      textSecondary: "text-slate-500",
      emptyText: "text-slate-400",
    },
    dark: {
      sidebar: "bg-slate-900 border-l border-slate-800 text-slate-100 shadow-2xl",
      headerBorder: "border-slate-800 bg-slate-950/40",
      closeBtn: "text-slate-400 hover:text-white hover:bg-slate-800",
      tabActive: "text-white border-b-2 border-indigo-500 font-bold",
      tabInactive: "text-slate-400 hover:text-slate-200",
      card: "bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 hover:border-slate-600",
      cardActive: "ring-2 ring-indigo-500 border-indigo-500 bg-indigo-950/40",
      textPrimary: "text-slate-200",
      textSecondary: "text-slate-400",
      emptyText: "text-slate-500",
    },
    sepia: {
      sidebar: "bg-[#fbf0d9] border-l border-[#dfd3b9] text-[#5b4636] shadow-xl",
      headerBorder: "border-[#dfd3b9] bg-[#ede3cc]/40",
      closeBtn: "text-[#8a725b] hover:text-[#5b4636] hover:bg-[#ede3cc]",
      tabActive: "text-[#8b5a2b] border-b-2 border-[#8b5a2b] font-bold",
      tabInactive: "text-[#8a725b] hover:text-[#5b4636]",
      card: "bg-[#ede3cc] border border-[#dfd3b9] hover:bg-[#e4d9bf] hover:border-[#c87a32]/50 shadow-xs",
      cardActive: "ring-2 ring-[#c87a32] border-[#c87a32] bg-[#f4ecd8]",
      textPrimary: "text-[#5b4636]",
      textSecondary: "text-[#8a725b]",
      emptyText: "text-[#8a725b]",
    },
  }[theme];

  return (
    <div
      className={`w-80 flex flex-col h-full z-40 shrink-0 select-none animate-in slide-in-from-right duration-200 transition-colors ${themeStyles.sidebar}`}
    >
      {/* Top Header with Title and Close Button */}
      <div
        className={`flex items-center justify-between px-4 py-3 border-b transition-colors ${themeStyles.headerBorder}`}
      >
        <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider">
          {sidebarTab === "annotations" && `Annotations (${annotations.length})`}
          {sidebarTab === "bookmarks" && `Bookmarks (${bookmarkViews.length})`}
          {sidebarTab === "toc" && "Table of Contents"}
          {sidebarTab === "search" && "Search Volume"}
        </h3>

        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${themeStyles.closeBtn}`}
          title="Close Sidebar"
        >
          <X size={17} />
        </button>
      </div>

      {/* Tabs */}
      <div className={`flex border-b transition-colors ${themeStyles.headerBorder}`}>
        <button
          type="button"
          onClick={() => handleTabChange("annotations")}
          className={`flex-1 py-2.5 text-xs font-semibold transition-colors cursor-pointer text-center ${
            sidebarTab === "annotations"
              ? themeStyles.tabActive
              : themeStyles.tabInactive
          }`}
        >
          Notes ({annotations.length})
        </button>
        <button
          type="button"
          onClick={() => handleTabChange("bookmarks")}
          className={`flex-1 py-2.5 text-xs font-semibold transition-colors cursor-pointer text-center ${
            sidebarTab === "bookmarks"
              ? themeStyles.tabActive
              : themeStyles.tabInactive
          }`}
        >
          Bookmarks ({bookmarkViews.length})
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {sidebarTab === "annotations" && annotations.length === 0 && (
          <div className={`text-center mt-12 text-xs sm:text-sm ${themeStyles.emptyText}`}>
            No highlights or notes yet.
          </div>
        )}

        {sidebarTab === "annotations" &&
          annotations.map(({ highlight, note }) => (
            <div
              key={highlight.id}
              className={`rounded-xl p-3 transition-all cursor-pointer group ${themeStyles.card}`}
              onClick={() =>
                service.goToLocation(highlight.selectionAnchor.start)
              }
            >
              {/* Header: Color & Date */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: highlight.color }}
                  />
                  {note && (
                    <MessageSquare size={13} className="text-indigo-500" />
                  )}
                </div>
                <div className={`flex items-center gap-1 text-[11px] ${themeStyles.textSecondary}`}>
                  <Clock size={11} />
                  {note
                    ? formatDistanceToNow(new Date(note.updatedAt), {
                        addSuffix: true,
                      })
                    : "Just now"}
                </div>
              </div>

              {/* Highlight Text Preview */}
              <p
                className={`text-xs sm:text-sm line-clamp-3 mb-2 italic border-l-2 pl-2.5 font-serif ${themeStyles.textPrimary}`}
                style={{ borderColor: highlight.color }}
              >
                {highlight.selectedText}
              </p>

              {/* Note Preview */}
              {note && (
                <p className={`text-xs line-clamp-2 mt-1 ${themeStyles.textSecondary}`}>
                  {note.bodyMarkdown}
                </p>
              )}
            </div>
          ))}

        {sidebarTab === "bookmarks" && bookmarkViews.length === 0 && (
          <div className={`text-center mt-12 text-xs sm:text-sm ${themeStyles.emptyText}`}>
            No bookmarks yet.
          </div>
        )}

        {sidebarTab === "bookmarks" &&
          bookmarkViews.map(({ bookmark, isCurrent, preview }) => {
            const label =
              bookmark.label ||
              `Bookmark • ${new Date(bookmark.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}`;

            return (
              <div
                key={bookmark.id}
                className={`rounded-xl p-3 transition-all cursor-pointer group flex items-start justify-between ${
                  isCurrent ? themeStyles.cardActive : themeStyles.card
                }`}
                onClick={() => service.goToLocation(bookmark.anchor)}
              >
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Bookmark
                      size={14}
                      className={
                        isCurrent
                          ? "text-amber-500 fill-current"
                          : "text-amber-400"
                      }
                    />
                    <span className={`text-xs sm:text-sm font-semibold truncate ${themeStyles.textPrimary}`}>
                      {label}
                    </span>
                  </div>
                  {preview && (
                    <p className={`text-xs line-clamp-2 mt-0.5 ${themeStyles.textSecondary}`}>
                      {preview}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    service.deleteBookmark(bookmark.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-all cursor-pointer"
                  title="Delete bookmark"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default AnnotationSidebar;
