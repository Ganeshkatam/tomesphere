"use client";

import React, { useState, useEffect } from "react";
import { useReaderStore } from "@/modules/reader/state/reader-store";
import { ReaderService } from "@/modules/reader/application/ReaderService";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface ProgressToolbarProps {
  service: ReaderService | null;
}

const ZOOM_OPTIONS = [80, 90, 100, 110, 125, 150, 175, 200, 250, 300];

export function ProgressToolbar({ service }: ProgressToolbarProps) {
  const {
    sessionState,
    rendererReady,
    isReading,
    currentAnchor,
    preferences,
    updatePreference,
  } = useReaderStore();

  const [zoomMenuOpen, setZoomMenuOpen] = useState(false);

  useEffect(() => {
    if (!zoomMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoomMenuOpen]);

  const theme = preferences.theme || "light";
  const currentPage = currentAnchor?.value || "1";

  const themeStyles = {
    light: {
      btn: "text-slate-700 hover:text-slate-900 hover:bg-slate-100",
      pageText: "text-slate-800",
      zoomBtn: "text-slate-700 hover:text-slate-900 hover:bg-slate-100",
      divider: "bg-slate-200",
      statusText: "text-slate-500",
      readingDot: "bg-emerald-500",
      idleDot: "bg-slate-400",
      menuBg: "bg-white border-slate-200 text-slate-800 shadow-xl",
      menuItemActive: "bg-indigo-50 text-indigo-600 font-bold",
      menuItemInactive: "text-slate-700 hover:bg-slate-100",
      sectionHeader: "text-slate-400",
    },
    dark: {
      btn: "text-slate-200 hover:text-white hover:bg-white/10",
      pageText: "text-slate-100",
      zoomBtn: "text-slate-200 hover:text-white hover:bg-white/10",
      divider: "bg-[#3c4043]",
      statusText: "text-slate-400",
      readingDot: "bg-emerald-400",
      idleDot: "bg-slate-500",
      menuBg: "bg-[#28292c] border-[#3c4043] text-slate-100 shadow-2xl",
      menuItemActive: "bg-indigo-950/70 text-indigo-400 font-bold",
      menuItemInactive: "text-slate-300 hover:bg-white/5",
      sectionHeader: "text-slate-500",
    },
    sepia: {
      btn: "text-[#5b4636] hover:text-[#382b21] hover:bg-[#ede3cc]",
      pageText: "text-[#5b4636]",
      zoomBtn: "text-[#5b4636] hover:text-[#382b21] hover:bg-[#ede3cc]",
      divider: "bg-[#dfd3b9]",
      statusText: "text-[#8a725b]",
      readingDot: "bg-emerald-600",
      idleDot: "bg-[#8a725b]",
      menuBg: "bg-[#fbf0d9] border-[#dfd3b9] text-[#5b4636] shadow-xl",
      menuItemActive: "bg-[#ede3cc] text-[#8b5a2b] font-bold",
      menuItemInactive: "text-[#5b4636] hover:bg-[#ede3cc]/60",
      sectionHeader: "text-[#8a725b]",
    },
  }[theme];

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => service?.previous()}
                disabled={!rendererReady || !service}
                aria-label="Previous Page"
                className={`p-1.5 rounded-xl transition-colors cursor-pointer disabled:opacity-30 disabled:hover:bg-transparent h-auto w-auto ${themeStyles.btn}`}
              >
                <ChevronLeft size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Previous Page</TooltipContent>
          </Tooltip>

          <span className={`text-xs sm:text-sm font-bold min-w-[56px] text-center font-mono ${themeStyles.pageText}`}>
            Page {currentPage}
          </span>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => service?.next()}
                disabled={!rendererReady || !service}
                aria-label="Next Page"
                className={`p-1.5 rounded-xl transition-colors cursor-pointer disabled:opacity-30 disabled:hover:bg-transparent h-auto w-auto ${themeStyles.btn}`}
              >
                <ChevronRight size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Next Page</TooltipContent>
          </Tooltip>

          <div className={`w-px h-4 mx-1.5 sm:mx-2 ${themeStyles.divider}`} />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newZoom = Math.max(80, (preferences.zoom || 100) - 10);
                  updatePreference("zoom", newZoom);
                  service?.applyPreferences({ ...preferences, zoom: newZoom });
                }}
                disabled={!rendererReady || !service || (preferences.zoom || 100) <= 80}
                aria-label="Zoom Out"
                className={`p-1.5 rounded-xl transition-colors cursor-pointer disabled:opacity-30 disabled:hover:bg-transparent h-auto w-auto ${themeStyles.btn}`}
              >
                <ZoomOut size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom Out</TooltipContent>
          </Tooltip>

          <div className="relative">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setZoomMenuOpen((prev) => !prev)}
                  disabled={!rendererReady || !service}
                  aria-label="Select Zoom Level"
                  aria-expanded={zoomMenuOpen}
                  className={`px-1.5 py-1 h-auto rounded-lg text-xs font-semibold font-mono transition-colors cursor-pointer disabled:opacity-30 flex items-center gap-0.5 ${themeStyles.zoomBtn}`}
                >
                  <span>{preferences.zoom || 100}%</span>
                  <ChevronDown size={12} className="opacity-60" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Select Zoom Level</TooltipContent>
            </Tooltip>

            {zoomMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-transparent"
                  onClick={() => setZoomMenuOpen(false)}
                  aria-hidden="true"
                />
                <div
                  role="menu"
                  aria-label="Zoom Level Options"
                  className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 w-36 max-h-60 overflow-y-auto py-1 px-1 rounded-xl border animate-in fade-in-0 zoom-in-95 duration-150 ${themeStyles.menuBg}`}
                >
                  <div className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-1 ${themeStyles.sectionHeader}`}>
                    Zoom Level
                  </div>
                  {ZOOM_OPTIONS.map((opt) => {
                    const isSelected = (preferences.zoom || 100) === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          updatePreference("zoom", opt);
                          service?.applyPreferences({ ...preferences, zoom: opt });
                          setZoomMenuOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium font-mono flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected ? themeStyles.menuItemActive : themeStyles.menuItemInactive
                        }`}
                      >
                        <span>{opt}%</span>
                        {isSelected && <Check size={13} className="stroke-[2.5]" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newZoom = Math.min(300, (preferences.zoom || 100) + 10);
                  updatePreference("zoom", newZoom);
                  service?.applyPreferences({ ...preferences, zoom: newZoom });
                }}
                disabled={!rendererReady || !service || (preferences.zoom || 100) >= 300}
                aria-label="Zoom In"
                className={`p-1.5 rounded-xl transition-colors cursor-pointer disabled:opacity-30 disabled:hover:bg-transparent h-auto w-auto ${themeStyles.btn}`}
              >
                <ZoomIn size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom In</TooltipContent>
          </Tooltip>
        </div>

        <div className={`text-xs font-semibold hidden md:block ${themeStyles.statusText}`}>
          {!rendererReady ? (
            <span>Loading...</span>
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${isReading ? `${themeStyles.readingDot} animate-pulse` : themeStyles.idleDot}`}
              />
              <span>
                {isReading
                  ? "Reading"
                  : sessionState === "paused"
                    ? "Paused"
                    : "Ready"}
              </span>
            </span>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}

export default ProgressToolbar;

