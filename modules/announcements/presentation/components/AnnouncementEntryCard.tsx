"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  AlertTriangle,
  AlertCircle,
  ArrowRight,
  X,
  BookOpen,
} from "lucide-react";
import { AnnouncementDto } from "../../application/dto/AnnouncementDto";
import {
  selectEntryAnnouncement,
  markAnnouncementSeen,
  markBannerDismissed,
  isAnnouncementSeen,
} from "../utils/announcement-storage";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export interface AnnouncementEntryCardProps {
  announcements: AnnouncementDto[];
}

export function AnnouncementEntryCard({ announcements }: AnnouncementEntryCardProps) {
  const [activeAnnouncement, setActiveAnnouncement] = useState<AnnouncementDto | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Evaluate entry queue once on initial session mount
  useEffect(() => {
    setIsClient(true);
    const seenSet = new Set<string>();

    for (const item of announcements) {
      if (isAnnouncementSeen(item.id)) {
        seenSet.add(item.id);
      }
    }

    const selected = selectEntryAnnouncement(announcements, seenSet);
    setActiveAnnouncement(selected);
  }, [announcements]);

  if (!isClient || !activeAnnouncement) {
    return null;
  }

  const handleDismiss = () => {
    markAnnouncementSeen(activeAnnouncement.id);
    markBannerDismissed(activeAnnouncement.id);
    setActiveAnnouncement(null);
  };

  const isCritical =
    activeAnnouncement.type === "error" && !activeAnnouncement.isDismissible;

  // 1. Critical non-dismissible announcements use Dialog directly
  if (isCritical) {
    return (
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent
          className="sm:max-w-lg border-rose-500/40 bg-slate-950 text-slate-100 p-0 overflow-hidden shadow-2xl rounded-3xl"
          aria-describedby="critical-announcement-desc"
        >
          {/* Critical Top Visual Banner */}
          <div className="h-24 bg-gradient-to-br from-rose-950/80 via-slate-900 to-slate-950 relative flex items-center justify-center border-b border-rose-500/20 px-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.15),transparent_70%)]" />
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 z-10 shadow-lg">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-3">
            <DialogHeader className="gap-2 text-left sm:text-left">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-rose-400 font-mono">
                Critical Notice
              </span>
              <DialogTitle className="text-2xl font-serif font-bold text-white leading-tight">
                {activeAnnouncement.title}
              </DialogTitle>
              <DialogDescription
                id="critical-announcement-desc"
                className="text-sm text-slate-300 pt-1 leading-relaxed font-sans"
              >
                {activeAnnouncement.content}
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="pt-4 border-t border-slate-800 flex items-center gap-3 sm:justify-end">
              {activeAnnouncement.linkUrl && activeAnnouncement.linkText && (
                <Button asChild variant="default" onClick={handleDismiss} className="bg-rose-600 hover:bg-rose-500 text-white rounded-xl h-9 px-4 text-xs font-semibold">
                  <Link href={activeAnnouncement.linkUrl} className="flex items-center gap-1.5 font-semibold">
                    <span>{activeAnnouncement.linkText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              )}
              <Button
                type="button"
                variant={activeAnnouncement.linkUrl ? "outline" : "default"}
                onClick={handleDismiss}
                className="rounded-xl border-slate-700 hover:bg-slate-800 text-slate-200 h-9 px-4 text-xs font-medium"
              >
                I Understand
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // 2. Controlled Editorial Presentation Language
  const getEditorialMeta = (type: string) => {
    switch (type) {
      case "warning":
        return {
          icon: <AlertTriangle className="w-5 h-5 text-amber-300" />,
          contextLabel: "System Notice",
          typeLabel: "Maintenance",
          borderColor: "border-amber-500/30",
          accentColor: "text-amber-400",
          buttonClass: "bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold",
          iconPlate: "bg-amber-950/40 border-amber-500/30 text-amber-300",
          glowColor: "rgba(245, 158, 11, 0.12)",
        };
      case "error":
        return {
          icon: <AlertCircle className="w-5 h-5 text-rose-300" />,
          contextLabel: "Critical Notice",
          typeLabel: "Attention",
          borderColor: "border-rose-500/30",
          accentColor: "text-rose-400",
          buttonClass: "bg-rose-600 hover:bg-rose-500 text-white font-semibold",
          iconPlate: "bg-rose-950/40 border-rose-500/30 text-rose-300",
          glowColor: "rgba(244, 63, 94, 0.12)",
        };
      case "greetings":
      case "greeting":
      case "Greetings":
        return {
          icon: <BookOpen className="w-5 h-5 text-indigo-300" />,
          contextLabel: "New at TomeSphere",
          typeLabel: "Welcome",
          borderColor: "border-indigo-500/30",
          accentColor: "text-indigo-400",
          buttonClass: "bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-sm",
          iconPlate: "bg-indigo-950/50 border-indigo-500/30 text-indigo-300",
          glowColor: "rgba(99, 102, 241, 0.15)",
        };
      case "feature":
      default:
        return {
          icon: <Sparkles className="w-5 h-5 text-emerald-300" />,
          contextLabel: "New at TomeSphere",
          typeLabel: "New Feature",
          borderColor: "border-emerald-500/30",
          accentColor: "text-emerald-400",
          buttonClass: "bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm",
          iconPlate: "bg-emerald-950/50 border-emerald-500/30 text-emerald-300",
          glowColor: "rgba(16, 185, 129, 0.15)",
        };
    }
  };

  const meta = getEditorialMeta(activeAnnouncement.type);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/40 backdrop-blur-[2px] animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="entry-announcement-title"
    >
      <Card
        className={`w-full max-w-[490px] bg-slate-950 text-slate-100 shadow-2xl border ${meta.borderColor} rounded-3xl overflow-hidden relative transition-all duration-200`}
      >
        {/* 1. Proprietary Book-Jacket Editorial Header */}
        <div className="h-32 sm:h-36 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 relative flex flex-col items-center justify-center border-b border-slate-800/80 overflow-hidden px-6 select-none">
          {/* Engraved Background Linework Motif */}
          <svg
            className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="editorial-engraving"
                width="32"
                height="32"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="16" cy="16" r="0.75" fill="#94a3b8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#editorial-engraving)" />
            <circle
              cx="50%"
              cy="45%"
              r="70"
              fill="none"
              stroke="#818cf8"
              strokeWidth="0.5"
              strokeDasharray="3 3"
            />
          </svg>

          {/* Subtle Radial Glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 45%, ${meta.glowColor}, transparent 60%)`,
            }}
          />

          {/* Central TomeSphere Dispatch Emblem */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-1">
              <span>&#9670;</span>
            </div>

            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${meta.iconPlate} border shadow-md mb-2`}
            >
              {meta.icon}
            </div>

            <div className="text-center">
              <span className="text-[11px] font-mono tracking-[0.28em] font-semibold text-slate-300 block uppercase">
                TomeSphere
              </span>
              <span className="text-[9px] font-mono tracking-[0.32em] text-indigo-400/90 block uppercase font-medium mt-0.5">
                Dispatch
              </span>
            </div>

            <div className="w-10 h-[1px] bg-slate-800 mt-2" />
          </div>

          {/* 40px Hit-Area Close Button */}
          <button
            type="button"
            onClick={handleDismiss}
            aria-label={`Dismiss announcement: ${activeAnnouncement.title}`}
            className="absolute top-3 right-3 h-10 w-10 min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center bg-slate-900/30 hover:bg-slate-800/80 border border-slate-800 text-slate-400 hover:text-white transition-colors z-20 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Editorial Typography & Message Content */}
        <div className="p-6 sm:p-8 pt-5 pb-2">
          <CardHeader className="p-0 pb-3 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-mono font-semibold uppercase tracking-[0.2em] ${meta.accentColor}`}>
                {meta.contextLabel}
              </span>
              <span className="text-slate-600 text-xs">&#183;</span>
              <span className="text-[11px] font-mono font-medium uppercase tracking-[0.16em] text-slate-400">
                {meta.typeLabel}
              </span>
            </div>

            <CardTitle
              id="entry-announcement-title"
              className="text-xl sm:text-2xl font-serif font-bold text-white leading-snug tracking-tight pt-1"
            >
              {activeAnnouncement.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0 pb-5">
            <CardDescription className="text-sm sm:text-[15px] text-slate-300 leading-relaxed font-sans font-normal">
              {activeAnnouncement.content}
            </CardDescription>
          </CardContent>
        </div>

        {/* 3. Balanced Editorial Action Footer */}
        <CardFooter className="px-6 sm:px-8 py-4 border-t border-slate-800/80 flex items-center justify-between gap-3 bg-slate-950/80">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-xs text-slate-400 hover:text-slate-200 hover:bg-transparent -ml-2 transition-colors font-medium"
          >
            Don&apos;t show again
          </Button>

          <div>
            {activeAnnouncement.linkUrl && activeAnnouncement.linkText ? (
              <Button
                asChild
                size="sm"
                onClick={handleDismiss}
                className={`rounded-xl px-4 py-2 text-xs ${meta.buttonClass} transition-all duration-200 group`}
              >
                <Link
                  href={activeAnnouncement.linkUrl}
                  className="inline-flex items-center gap-1.5"
                >
                  <span>{activeAnnouncement.linkText}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                onClick={handleDismiss}
                className={`rounded-xl px-5 py-2 text-xs ${meta.buttonClass}`}
              >
                Got it
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default AnnouncementEntryCard;
