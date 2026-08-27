"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Megaphone, ArrowRight, CheckCheck, Info, AlertTriangle, Sparkles, AlertCircle } from "lucide-react";
import { AnnouncementDto } from "../../application/dto/AnnouncementDto";
import { formatDate } from "@/lib/utils";
import {
  markAnnouncementSeen,
  markBannerDismissed,
} from "../utils/announcement-storage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export interface AnnouncementCenterProps {
  announcements: AnnouncementDto[];
  trigger?: React.ReactNode;
}

export function AnnouncementCenter({
  announcements,
  trigger,
}: AnnouncementCenterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleMarkAllSeen = () => {
    announcements.forEach((a) => {
      markAnnouncementSeen(a.id);
      markBannerDismissed(a.id);
    });
    setIsOpen(false);
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case "warning":
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />,
          label: "Warning",
          style: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        };
      case "error":
        return {
          icon: <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />,
          label: "Important",
          style: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
        };
      case "feature":
        return {
          icon: <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />,
          label: "Feature",
          style: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        };
      case "success":
        return {
          icon: <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />,
          label: "Success",
          style: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        };
      case "info":
      default:
        return {
          icon: <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0" />,
          label: "Info",
          style: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
        };
    }
  };

  return (
    <>
      {trigger ? (
        <div onClick={() => setIsOpen(true)}>{trigger}</div>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(true)}
          aria-label="Open Announcement Center"
          className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          <Megaphone className="w-3.5 h-3.5" />
          <span>Announcements</span>
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col p-6 bg-[var(--surface-default)]">
          <DialogHeader className="pb-3 border-b border-[var(--border-default)]">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-indigo-500" />
                <DialogTitle className="text-xl font-bold text-[var(--text-primary)]">
                  Announcement Center
                </DialogTitle>
              </div>

              {announcements.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllSeen}
                  className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] flex items-center gap-1 -mr-2"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </Button>
              )}
            </div>
            <DialogDescription className="text-xs text-[var(--text-tertiary)] mt-1">
              Active product updates, maintenance notices, and system announcements.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto divide-y divide-[var(--border-subtle)] py-2 space-y-4">
            {announcements.length === 0 ? (
              <div className="py-12 text-center text-sm text-[var(--text-tertiary)]">
                No active announcements at this time.
              </div>
            ) : (
              announcements.map((announcement) => {
                const badge = getBadgeStyle(announcement.type);

                return (
                  <article
                    key={announcement.id}
                    className="pt-4 first:pt-0 pb-3 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${badge.style}`}
                      >
                        {badge.icon}
                        <span>{badge.label}</span>
                      </span>

                      <span
                        className="text-xs text-[var(--text-tertiary)]"
                        suppressHydrationWarning
                      >
                        {formatDate(announcement.startsAt)}
                      </span>
                    </div>

                    <h4 className="text-base font-semibold text-[var(--text-primary)]">
                      {announcement.title}
                    </h4>

                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      {announcement.content}
                    </p>

                    {announcement.linkUrl && announcement.linkText && (
                      <div className="pt-1">
                        <Button
                          asChild
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            markAnnouncementSeen(announcement.id);
                            markBannerDismissed(announcement.id);
                            setIsOpen(false);
                          }}
                        >
                          <Link
                            href={announcement.linkUrl}
                            className="inline-flex items-center gap-1.5 text-xs font-medium"
                          >
                            <span>{announcement.linkText}</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </Button>
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AnnouncementCenter;
