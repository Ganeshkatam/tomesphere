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
        wrapper: "bg-amber-500/10 dark:bg-amber-950/40 border-amber-500/30 text-amber-900 dark:text-amber-200",
        badge: "bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/30",
        icon: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />,
        cta: "bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-slate-950",
      };
    case "success":
    case "feature":
      return {
        wrapper: "bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-500/30 text-emerald-900 dark:text-emerald-200",
        badge: "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/30",
        icon: <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />,
        cta: "bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950",
      };
    case "error":
    case "maintenance":
      return {
        wrapper: "bg-rose-500/10 dark:bg-rose-950/40 border-rose-500/30 text-rose-900 dark:text-rose-200",
        badge: "bg-rose-500/20 text-rose-800 dark:text-rose-300 border-rose-500/30",
        icon: <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />,
        cta: "bg-rose-600 hover:bg-rose-700 text-white dark:bg-rose-500 dark:hover:bg-rose-400 dark:text-slate-950",
      };
    case "info":
    default:
      return {
        wrapper: "bg-indigo-500/10 dark:bg-indigo-950/40 border-indigo-500/30 text-indigo-900 dark:text-indigo-200",
        badge: "bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 border-indigo-500/30",
        icon: <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />,
        cta: "bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white",
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

  // Filter out dismissed announcements
  const visibleAnnouncements = announcements.filter(
    (a) => !dismissedIds.has(a.id)
  );

  if (!isClient || visibleAnnouncements.length === 0) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-2 z-40" role="region" aria-label="System Announcements">
      {visibleAnnouncements.map((announcement) => {
        const theme = getThemeStyles(announcement.type);

        return (
          <aside
            key={announcement.id}
            className={`w-full border-b backdrop-blur-sm transition-all duration-300 ${theme.wrapper}`}
          >
            <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {theme.icon}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${theme.badge}`}>
                    {announcement.type}
                  </span>
                  <span className="font-semibold">{announcement.title}</span>
                  <span className="opacity-90 hidden sm:inline">&mdash;</span>
                  <span className="opacity-90 line-clamp-1 sm:line-clamp-none">{announcement.content}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {announcement.linkUrl && announcement.linkText && (
                  <Button asChild size="sm" className={`h-7 px-3 text-xs font-semibold shadow-sm ${theme.cta}`}>
                    <Link href={announcement.linkUrl} className="inline-flex items-center gap-1.5">
                      <span>{announcement.linkText}</span>
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
                      className="h-7 w-7 opacity-70 hover:opacity-100"
                    >
                      <Megaphone className="w-3.5 h-3.5" />
                    </Button>
                  }
                />

                {announcement.isDismissible && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDismiss(announcement.id)}
                    aria-label={`Dismiss announcement: ${announcement.title}`}
                    className="h-7 w-7 opacity-70 hover:opacity-100"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </aside>
        );
      })}
    </div>
  );
}

export default AnnouncementBanner;
