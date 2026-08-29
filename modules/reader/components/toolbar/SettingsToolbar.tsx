"use client";

import React, { useState, useEffect } from "react";
import { useReaderStore } from "@/modules/reader/state/reader-store";
import { ReaderService } from "@/modules/reader/application/ReaderService";
import { Settings, Maximize, Search, List } from "lucide-react";
import { useTheme } from "@/shared/providers/theme-context";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface SettingsToolbarProps {
  service: ReaderService | null;
  fileType?: "pdf" | "epub";
}

export function SettingsToolbar({ service, fileType }: SettingsToolbarProps) {
  const { preferences, updatePreference, sidebarOpen, sidebarTab, setSidebarOpen, setSidebarTab } =
    useReaderStore();
  const { theme: appTheme, setTheme: setAppTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const theme = preferences.theme || "light";

  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
    }
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "sepia") => {
    updatePreference("theme", newTheme);
    if (newTheme === "dark") {
      setAppTheme("dark");
    } else {
      setAppTheme("light");
    }
    if (service) {
      service.applyPreferences({ ...preferences, theme: newTheme });
    }
  };

  const adjustFontSize = (delta: number) => {
    const newSize = Math.max(12, Math.min(32, preferences.fontSize + delta));
    updatePreference("fontSize", newSize);
    if (service) {
      service.applyPreferences({ ...preferences, fontSize: newSize });
    }
  };

  const adjustZoom = (delta: number) => {
    const newZoom = Math.max(80, Math.min(300, (preferences.zoom || 100) + delta));
    updatePreference("zoom", newZoom);
    if (service) {
      service.applyPreferences({ ...preferences, zoom: newZoom });
    }
  };

  const themeStyles = {
    light: {
      btn: "text-slate-700 hover:text-slate-900 hover:bg-slate-100",
      activeBtn: "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-500/20",
      settingsActive: "bg-slate-200 text-slate-900",
      menuBg: "bg-white border-slate-200 text-slate-800",
      sectionHeader: "text-slate-500",
      pillInactive: "bg-slate-100 text-slate-700 hover:bg-slate-200",
      pillActive: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs",
      stepBtn: "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200",
      valueText: "text-slate-900",
    },
    dark: {
      btn: "text-slate-200 hover:text-white hover:bg-white/10",
      activeBtn: "bg-indigo-950/60 text-indigo-400 ring-1 ring-indigo-500/30",
      settingsActive: "bg-white/20 text-white",
      menuBg: "bg-[#28292c] border-[#3c4043] text-slate-100",
      sectionHeader: "text-slate-400",
      pillInactive: "bg-[#1c1d1f] text-slate-300 hover:bg-[#323338]",
      pillActive: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs",
      stepBtn: "bg-[#1c1d1f] text-slate-200 hover:bg-[#323338] border-[#3c4043]",
      valueText: "text-slate-100",
    },
    sepia: {
      btn: "text-[#5b4636] hover:text-[#382b21] hover:bg-[#ede3cc]",
      activeBtn: "bg-[#ede3cc] text-[#8b5a2b] ring-1 ring-[#c87a32]/30",
      settingsActive: "bg-[#ede3cc] text-[#5b4636]",
      menuBg: "bg-[#fbf0d9] border-[#dfd3b9] text-[#5b4636]",
      sectionHeader: "text-[#8a725b]",
      pillInactive: "bg-[#ede3cc] text-[#5b4636] hover:bg-[#e4d9bf]",
      pillActive: "bg-[#8b5a2b] hover:bg-[#794e25] text-[#fbf0d9] shadow-xs",
      stepBtn: "bg-[#ede3cc] text-[#5b4636] hover:bg-[#e4d9bf] border-[#dfd3b9]",
      valueText: "text-[#5b4636]",
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
              onClick={() => {
                if (sidebarOpen && sidebarTab === "search") {
                  setSidebarOpen(false);
                } else {
                  setSidebarTab("search");
                  setSidebarOpen(true);
                }
              }}
              aria-label="Search in Volume"
              aria-expanded={sidebarOpen && sidebarTab === "search"}
              className={`p-2 rounded-xl transition-colors cursor-pointer h-auto w-auto ${
                sidebarOpen && sidebarTab === "search"
                  ? themeStyles.activeBtn
                  : themeStyles.btn
              }`}
            >
              <Search size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Search in Volume</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                if (sidebarOpen && sidebarTab === "toc") {
                  setSidebarOpen(false);
                } else {
                  setSidebarTab("toc");
                  setSidebarOpen(true);
                }
              }}
              aria-label="Table of Contents"
              aria-expanded={sidebarOpen && sidebarTab === "toc"}
              className={`p-2 rounded-xl transition-colors cursor-pointer h-auto w-auto ${
                sidebarOpen && sidebarTab === "toc"
                  ? themeStyles.activeBtn
                  : themeStyles.btn
              }`}
            >
              <List size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Table of Contents</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              aria-label="Fullscreen Mode"
              className={`p-2 rounded-xl transition-colors cursor-pointer h-auto w-auto ${themeStyles.btn}`}
            >
              <Maximize size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Fullscreen Mode</TooltipContent>
        </Tooltip>

        <div className="relative">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label="Reader Settings"
                title="Reader Settings"
                aria-expanded={menuOpen}
                className={`p-2 rounded-xl transition-colors cursor-pointer h-auto w-auto ${
                  menuOpen ? themeStyles.settingsActive : themeStyles.btn
                }`}
              >
                <Settings size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reader Settings</TooltipContent>
          </Tooltip>

          {menuOpen && (
            <>
              {/* Click outside backdrop */}
              <div
                className="fixed inset-0 z-40 bg-transparent"
                onClick={() => setMenuOpen(false)}
                aria-hidden="true"
              />

              {/* Anchored popover card directly below Settings button */}
              <div
                role="dialog"
                aria-label="Reader Settings"
                className={`absolute right-0 top-full mt-2 z-50 w-72 sm:w-80 p-5 flex flex-col gap-4 shadow-2xl rounded-2xl border animate-in fade-in-0 zoom-in-95 duration-150 ${themeStyles.menuBg}`}
              >
                <div className="text-left space-y-1">
                  <h2 className="text-sm font-bold tracking-tight">Reader Settings</h2>
                  <p className="text-xs opacity-75">
                    Customize themes, typography, and display zoom.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Theme Selector (Unified reading theme) */}
                  <div>
                    <span className={`text-[11px] font-extrabold uppercase tracking-wider mb-2 block ${themeStyles.sectionHeader}`}>
                      Theme
                    </span>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={preferences.theme === "light" ? "default" : "secondary"}
                        size="sm"
                        onClick={() => handleThemeChange("light")}
                        className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer h-auto ${
                          preferences.theme === "light"
                            ? themeStyles.pillActive
                            : themeStyles.pillInactive
                        }`}
                      >
                        Light
                      </Button>
                      <Button
                        type="button"
                        variant={preferences.theme === "dark" ? "default" : "secondary"}
                        size="sm"
                        onClick={() => handleThemeChange("dark")}
                        className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer h-auto ${
                          preferences.theme === "dark"
                            ? themeStyles.pillActive
                            : themeStyles.pillInactive
                        }`}
                      >
                        Dark
                      </Button>
                      <Button
                        type="button"
                        variant={preferences.theme === "sepia" ? "default" : "secondary"}
                        size="sm"
                        onClick={() => handleThemeChange("sepia")}
                        className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer h-auto ${
                          preferences.theme === "sepia"
                            ? themeStyles.pillActive
                            : themeStyles.pillInactive
                        }`}
                      >
                        Sepia
                      </Button>
                    </div>
                  </div>

                  {/* Text Size (Only for EPUB / Reflowable books) */}
                  {fileType !== "pdf" && (
                    <div>
                      <span className={`text-[11px] font-extrabold uppercase tracking-wider mb-2 block ${themeStyles.sectionHeader}`}>
                        Text Size (EPUB)
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => adjustFontSize(-2)}
                          disabled={preferences.fontSize <= 12}
                          aria-label="Decrease Font Size"
                          className={`w-8 h-8 rounded-xl font-bold transition-colors cursor-pointer ${themeStyles.stepBtn}`}
                        >
                          -
                        </Button>
                        <span className={`flex-1 text-center text-xs font-bold font-mono ${themeStyles.valueText}`}>
                          {preferences.fontSize}px
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => adjustFontSize(2)}
                          disabled={preferences.fontSize >= 32}
                          aria-label="Increase Font Size"
                          className={`w-8 h-8 rounded-xl font-bold transition-colors cursor-pointer ${themeStyles.stepBtn}`}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Zoom (For PDF / Fixed-layout books) */}
                  {fileType !== "epub" && (
                    <div>
                      <span className={`text-[11px] font-extrabold uppercase tracking-wider mb-2 block ${themeStyles.sectionHeader}`}>
                        Zoom (PDF)
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => adjustZoom(-10)}
                          disabled={(preferences.zoom || 100) <= 80}
                          aria-label="Zoom Out"
                          className={`w-8 h-8 rounded-xl font-bold transition-colors cursor-pointer ${themeStyles.stepBtn}`}
                        >
                          -
                        </Button>
                        <span className={`flex-1 text-center text-xs font-bold font-mono ${themeStyles.valueText}`}>
                          {preferences.zoom || 100}%
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => adjustZoom(10)}
                          disabled={(preferences.zoom || 100) >= 300}
                          aria-label="Zoom In"
                          className={`w-8 h-8 rounded-xl font-bold transition-colors cursor-pointer ${themeStyles.stepBtn}`}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}

export default SettingsToolbar;
