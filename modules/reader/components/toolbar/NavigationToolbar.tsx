"use client";

import React from "react";
import { useReaderStore } from "@/modules/reader/state/reader-store";
import { ChevronLeft, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface NavigationToolbarProps {
  bookTitle?: string;
}

export function NavigationToolbar({ bookTitle }: NavigationToolbarProps) {
  const router = useRouter();
  const sideRailOpen = useReaderStore((state) => state.sideRailOpen);
  const setSideRailOpen = useReaderStore((state) => state.setSideRailOpen);
  const theme = useReaderStore((state) => state.preferences.theme) || "light";

  const themeStyles = {
    light: {
      btn: "text-slate-700 hover:text-slate-900 hover:bg-slate-100",
      activeBtn: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs",
      title: "text-slate-800 font-semibold",
    },
    dark: {
      btn: "text-slate-200 hover:text-white hover:bg-white/10",
      activeBtn: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs",
      title: "text-slate-100 font-semibold",
    },
    sepia: {
      btn: "text-[#5b4636] hover:text-[#382b21] hover:bg-[#ede3cc]",
      activeBtn: "bg-[#8b5a2b] hover:bg-[#794e25] text-[#fbf0d9] shadow-xs",
      title: "text-[#5b4636] font-semibold",
    },
  }[theme];

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center gap-1 sm:gap-2 min-w-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              aria-label="Back to Library"
              className={`p-2 rounded-xl transition-colors cursor-pointer h-auto w-auto shrink-0 ${themeStyles.btn}`}
            >
              <ChevronLeft size={19} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Back to Library</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setSideRailOpen(!sideRailOpen)}
              aria-label="Toggle Pages Side Rail"
              aria-expanded={sideRailOpen}
              className={`p-2 rounded-xl transition-colors cursor-pointer h-auto w-auto shrink-0 ${
                sideRailOpen ? themeStyles.activeBtn : themeStyles.btn
              }`}
            >
              <Menu size={19} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Toggle Pages Side Rail</TooltipContent>
        </Tooltip>

        {bookTitle && (
          <div className="hidden sm:flex items-center pl-1.5 min-w-0 max-w-[180px] md:max-w-[280px] lg:max-w-[400px]">
            <h1
              title={bookTitle}
              className={`text-xs sm:text-sm font-medium truncate select-none tracking-tight ${themeStyles.title}`}
            >
              {bookTitle}
            </h1>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

export default NavigationToolbar;
