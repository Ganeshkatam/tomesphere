"use client";

import { ReaderService } from "@/modules/reader/application/ReaderService";
import { NavigationToolbar } from "./NavigationToolbar";
import { ProgressToolbar } from "./ProgressToolbar";
import { AnnotationToolbar } from "./AnnotationToolbar";
import { SettingsToolbar } from "./SettingsToolbar";

import { useReaderStore } from "@/modules/reader/state/reader-store";

interface ToolbarProps {
  service: ReaderService | null;
  bookTitle?: string;
}

export function Toolbar({ service, bookTitle }: ToolbarProps) {
  const theme = useReaderStore((state) => state.preferences.theme) || "light";

  const themeClass = {
    light: "bg-white border-b border-slate-200 text-slate-800",
    dark: "bg-[#202124] border-b border-[#3c4043] text-neutral-200",
    sepia: "bg-[#fbf0d9] border-b border-[#dfd3b9] text-[#5b4636]",
  }[theme];

  return (
    <header className={`h-14 flex items-center justify-between px-3 sm:px-4 sticky top-0 z-50 transition-colors shadow-2xs ${themeClass}`}>
      <NavigationToolbar bookTitle={bookTitle} />
      <ProgressToolbar service={service} />
      <div className="flex items-center gap-1 sm:gap-2">
        <AnnotationToolbar service={service} />
        <SettingsToolbar service={service} />
      </div>
    </header>
  );
}
