"use client";

import { useReaderStore } from "@/modules/reader/state/reader-store";
import { ChevronLeft, Menu } from "lucide-react";
import { useRouter } from "next/navigation";

export function NavigationToolbar() {
  const router = useRouter();
  const sideRailOpen = useReaderStore((state) => state.sideRailOpen);
  const setSideRailOpen = useReaderStore((state) => state.setSideRailOpen);
  const theme = useReaderStore((state) => state.preferences.theme) || "light";

  const themeStyles = {
    light: {
      btn: "text-slate-700 hover:text-slate-900 hover:bg-slate-100",
      activeBtn: "bg-indigo-600 text-white shadow-xs",
    },
    dark: {
      btn: "text-slate-200 hover:text-white hover:bg-white/10",
      activeBtn: "bg-indigo-600 text-white shadow-xs",
    },
    sepia: {
      btn: "text-[#5b4636] hover:text-[#382b21] hover:bg-[#ede3cc]",
      activeBtn: "bg-[#8b5a2b] text-[#fbf0d9] shadow-xs",
    },
  }[theme];

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <button
        type="button"
        onClick={() => router.back()}
        className={`p-2 rounded-xl transition-colors cursor-pointer ${themeStyles.btn}`}
        title="Back to Library"
      >
        <ChevronLeft size={19} />
      </button>
      <button
        type="button"
        onClick={() => setSideRailOpen(!sideRailOpen)}
        className={`p-2 rounded-xl transition-colors cursor-pointer ${
          sideRailOpen ? themeStyles.activeBtn : themeStyles.btn
        }`}
        title="Toggle Pages Side Rail"
      >
        <Menu size={19} />
      </button>
    </div>
  );
}

export default NavigationToolbar;
