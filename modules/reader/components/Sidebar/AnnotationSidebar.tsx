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
  Copy,
  Check,
  Pencil,
  MessageSquarePlus,
  ExternalLink,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

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
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [colorPickerId, setColorPickerId] = useState<string | null>(null);

  if (!sidebarOpen || !service) return null;

  const annotations = service.getAnnotations();
  const bookmarkViews = service.getBookmarkViews();

  const handleCopy = (text: string, id: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1600);
    }
  };

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
              className={`rounded-2xl p-3.5 transition-all group relative border ${themeStyles.card}`}
            >
              {/* Header: Color, Page Badge, Timestamp & Action Buttons */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs ring-1 ring-black/10"
                    style={{ backgroundColor: highlight.color }}
                  />
                  <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-black/5 dark:bg-white/10 text-slate-500 dark:text-slate-400">
                    p. {highlight.selectionAnchor?.start?.value || "1"}
                  </span>
                  {note && (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                      <MessageSquare size={12} />
                      Note
                    </span>
                  )}
                </div>

                {/* Options Toolbar on each Note card */}
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(highlight.selectedText, highlight.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    title={copiedId === highlight.id ? "Copied!" : "Copy quote"}
                  >
                    {copiedId === highlight.id ? (
                      <Check size={13} className="text-emerald-500" />
                    ) : (
                      <Copy size={13} />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      service.openNoteForHighlight(highlight.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    title={note ? "Edit attached note" : "Add note"}
                  >
                    {note ? <Pencil size={13} /> : <MessageSquarePlus size={13} />}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      service.goToLocation(highlight.selectionAnchor.start);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    title="Jump to location"
                  >
                    <ExternalLink size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      service.deleteHighlight(highlight.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                    title="Delete highlight"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Highlight Quote Text */}
              <div
                className="cursor-pointer"
                onClick={() =>
                  service.goToLocation(highlight.selectionAnchor.start)
                }
              >
                <p
                  className={`text-xs sm:text-sm line-clamp-3 mb-2 italic border-l-2 pl-2.5 font-serif transition-colors ${themeStyles.textPrimary}`}
                  style={{ borderColor: highlight.color }}
                >
                  {highlight.selectedText}
                </p>

                {/* Attached Note Box */}
                {note ? (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                        <MessageSquare size={11} /> Note
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {formatDistanceToNow(new Date(note.updatedAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p
                      className={`text-xs whitespace-pre-wrap ${themeStyles.textPrimary}`}
                    >
                      {note.bodyMarkdown}
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      service.openNoteForHighlight(highlight.id);
                    }}
                    className="mt-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <MessageSquarePlus size={12} />
                    Add note to this highlight
                  </button>
                )}
              </div>
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
