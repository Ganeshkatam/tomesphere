"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Info, AlertTriangle, Sparkles, AlertCircle, X, ArrowRight, Megaphone } from "lucide-react";
import { AnnouncementDto } from "../../application/dto/AnnouncementDto";
import {
  isBannerDismissed,
  markBannerDismissed,
} from "../utils/announcement-storage";
import { Button } from "@/components/ui/button";
import AnnouncementCenter from "./AnnouncementCenter";

function getThemeStyles(type: string) {
  switch (type) {
    case "warning":
      return {
        wrapper:
          "bg-amber-500/15 dark:bg-amber-950/60 border-amber-500/30 text-amber-950 dark:text-amber-100",
        badge:
          "bg-amber-500/25 text-amber-900 dark:text-amber-300 border-amber-500/40",
        icon: (
          <AlertTriangle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
        ),
        cta: "bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-slate-950 shadow-xs",
      };
    case "success":
    case "feature":
      return {
        wrapper:
          "bg-emerald-500/15 dark:bg-emerald-950/60 border-emerald-500/30 text-emerald-950 dark:text-emerald-100",
        badge:
          "bg-emerald-500/25 text-emerald-900 dark:text-emerald-300 border-emerald-500/40",
        icon: (
          <Sparkles className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
        ),
        cta: "bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 shadow-xs",
      };
    case "error":
    case "maintenance":
      return {
        wrapper:
          "bg-rose-500/15 dark:bg-rose-950/60 border-rose-500/30 text-rose-950 dark:text-rose-100",
        badge:
          "bg-rose-500/25 text-rose-900 dark:text-rose-300 border-rose-500/40",
        icon: (
          <AlertCircle className="w-4 h-4 text-rose-700 dark:text-rose-400 shrink-0" />
        ),
        cta: "bg-rose-600 hover:bg-rose-700 text-white dark:bg-rose-500 dark:hover:bg-rose-400 dark:text-slate-950 shadow-xs",
      };
    case "info":
    default:
      return {
        wrapper:
          "bg-indigo-500/15 dark:bg-indigo-950/60 border-indigo-500/30 text-indigo-950 dark:text-indigo-100",
        badge:
          "bg-indigo-500/25 text-indigo-900 dark:text-indigo-300 border-indigo-500/40",
        icon: (
          <Info className="w-4 h-4 text-indigo-700 dark:text-indigo-400 shrink-0" />
        ),
        cta: "bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white shadow-xs",
      };
  }
}

export interface AnnouncementBannerProps {
  announcements: AnnouncementDto[];
}

export function AnnouncementBanner({ announcements }: AnnouncementBannerProps) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(() => new Set());
  const [isClient, setIsClient] = useState(false);

  // Load device-local dismissal state from storage utility on client mount
  useEffect(() => {
    setIsClient(true);
    const dismissed = new Set<string>();

    for (const announcement of announcements) {
      if (isBannerDismissed(announcement.id)) {
        dismissed.add(announcement.id);
      }
    }

    setDismissedIds(dismissed);
  }, [announcements]);

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });

    markBannerDismissed(id);
  };

  // Filter out dismissed announcements, prioritizing warnings/maintenance
  const visibleAnnouncements = announcements
    .filter((a) => !dismissedIds.has(a.id))
    .sort((a, b) => {
      const aScore = a.type === "warning" || a.type === "error" ? 2 : 1;
      const bScore = b.type === "warning" || b.type === "error" ? 2 : 1;
      return bScore - aScore;
    });

  if (!isClient || visibleAnnouncements.length === 0) {
    return null;
  }

  // Display top priority active notice banner on top of header
  const primaryAnnouncement = visibleAnnouncements[0];
  const theme = getThemeStyles(primaryAnnouncement.type);

  return (
    <div
      className="w-full relative z-50 shrink-0"
      role="region"
      aria-label="System Maintenance and Announcements"
    >
      <aside
        className={`w-full border-b backdrop-blur-md transition-all duration-300 ${theme.wrapper}`}
      >
        <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {theme.icon}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs sm:text-sm">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${theme.badge}`}
              >
                {primaryAnnouncement.type === "warning"
                  ? "Maintenance"
                  : primaryAnnouncement.type}
              </span>
              <span className="font-bold text-slate-950 dark:text-white">
                {primaryAnnouncement.title}
              </span>
              <span className="opacity-70 hidden sm:inline">&mdash;</span>
              <span className="opacity-90 font-normal line-clamp-1 sm:line-clamp-none">
                {primaryAnnouncement.content}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {primaryAnnouncement.linkUrl && primaryAnnouncement.linkText && (
              <Button
                asChild
                size="sm"
                className={`h-7 px-3 text-xs font-bold rounded-lg ${theme.cta}`}
              >
                <Link
                  href={primaryAnnouncement.linkUrl}
                  className="inline-flex items-center gap-1.5"
                >
                  <span>{primaryAnnouncement.linkText}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </Button>
            )}

            <AnnouncementCenter
              announcements={announcements}
              trigger={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="View all announcements"
                  className="h-7 w-7 opacity-75 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <Megaphone className="w-3.5 h-3.5" />
                </Button>
              }
            />

            {primaryAnnouncement.isDismissible && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleDismiss(primaryAnnouncement.id)}
                aria-label={`Dismiss announcement: ${primaryAnnouncement.title}`}
                className="h-7 w-7 opacity-75 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}

export default AnnouncementBanner;
