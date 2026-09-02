"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { useReaderStore } from "../../state/reader-store";
import { ReaderService } from "../../application/ReaderService";
import {
  Image as ImageIcon,
  List,
  Bookmark,
  Loader2,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageSideRailProps {
  service: ReaderService | null;
}

interface PageThumbnailItemProps {
  pageNum: number;
  isActive: boolean;
  isBookmarked: boolean;
  service: ReaderService | null;
  onClick: (pageNum: number) => void;
  onToggleBookmark: (pageNum: number) => void;
  activeRef?: React.Ref<HTMLDivElement>;
}

function PageThumbnailItem({
  pageNum,
  isActive,
  isBookmarked,
  service,
  onClick,
  onToggleBookmark,
  activeRef,
}: PageThumbnailItemProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isRendered, setIsRendered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const theme = useReaderStore((state) => state.preferences.theme) || "light";

  useEffect(() => {
    if (!service || isRendered) return;

    const el = containerRef.current;
    if (!el) return;

    let isMounted = true;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isRendered) {
          setIsLoading(true);
          const canvas = canvasRef.current;
          if (canvas) {
            service
              .renderThumbnail(pageNum, canvas)
              .then(() => {
                if (isMounted) {
                  setIsRendered(true);
                  setHasError(false);
                }
              })
              .catch(() => {
                if (isMounted) {
                  setIsRendered(true);
                  setHasError(true);
                }
              })
              .finally(() => {
                if (isMounted) {
                  setIsLoading(false);
                }
              });
          }
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );

    observer.observe(el);
    return () => {
      isMounted = false;
      observer.disconnect();
    };
  }, [pageNum, service, isRendered]);

  const cardBorderClass = useMemo(() => {
    if (isActive) {
      if (theme === "sepia") return "ring-3 ring-[#c87a32]/35 border-2 border-[#c87a32] shadow-md";
      if (theme === "light") return "ring-3 ring-indigo-500/30 border-2 border-indigo-600 shadow-md";
      return "ring-3 ring-blue-500 border-2 border-blue-500 shadow-blue-500/25 shadow-lg";
    }
    if (theme === "sepia") return "border border-[#dfd3b9] group-hover:border-[#c87a32]/60 group-hover:shadow-xs";
    if (theme === "light") return "border border-slate-300 group-hover:border-slate-400 group-hover:shadow-xs";
    return "border border-neutral-700/70 group-hover:border-neutral-400 group-hover:shadow-xs";
  }, [isActive, theme]);

  const pageNumClass = useMemo(() => {
    if (isActive) {
      if (theme === "sepia") return "text-[#8b5a2b] font-bold";
      if (theme === "light") return "text-indigo-600 font-bold";
      return "text-blue-400 font-bold";
    }
    if (theme === "sepia") return "text-[#785e49] group-hover:text-[#5b4636]";
    if (theme === "light") return "text-slate-600 group-hover:text-slate-900";
    return "text-neutral-400 group-hover:text-neutral-200";
  }, [isActive, theme]);

  const placeholderBg = useMemo(() => {
    if (theme === "sepia") return "bg-[#ede3cc] text-[#8a725b]";
    if (theme === "light") return "bg-slate-100 text-slate-500";
    return "bg-neutral-850 text-neutral-400";
  }, [theme]);

  return (
    <div
      ref={isActive ? activeRef : undefined}
      className="flex flex-col items-center group select-none py-1 w-full shrink-0"
    >
      {/* Sized precisely so 5 pages fit viewable vertically at a time */}
      <div
        ref={containerRef}
        role="button"
        tabIndex={0}
        onClick={() => onClick(pageNum)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick(pageNum);
          }
        }}
        title={`Jump to Page ${pageNum}`}
        className={`w-[100px] sm:w-[108px] md:w-[115px] aspect-[8.5/11] bg-white rounded-md relative overflow-hidden transition-all duration-150 cursor-pointer focus:outline-none ${cardBorderClass}`}
      >
        <canvas
          ref={canvasRef}
          className={`w-full h-full object-contain pointer-events-none ${
            hasError ? "hidden" : "block"
          }`}
        />

        {hasError && (
          <div className={`absolute inset-0 flex flex-col items-center justify-center p-2 text-center ${placeholderBg}`}>
            <FileText size={18} className="mb-0.5 opacity-70" />
            <span className="text-[10px] font-mono font-bold">Page {pageNum}</span>
          </div>
        )}

        {!isRendered && !hasError && (
          <div className={`absolute inset-0 flex flex-col items-center justify-center text-xs font-mono ${placeholderBg}`}>
            {isLoading ? (
              <Loader2 size={16} className="animate-spin text-indigo-500" />
            ) : (
              <span>{pageNum}</span>
            )}
          </div>
        )}

        {/* Interactive Bookmark page toggle button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(pageNum);
          }}
          aria-label={
            isBookmarked
              ? `Remove bookmark for page ${pageNum}`
              : `Bookmark page ${pageNum}`
          }
          title={
            isBookmarked
              ? `Remove bookmark for page ${pageNum}`
              : `Bookmark page ${pageNum}`
          }
          className={`absolute top-1 right-1 p-1 rounded transition-all z-10 cursor-pointer ${
            isBookmarked
              ? "text-amber-500 bg-black/75 hover:bg-black/90 scale-100 shadow-sm"
              : "text-slate-300 bg-black/50 hover:text-amber-400 hover:bg-black/80 opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-sm"
          }`}
        >
          <Bookmark size={12} className={isBookmarked ? "fill-current" : ""} />
        </button>
      </div>

      {/* Page Number Button */}
      <button
        type="button"
        onClick={() => onClick(pageNum)}
        className={`text-xs font-semibold mt-1 font-mono transition-colors cursor-pointer hover:underline focus:outline-none ${pageNumClass}`}
        title={`Jump to Page ${pageNum}`}
      >
        {pageNum}
      </button>
    </div>
  );
}

