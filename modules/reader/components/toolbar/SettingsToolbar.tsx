"use client";

import { useReaderStore } from "@/modules/reader/state/reader-store";
import { ReaderService } from "@/modules/reader/application/ReaderService";
import { Settings, Maximize, Search, List } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/shared/providers/theme-context";

interface SettingsToolbarProps {
  service: ReaderService | null;
}

export function SettingsToolbar({ service }: SettingsToolbarProps) {
  const { preferences, updatePreference, sidebarOpen, sidebarTab, setSidebarOpen, setSidebarTab } =
    useReaderStore();
  const { theme: appTheme, setTheme: setAppTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const theme = preferences.theme || "light";

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
    }
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "sepia") => {
    updatePreference("theme", newTheme);
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
    const newZoom = Math.max(100, Math.min(240, (preferences.zoom || 100) + delta));
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
      menuBg: "bg-white border-slate-200 text-slate-800 shadow-2xl",
      sectionHeader: "text-slate-500",
      pillInactive: "bg-slate-100 text-slate-700 hover:bg-slate-200",
      pillActive: "bg-indigo-600 text-white shadow-xs",
      stepBtn: "bg-slate-100 text-slate-700 hover:bg-slate-200",
      valueText: "text-slate-900",
    },
    dark: {
      btn: "text-slate-200 hover:text-white hover:bg-white/10",
      activeBtn: "bg-indigo-950/60 text-indigo-400 ring-1 ring-indigo-500/30",
      settingsActive: "bg-white/20 text-white",
      menuBg: "bg-[#28292c] border-[#3c4043] text-slate-100 shadow-2xl",
      sectionHeader: "text-slate-400",
      pillInactive: "bg-[#1c1d1f] text-slate-300 hover:bg-[#323338]",
      pillActive: "bg-indigo-600 text-white shadow-xs",
      stepBtn: "bg-[#1c1d1f] text-slate-200 hover:bg-[#323338]",
      valueText: "text-slate-100",
    },
    sepia: {
      btn: "text-[#5b4636] hover:text-[#382b21] hover:bg-[#ede3cc]",
      activeBtn: "bg-[#ede3cc] text-[#8b5a2b] ring-1 ring-[#c87a32]/30",
      settingsActive: "bg-[#ede3cc] text-[#5b4636]",
      menuBg: "bg-[#fbf0d9] border-[#dfd3b9] text-[#5b4636] shadow-xl",
      sectionHeader: "text-[#8a725b]",
      pillInactive: "bg-[#ede3cc] text-[#5b4636] hover:bg-[#e4d9bf]",
      pillActive: "bg-[#8b5a2b] text-[#fbf0d9] shadow-xs",
      stepBtn: "bg-[#ede3cc] text-[#5b4636] hover:bg-[#e4d9bf]",
      valueText: "text-[#5b4636]",
    },
  }[theme];

  return (
    <div className="flex items-center gap-1 relative">
      <button
        type="button"
        onClick={() => {
          if (sidebarOpen && sidebarTab === "search") {
            setSidebarOpen(false);
          } else {
            setSidebarTab("search");
            setSidebarOpen(true);
          }
        }}
        className={`p-2 rounded-xl transition-colors cursor-pointer ${
          sidebarOpen && sidebarTab === "search"
            ? themeStyles.activeBtn
            : themeStyles.btn
        }`}
        title="Search in Volume"
      >
        <Search size={18} />
      </button>

      <button
        type="button"
        onClick={() => {
          if (sidebarOpen && sidebarTab === "toc") {
            setSidebarOpen(false);
          } else {
            setSidebarTab("toc");
            setSidebarOpen(true);
          }
        }}
        className={`p-2 rounded-xl transition-colors cursor-pointer ${
          sidebarOpen && sidebarTab === "toc"
            ? themeStyles.activeBtn
            : themeStyles.btn
        }`}
        title="Table of Contents"
      >
        <List size={18} />
      </button>

      <button
        type="button"
        onClick={toggleFullscreen}
        className={`p-2 rounded-xl transition-colors cursor-pointer ${themeStyles.btn}`}
        title="Fullscreen Mode"
      >
        <Maximize size={18} />
      </button>

      <button
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        className={`p-2 rounded-xl transition-colors cursor-pointer ${
          menuOpen ? themeStyles.settingsActive : themeStyles.btn
        }`}
        title="Reader Settings"
      >
        <Settings size={18} />
      </button>

      {menuOpen && (
        <div
          className={`absolute top-12 right-0 w-64 border rounded-2xl p-4 flex flex-col gap-4 z-50 animate-in fade-in slide-in-from-top-2 ${themeStyles.menuBg}`}
        >
          {/* App Theme (Global system / light / dark) */}
          <div>
            <span className={`text-[11px] font-extrabold uppercase tracking-wider mb-2 block ${themeStyles.sectionHeader}`}>
              App Theme
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAppTheme("system")}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  appTheme === "system"
                    ? themeStyles.pillActive
                    : themeStyles.pillInactive
                }`}
              >
                System
              </button>
              <button
                type="button"
                onClick={() => setAppTheme("light")}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  appTheme === "light"
                    ? themeStyles.pillActive
                    : themeStyles.pillInactive
                }`}
              >
                Light
              </button>
              <button
                type="button"
                onClick={() => setAppTheme("dark")}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  appTheme === "dark"
                    ? themeStyles.pillActive
                    : themeStyles.pillInactive
                }`}
              >
                Dark
              </button>
            </div>
          </div>

          {/* Reader Theme (Document & reading canvas color) */}
          <div>
            <span className={`text-[11px] font-extrabold uppercase tracking-wider mb-2 block ${themeStyles.sectionHeader}`}>
              Reader Theme
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleThemeChange("light")}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  preferences.theme === "light"
                    ? themeStyles.pillActive
                    : themeStyles.pillInactive
                }`}
              >
                Light
              </button>
              <button
                type="button"
                onClick={() => handleThemeChange("dark")}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  preferences.theme === "dark"
                    ? themeStyles.pillActive
                    : themeStyles.pillInactive
                }`}
              >
                Dark
              </button>
              <button
                type="button"
                onClick={() => handleThemeChange("sepia")}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  preferences.theme === "sepia"
                    ? themeStyles.pillActive
                    : themeStyles.pillInactive
                }`}
              >
                Sepia
              </button>
            </div>
          </div>

          <div>
            <span className={`text-[11px] font-extrabold uppercase tracking-wider mb-2 block ${themeStyles.sectionHeader}`}>
              Text Size (EPUB)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => adjustFontSize(-2)}
                disabled={preferences.fontSize <= 12}
                className={`w-8 h-8 rounded-xl disabled:opacity-30 font-bold transition-colors cursor-pointer ${themeStyles.stepBtn}`}
              >
                -
              </button>
              <span className={`flex-1 text-center text-xs font-bold font-mono ${themeStyles.valueText}`}>
                {preferences.fontSize}px
              </span>
              <button
                type="button"
                onClick={() => adjustFontSize(2)}
                disabled={preferences.fontSize >= 32}
                className={`w-8 h-8 rounded-xl disabled:opacity-30 font-bold transition-colors cursor-pointer ${themeStyles.stepBtn}`}
              >
                +
              </button>
            </div>
          </div>

          <div>
            <span className={`text-[11px] font-extrabold uppercase tracking-wider mb-2 block ${themeStyles.sectionHeader}`}>
              Zoom (PDF)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => adjustZoom(-10)}
                disabled={(preferences.zoom || 100) <= 100}
                className={`w-8 h-8 rounded-xl disabled:opacity-30 font-bold transition-colors cursor-pointer ${themeStyles.stepBtn}`}
                title="Zoom Out (Minimum 100%)"
              >
                -
              </button>
              <span className={`flex-1 text-center text-xs font-bold font-mono ${themeStyles.valueText}`}>
                {preferences.zoom || 100}%
              </span>
              <button
                type="button"
                onClick={() => adjustZoom(10)}
                disabled={(preferences.zoom || 100) >= 240}
                className={`w-8 h-8 rounded-xl disabled:opacity-30 font-bold transition-colors cursor-pointer ${themeStyles.stepBtn}`}
                title="Zoom In (Max 240%)"
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

export default SettingsToolbar;
