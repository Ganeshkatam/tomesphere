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
  const {
    sidebarOpen,
    setSidebarOpen,
    sidebarTab,
    setSidebarTab,
    preferences,
    tableOfContents,
    totalPages,
  } = useReaderStore();
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
      textPrimary: "text-slate-900",
      textSecondary: "text-slate-500",
      emptyText: "text-slate-400",
    },
    dark: {
      sidebar: "bg-[#1e2227] border-l border-[#2e3440] text-slate-200 shadow-2xl",
      headerBorder: "border-[#2e3440] bg-[#1a1d21]",
      closeBtn: "text-slate-400 hover:text-white hover:bg-slate-800",
      tabActive: "text-indigo-400 border-b-2 border-indigo-400 font-bold",
      tabInactive: "text-slate-400 hover:text-slate-200",
      card: "bg-[#252930] border border-[#333a46] hover:border-slate-600 hover:bg-[#2b3039] shadow-xs",
      cardActive: "ring-2 ring-indigo-400 border-indigo-400 bg-indigo-950/30",
      textPrimary: "text-slate-100",
      textSecondary: "text-slate-400",
      emptyText: "text-slate-500",
    },
    sepia: {
      sidebar: "bg-[#f4ecd8] border-l border-[#e4d7b8] text-[#5b4636] shadow-xl",
      headerBorder: "border-[#e4d7b8] bg-[#ebdcb8]",
      closeBtn: "text-[#8a725b] hover:text-[#382b21] hover:bg-[#e4d7b8]",
      tabActive: "text-[#8b5a2b] border-b-2 border-[#8b5a2b] font-bold",
      tabInactive: "text-[#8a725b] hover:text-[#5b4636]",
      card: "bg-[#ebdcb8] border border-[#ddcaa1] hover:border-[#8b5a2b] hover:bg-[#e2d0a7] shadow-xs",
      cardActive: "ring-2 ring-[#8b5a2b] border-[#8b5a2b] bg-[#e4d7b8]",
      textPrimary: "text-[#382b21]",
      textSecondary: "text-[#755c48]",
      emptyText: "text-[#8a725b]",
    },
  }[theme];

  return (
    <div
      className={`fixed right-0 top-0 bottom-0 w-80 sm:w-96 z-40 flex flex-col transition-all duration-300 transform translate-x-0 ${themeStyles.sidebar}`}
    >
      {/* Top Header with Title and Close Button */}
      <div
        className={`flex items-center justify-between px-4 py-3 border-b transition-colors ${themeStyles.headerBorder}`}
      >
        <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider">
          {sidebarTab === "annotations" && `Annotations (${annotations.length})`}
          {sidebarTab === "bookmarks" && `Bookmarks (${bookmarkViews.length})`}
          {sidebarTab === "toc" && `Table of Contents (${tableOfContents.length || totalPages})`}
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
          onClick={() => handleTabChange("toc")}
          className={`flex-1 py-2.5 text-xs font-semibold transition-colors cursor-pointer text-center ${
            sidebarTab === "toc"
              ? themeStyles.tabActive
              : themeStyles.tabInactive
          }`}
        >
          Contents
        </button>
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
        {/* TAB: Table of Contents */}
        {sidebarTab === "toc" && (
          <div className="space-y-1.5">
            {tableOfContents.length > 0 ? (
              tableOfContents.map((item) => (
                <div key={item.id} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      service.goToLocation({ type: "pdf", value: String(item.pageNumber) });
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between text-xs group ${themeStyles.card}`}
                  >
                    <span className={`font-semibold truncate pr-2 ${themeStyles.textPrimary}`}>
                      {item.title}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 shrink-0">
                      p. {item.pageNumber}
                    </span>
                  </button>

                  {item.items && item.items.length > 0 && (
                    <div className="pl-3 space-y-1 border-l border-slate-200 dark:border-slate-800 ml-2">
                      {item.items.map((sub) => (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => {
                            service.goToLocation({ type: "pdf", value: String(sub.pageNumber) });
                          }}
                          className={`w-full text-left p-2 rounded-lg transition-all cursor-pointer flex items-center justify-between text-[11px] ${themeStyles.card}`}
                        >
                          <span className={`truncate pr-2 ${themeStyles.textSecondary}`}>
                            {sub.title}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0">
                            p. {sub.pageNumber}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="space-y-1.5">
                <p className={`text-xs ${themeStyles.emptyText} mb-2`}>
                  No embedded outline found. Quick page navigation:
                </p>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => {
                      service.goToLocation({ type: "pdf", value: String(pageNum) });
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-between text-xs ${themeStyles.card}`}
                  >
                    <span className={`font-medium ${themeStyles.textPrimary}`}>
                      {pageNum === 1 ? "Page 1 • Cover & Title" : `Page ${pageNum}`}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 shrink-0">
                      p. {pageNum}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        
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
