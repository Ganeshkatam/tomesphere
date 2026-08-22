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

interface PageSideRailProps {
  service: ReaderService | null;
}

interface PageThumbnailItemProps {
  pageNum: number;
  isActive: boolean;
  isBookmarked: boolean;
  service: ReaderService | null;
  onClick: (pageNum: number) => void;
  activeRef?: React.RefObject<HTMLDivElement | null>;
}

function PageThumbnailItem({
  pageNum,
  isActive,
  isBookmarked,
  service,
  onClick,
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
      ref={isActive ? (activeRef as any) : null}
      onClick={() => onClick(pageNum)}
      className="flex flex-col items-center cursor-pointer group select-none py-1 w-full shrink-0"
    >
      {/* Sized precisely so 5 pages fit viewable vertically at a time */}
      <div
        ref={containerRef}
        className={`w-[100px] sm:w-[108px] md:w-[115px] aspect-[8.5/11] bg-white rounded-md relative overflow-hidden transition-all duration-150 ${cardBorderClass}`}
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

        {isBookmarked && (
          <div className="absolute top-1 right-1 text-amber-500 bg-black/60 p-0.5 rounded shadow-xs">
            <Bookmark size={11} className="fill-current" />
          </div>
        )}
      </div>

      {/* Page Number */}
      <span className={`text-xs font-semibold mt-1 font-mono transition-colors ${pageNumClass}`}>
        {pageNum}
      </span>
    </div>
  );
}

export function PageSideRail({ service }: PageSideRailProps) {
  const { sideRailOpen, currentAnchor, totalPages, bookmarks, preferences } =
    useReaderStore();
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
        <button
          type="button"
          onClick={() => setActiveTab("thumbnails")}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            activeTab === "thumbnails"
              ? railThemeStyles.activeTab
              : railThemeStyles.inactiveTab
          }`}
          title="Page Thumbnails"
        >
          <ImageIcon size={18} />
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("outline")}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            activeTab === "outline"
              ? railThemeStyles.activeTab
              : railThemeStyles.inactiveTab
          }`}
          title="Document Outline"
        >
          <List size={18} />
        </button>
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
                activeRef={activePageRef}
              />
            ))}
          </div>
        ) : (
          /* Document Outline View */
          <div className="flex-1 overflow-y-auto p-3 text-xs space-y-1.5 custom-scrollbar">
            <div
              className={`text-xs font-bold uppercase tracking-wider px-1.5 py-1 mb-1 ${railThemeStyles.tocHeader}`}
            >
              Table of Contents ({totalPages} Pages)
            </div>
            {pagesArray
              .filter((p) => p % 10 === 1)
              .map((pageNum, idx) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => handlePageClick(pageNum)}
                  className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition-colors cursor-pointer text-xs ${
                    currentPage >= pageNum && currentPage < pageNum + 10
                      ? railThemeStyles.tocActive
                      : railThemeStyles.tocInactive
                  }`}
                >
                  <span className="truncate">
                    {pageNum === 1
                      ? "Cover & Title Page"
                      : `Section ${idx + 1}`}
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
    </aside>
  );
}

export default PageSideRail;