export function PageSideRail({ service }: PageSideRailProps) {
  const {
    sideRailOpen,
    currentAnchor,
    totalPages,
    bookmarks,
    preferences,
    tableOfContents,
  } = useReaderStore();
  const theme = preferences.theme || "light";
  const [activeTab, setActiveTab] = useState<"thumbnails" | "outline">("thumbnails");
  const activePageRef = useRef<HTMLDivElement | null>(null);
  const railScrollContainerRef = useRef<HTMLDivElement | null>(null);

  const currentPage = useMemo(() => {
    const val = currentAnchor?.value;
    if (!val) return 1;
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? 1 : parsed;
  }, [currentAnchor]);

  const bookmarkedPages = useMemo(() => {
    const set = new Set<number>();
    bookmarks.forEach((bm) => {
      const p = parseInt(bm.anchor.value, 10);
      if (!isNaN(p)) set.add(p);
    });
    return set;
  }, [bookmarks]);

  useEffect(() => {
    if (sideRailOpen && activeTab === "thumbnails" && activePageRef.current) {
      activePageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [currentPage, sideRailOpen, activeTab]);

  const handlePageClick = (pageNum: number) => {
    if (!service) return;
    service.goToLocation({
      type: "pdf",
      value: String(pageNum),
    });
  };

  const handleToggleBookmark = (pageNum: number) => {
    service?.togglePageBookmark(pageNum);
  };

  const pagesArray = useMemo(() => {
    const total = Math.max(1, totalPages);
    const list: number[] = [];
    for (let i = 1; i <= total; i++) {
      list.push(i);
    }
    return list;
  }, [totalPages]);

  if (!sideRailOpen) return null;

  // Theme-aware container styles
  const railThemeStyles = {
    light: {
      aside: "bg-slate-50 border-r border-slate-200 text-slate-800",
      miniStrip: "bg-slate-100 border-r border-slate-200",
      activeTab: "bg-white text-indigo-600 shadow-xs",
      inactiveTab: "text-slate-500 hover:text-slate-900 hover:bg-slate-200/60",
      panel: "bg-slate-50",
      tocHeader: "text-slate-400",
      tocActive: "bg-indigo-50 text-indigo-700 font-semibold",
      tocInactive: "text-slate-700 hover:bg-slate-200/60 hover:text-slate-900",
      tocPageNum: "text-slate-400",
    },
    dark: {
      aside: "bg-[#202124] border-r border-[#3c4043] text-neutral-200",
      miniStrip: "bg-[#1c1d1f] border-r border-[#323639]",
      activeTab: "bg-[#323639] text-blue-400 shadow-xs",
      inactiveTab: "text-neutral-400 hover:text-neutral-200 hover:bg-[#282a2d]",
      panel: "bg-[#28292c]",
      tocHeader: "text-neutral-400",
      tocActive: "bg-blue-600/20 text-blue-400 font-semibold",
      tocInactive: "text-neutral-300 hover:bg-[#323639] hover:text-white",
      tocPageNum: "text-neutral-500",
    },
    sepia: {
      aside: "bg-[#fbf0d9] border-r border-[#dfd3b9] text-[#5b4636]",
      miniStrip: "bg-[#ede3cc] border-r border-[#dfd3b9]",
      activeTab: "bg-[#dfd3b9] text-[#8b5a2b] shadow-xs",
      inactiveTab: "text-[#8a725b] hover:text-[#5b4636] hover:bg-[#e4d9bf]",
      panel: "bg-[#fbf0d9]",
      tocHeader: "text-[#8a725b]",
      tocActive: "bg-[#ede3cc] text-[#8b5a2b] font-semibold",
      tocInactive: "text-[#5b4636] hover:bg-[#ede3cc] hover:text-[#382b21]",
      tocPageNum: "text-[#8a725b]",
    },
  }[theme];

  return (
    <aside
      className={`flex h-full z-40 shrink-0 select-none animate-in slide-in-from-left duration-150 transition-colors ${railThemeStyles.aside}`}
    >
      {/* 1. Leftmost Mini Tool Strip */}
      <div
        className={`w-11 flex flex-col items-center py-3.5 gap-2.5 transition-colors ${railThemeStyles.miniStrip}`}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setActiveTab("thumbnails")}
          aria-label="Page Thumbnails"
          aria-pressed={activeTab === "thumbnails"}
          className={`p-2 rounded-lg transition-colors cursor-pointer h-auto w-auto ${
            activeTab === "thumbnails"
              ? railThemeStyles.activeTab
              : railThemeStyles.inactiveTab
          }`}
        >
          <ImageIcon size={18} />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setActiveTab("outline")}
          aria-label="Document Outline"
          aria-pressed={activeTab === "outline"}
          className={`p-2 rounded-lg transition-colors cursor-pointer h-auto w-auto ${
            activeTab === "outline"
              ? railThemeStyles.activeTab
              : railThemeStyles.inactiveTab
          }`}
        >
          <List size={18} />
        </Button>
      </div>

      {/* 2. Main Increased-Width Rail Content Panel (5 pages viewable at a time) */}
      <div
        className={`w-48 sm:w-56 md:w-60 flex flex-col h-full overflow-hidden transition-colors ${railThemeStyles.panel}`}
      >
        {activeTab === "thumbnails" ? (
          <div
            ref={railScrollContainerRef}
            className="flex-1 overflow-y-auto py-3 px-3 space-y-2.5 custom-scrollbar flex flex-col items-center"
          >
            {pagesArray.map((pageNum) => (
              <PageThumbnailItem
                key={pageNum}
                pageNum={pageNum}
                isActive={pageNum === currentPage}
                isBookmarked={bookmarkedPages.has(pageNum)}
                service={service}
                onClick={handlePageClick}
                onToggleBookmark={handleToggleBookmark}
                activeRef={activePageRef}
              />
            ))}
          </div>
        ) : (
          /* Authentic Document Outline / Table of Contents View */
          <div className="flex-1 overflow-y-auto p-3 text-xs space-y-1 custom-scrollbar">
            <div
              className={`text-xs font-bold uppercase tracking-wider px-1.5 py-1 mb-2 ${railThemeStyles.tocHeader}`}
            >
              Table of Contents {tableOfContents.length > 0 ? `(${tableOfContents.length} Sections)` : `(${totalPages} Pages)`}
            </div>

            {tableOfContents.length > 0 ? (
              <div className="space-y-1">
                {tableOfContents.map((item) => {
                  const isCurrent = currentPage === item.pageNumber;

                  return (
                    <div key={item.id} className="space-y-1">
                      <button
                        type="button"
                        onClick={() => handlePageClick(item.pageNumber)}
                        className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition-colors cursor-pointer text-xs ${
                          isCurrent
                            ? railThemeStyles.tocActive
                            : railThemeStyles.tocInactive
                        }`}
                      >
                        <span className="truncate font-medium">{item.title}</span>
                        <span
                          className={`text-[11px] font-mono shrink-0 ml-1.5 ${railThemeStyles.tocPageNum}`}
                        >
                          p. {item.pageNumber}
                        </span>
                      </button>

                      {/* Nested sub-items */}
                      {item.items && item.items.length > 0 && (
                        <div className="pl-3 space-y-0.5 border-l border-slate-200/50 dark:border-slate-800 ml-2">
                          {item.items.map((sub) => {
                            const isSubCurrent = currentPage === sub.pageNumber;

                            return (
                              <button
                                key={sub.id}
                                type="button"
                                onClick={() => handlePageClick(sub.pageNumber)}
                                className={`w-full text-left px-2 py-1.5 rounded-md flex items-center justify-between transition-colors cursor-pointer text-[11px] ${
                                  isSubCurrent
                                    ? railThemeStyles.tocActive
                                    : railThemeStyles.tocInactive
                                }`}
                              >
                                <span className="truncate">{sub.title}</span>
                                <span
                                  className={`text-[10px] font-mono shrink-0 ml-1.5 ${railThemeStyles.tocPageNum}`}
                                >
                                  p. {sub.pageNumber}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* If PDF has no embedded metadata outline, show accurate page index markers */
              <div className="space-y-1">
                <div className="px-2 py-2 text-slate-400 dark:text-slate-500 text-[11px] italic mb-1">
                  This edition does not contain an embedded structural outline. Direct page navigation is enabled:
                </div>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => handlePageClick(pageNum)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer text-xs ${
                      currentPage === pageNum
                        ? railThemeStyles.tocActive
                        : railThemeStyles.tocInactive
                    }`}
                  >
                    <span className="truncate">
                      {pageNum === 1 ? "Page 1 • Cover / Title" : `Page ${pageNum}`}
                    </span>
                    <span
                      className={`text-[11px] font-mono shrink-0 ml-1.5 ${railThemeStyles.tocPageNum}`}
                    >
                      p. {pageNum}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}

export default PageSideRail;
