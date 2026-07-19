"use client";

import { useReaderStore } from "../../state/reader-store";
import { ReaderService } from "../../application/ReaderService";
import { Bookmark, MessageSquare, Clock, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface AnnotationSidebarProps {
  service: ReaderService | null;
}

export function AnnotationSidebar({ service }: AnnotationSidebarProps) {
  const { sidebarOpen, sidebarTab } = useReaderStore();

  if (!sidebarOpen || !service) return null;

  const annotations = service.getAnnotations();
  const bookmarkViews = service.getBookmarkViews();

  const handleTabChange = (tab: "annotations" | "bookmarks") => {
    useReaderStore.getState().setSidebarTab(tab);
  };

  return (
    <div className="w-80 bg-slate-900 border-l border-white/10 flex flex-col h-full animate-in slide-in-from-right">
      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => handleTabChange("annotations")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            sidebarTab === "annotations"
              ? "text-white border-b-2 border-indigo-500"
              : "text-slate-400 hover:text-slate-300"
          }`}
        >
          Annotations ({annotations.length})
        </button>
        <button
          onClick={() => handleTabChange("bookmarks")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            sidebarTab === "bookmarks"
              ? "text-white border-b-2 border-indigo-500"
              : "text-slate-400 hover:text-slate-300"
          }`}
        >
          Bookmarks ({bookmarkViews.length})
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {sidebarTab === "annotations" && annotations.length === 0 && (
          <div className="text-center text-slate-500 mt-10 text-sm">
            No highlights or notes yet.
          </div>
        )}

        {sidebarTab === "annotations" &&
          annotations.map(({ highlight, note }) => (
            <div
              key={highlight.id}
              className="bg-slate-800/50 rounded-lg p-3 hover:bg-slate-800 transition-colors cursor-pointer group"
              onClick={() =>
                service.goToLocation(highlight.selectionAnchor.start)
              }
            >
              {/* Header: Color & Date */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: highlight.color }}
                  />
                  {note && (
                    <MessageSquare size={12} className="text-indigo-400" />
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock size={12} />
                  {note
                    ? formatDistanceToNow(new Date(note.updatedAt), {
                        addSuffix: true,
                      })
                    : "Just now"}
                </div>
              </div>

              {/* Highlight Text Preview */}
              <p
                className="text-slate-300 text-sm line-clamp-3 mb-2 italic border-l-2 pl-2"
                style={{ borderColor: highlight.color }}
              >
                {highlight.selectedText}
              </p>

              {/* Note Preview */}
              {note && (
                <p className="text-slate-400 text-sm line-clamp-2">
                  {note.bodyMarkdown}
                </p>
              )}
            </div>
          ))}

        {sidebarTab === "bookmarks" && bookmarkViews.length === 0 && (
          <div className="text-center text-slate-500 mt-10 text-sm">
            No bookmarks yet.
          </div>
        )}

        {sidebarTab === "bookmarks" &&
          bookmarkViews.map(({ bookmark, isCurrent, preview }) => {
            // Fallback to auto-generated label
            const label =
              bookmark.label ||
              `Bookmark • ${new Date(bookmark.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}`;

            return (
              <div
                key={bookmark.id}
                className={`bg-slate-800/50 rounded-lg p-3 transition-colors cursor-pointer group flex items-start justify-between ${
                  isCurrent ? "ring-1 ring-indigo-500" : "hover:bg-slate-800"
                }`}
                onClick={() => service.goToLocation(bookmark.anchor)}
              >
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Bookmark
                      size={14}
                      className={
                        isCurrent
                          ? "text-indigo-400 fill-current"
                          : "text-slate-400"
                      }
                    />
                    <span className="text-sm font-medium text-slate-200 truncate">
                      {label}
                    </span>
                  </div>
                  {preview && (
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {preview}
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    service.deleteBookmark(bookmark.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-red-400 hover:bg-white/5 rounded transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
}
