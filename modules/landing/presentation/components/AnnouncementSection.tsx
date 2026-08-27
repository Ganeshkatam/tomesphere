import React from "react";
import Link from "next/link";
import { Sparkles, AlertTriangle, AlertCircle, Info, ArrowRight, Megaphone } from "lucide-react";
import { AnnouncementDto } from "@/modules/announcements/application/dto/AnnouncementDto";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface AnnouncementSectionProps {
  announcements: AnnouncementDto[];
}

export default function AnnouncementSection({
  announcements,
}: AnnouncementSectionProps) {
  if (!announcements || announcements.length === 0) return null;

  const getBadgeMeta = (type: string) => {
    switch (type) {
      case "warning":
        return {
          icon: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
          label: "Notice",
          badgeStyle: "bg-amber-500/20 text-amber-300 border-amber-500/30",
          cardBorder: "border-amber-500/30 hover:border-amber-500/50",
          glow: "from-amber-500/10 via-transparent to-transparent",
        };
      case "error":
        return {
          icon: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
          label: "Important",
          badgeStyle: "bg-rose-500/20 text-rose-300 border-rose-500/30",
          cardBorder: "border-rose-500/30 hover:border-rose-500/50",
          glow: "from-rose-500/10 via-transparent to-transparent",
        };
      case "feature":
        return {
          icon: <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />,
          label: "New Feature",
          badgeStyle: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
          cardBorder: "border-emerald-500/30 hover:border-emerald-500/50",
          glow: "from-emerald-500/10 via-transparent to-transparent",
        };
      case "info":
      default:
        return {
          icon: <Info className="w-4 h-4 text-indigo-400 shrink-0" />,
          label: "Platform Update",
          badgeStyle: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
          cardBorder: "border-indigo-500/30 hover:border-indigo-500/50",
          glow: "from-indigo-500/10 via-transparent to-transparent",
        };
    }
  };

  return (
    <section className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 w-full py-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-[var(--border-subtle)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3">
            <Megaphone className="w-3.5 h-3.5" />
            <span>Platform Updates</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[var(--text-primary)] tracking-tight">
            Announcements
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] mt-2 max-w-2xl">
            Explore what&apos;s newly launched, enhanced reader capabilities, and system notices.
          </p>
        </div>
      </div>

      {/* Large Announcement Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {announcements.slice(0, 2).map((announcement) => {
          const meta = getBadgeMeta(announcement.type);

          return (
            <Card
              key={announcement.id}
              className={`relative overflow-hidden rounded-3xl p-8 sm:p-10 bg-gradient-to-br ${meta.glow} bg-[var(--surface-default)] border ${meta.cardBorder} shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group`}
            >
              <div>
                {/* Header Badge & Date */}
                <CardHeader className="p-0 pb-6">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      {meta.icon}
                      <span
                        className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${meta.badgeStyle}`}
                      >
                        {meta.label}
                      </span>
                    </div>

                    <span
                      className="text-sm font-medium text-[var(--text-tertiary)]"
                      suppressHydrationWarning
                    >
                      {formatDate(announcement.startsAt)}
                    </span>
                  </div>

                  <CardTitle className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] leading-tight pt-5">
                    {announcement.title}
                  </CardTitle>
                </CardHeader>

                {/* Content */}
                <CardContent className="p-0 pb-8">
                  <CardDescription className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed font-normal">
                    {announcement.content}
                  </CardDescription>
                </CardContent>
              </div>

              {/* Action Link Footer */}
              {announcement.linkUrl && announcement.linkText ? (
                <CardFooter className="p-0 pt-6 border-t border-[var(--border-subtle)] flex items-center justify-between">
                  <span className="text-xs text-[var(--text-tertiary)] font-medium">
                    Available now in TomeSphere
                  </span>
                  <Button
                    asChild
                    size="default"
                    className="h-10 px-5 text-sm font-bold shadow-md group-hover:scale-105 transition-all"
                  >
                    <Link
                      href={announcement.linkUrl}
                      className="inline-flex items-center gap-2"
                    >
                      <span>{announcement.linkText}</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardFooter>
              ) : (
                <CardFooter className="p-0 pt-6 border-t border-[var(--border-subtle)] flex items-center justify-between">
                  <span className="text-xs text-[var(--text-tertiary)] font-medium">
                    System Notice
                  </span>
                </CardFooter>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
}
