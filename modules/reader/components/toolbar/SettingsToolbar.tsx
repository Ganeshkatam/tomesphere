"use client";

import { useReaderStore } from "@/modules/reader/state/reader-store";
import { ReaderService } from "@/modules/reader/application/ReaderService";
import { Settings, Maximize, Search, List } from "lucide-react";
import { useState } from "react";

interface SettingsToolbarProps {
  service: ReaderService | null;
}

export function SettingsToolbar({ service }: SettingsToolbarProps) {
  const { preferences, updatePreference } = useReaderStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
    }
  };

  const handleThemeChange = (theme: "light" | "dark" | "sepia") => {
    updatePreference("theme", theme);
    if (service) {
      service.applyPreferences({ ...preferences, theme });
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
    const newZoom = Math.max(50, Math.min(300, preferences.zoom + delta));
    updatePreference("zoom", newZoom);
    if (service) {
      service.applyPreferences({ ...preferences, zoom: newZoom });
    }
  };

  return (
    <div className="flex items-center gap-2 relative">
      <button
        onClick={() => {
          useReaderStore.getState().setSidebarTab("search");
          useReaderStore.getState().setSidebarOpen(true);
        }}
        className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
        title="Search"
      >
        <Search size={20} />
      </button>

      <button
        onClick={() => {
          useReaderStore.getState().setSidebarTab("toc");
          useReaderStore.getState().setSidebarOpen(true);
        }}
        className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
        title="Table of Contents"
      >
        <List size={20} />
      </button>

      <button
        onClick={toggleFullscreen}
        className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
        title="Fullscreen"
      >
        <Maximize size={20} />
      </button>

      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className={`p-2 rounded-lg transition-colors ${menuOpen ? "bg-white/10 text-white" : "hover:bg-white/5 text-slate-400 hover:text-white"}`}
        title="Settings"
      >
        <Settings size={20} />
      </button>

      {menuOpen && (
        <div className="absolute top-12 right-0 w-64 bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-lg shadow-xl p-4 flex flex-col gap-4 z-50">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
              Theme
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleThemeChange("light")}
                className={`flex-1 py-1 px-2 rounded text-sm ${preferences.theme === "light" ? "bg-indigo-600 text-white" : "bg-slate-700 text-slate-300"}`}
              >
                Light
              </button>
              <button
                onClick={() => handleThemeChange("dark")}
                className={`flex-1 py-1 px-2 rounded text-sm ${preferences.theme === "dark" ? "bg-indigo-600 text-white" : "bg-slate-700 text-slate-300"}`}
              >
                Dark
              </button>
              <button
                onClick={() => handleThemeChange("sepia")}
                className={`flex-1 py-1 px-2 rounded text-sm ${preferences.theme === "sepia" ? "bg-indigo-600 text-white" : "bg-slate-700 text-slate-300"}`}
              >
                Sepia
              </button>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
              Text Size (EPUB)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => adjustFontSize(-2)}
                className="w-8 h-8 rounded bg-slate-700 text-slate-300 hover:bg-slate-600"
              >
                -
              </button>
              <span className="flex-1 text-center text-sm">
                {preferences.fontSize}px
              </span>
              <button
                onClick={() => adjustFontSize(2)}
                className="w-8 h-8 rounded bg-slate-700 text-slate-300 hover:bg-slate-600"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
              Zoom (PDF)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => adjustZoom(-10)}
                className="w-8 h-8 rounded bg-slate-700 text-slate-300 hover:bg-slate-600"
              >
                -
              </button>
              <span className="flex-1 text-center text-sm">
                {preferences.zoom}%
              </span>
              <button
                onClick={() => adjustZoom(10)}
                className="w-8 h-8 rounded bg-slate-700 text-slate-300 hover:bg-slate-600"
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
