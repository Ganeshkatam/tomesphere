"use client";

import { ReaderService } from "@/modules/reader/application/ReaderService";
import { NavigationToolbar } from "./NavigationToolbar";
import { ProgressToolbar } from "./ProgressToolbar";
import { AnnotationToolbar } from "./AnnotationToolbar";
import { SettingsToolbar } from "./SettingsToolbar";

interface ToolbarProps {
  service: ReaderService | null;
}

export function Toolbar({ service }: ToolbarProps) {
  return (
    <div className="h-14 bg-[var(--surface-default)] border-b border-[var(--border-default)] flex items-center justify-between px-4 sticky top-0 z-50">
      <NavigationToolbar />
      <ProgressToolbar service={service} />
      <div className="flex items-center gap-4">
        <AnnotationToolbar service={service} />
        <SettingsToolbar service={service} />
      </div>
    </div>
  );
}
