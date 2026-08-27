import React from "react";
import Link from "next/link";
import {
  Sparkles,
  AlertTriangle,
  AlertCircle,
  Info,
  ArrowRight,
  Megaphone,
  BookOpen,
  Compass,
} from "lucide-react";
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

  const getThemeMeta = (type: string) => {
    switch (type) {
      case "greetings":
      case "greeting":
      case "Greetings":
        return {
          icon: <Sparkles className="w-6 h-6 text-indigo-400" />,
          label: "Greetings",
          badgeStyle: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
          cardBorder: "border-indigo-500/25 hover:border-indigo-500/50",
          glowColor: "bg-indigo-500",
          gradient: "from-indigo-950/30 via-slate-900/80 to-slate-950",
          topLine: "via-indigo-500/50",
          btnGradient: "from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white",
          iconBg: "from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-300",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="w-6 h-6 text-amber-400" />,
          label: "Maintenance & Notice",
          badgeStyle: "bg-amber-500/15 text-amber-300 border-amber-500/30",
          cardBorder: "border-amber-500/25 hover:border-amber-500/50",
          glowColor: "bg-amber-500",
          gradient: "from-amber-950/30 via-slate-900/80 to-slate-950",
          topLine: "via-amber-500/50",
          btnGradient: "from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950",
          iconBg: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-300",
        };
      case "error":
        return {
          icon: <AlertCircle className="w-6 h-6 text-rose-400" />,
          label: "Important Notice",
          badgeStyle: "bg-rose-500/15 text-rose-300 border-rose-500/30",
          cardBorder: "border-rose-500/25 hover:border-rose-500/50",
          glowColor: "bg-rose-500",
          gradient: "from-rose-950/30 via-slate-900/80 to-slate-950",
          topLine: "via-rose-500/50",
          btnGradient: "from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white",
          iconBg: "from-rose-500/20 to-pink-500/10 border-rose-500/30 text-rose-300",
        };
      case "feature":
        return {
          icon: <Sparkles className="w-6 h-6 text-emerald-400" />,
          label: "New Capability",
          badgeStyle: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
          cardBorder: "border-emerald-500/25 hover:border-emerald-500/50",
          glowColor: "bg-emerald-500",
          gradient: "from-emerald-950/30 via-slate-900/80 to-slate-950",
          topLine: "via-emerald-500/50",
          btnGradient: "from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white",
          iconBg: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-300",
        };
      case "info":
      default:
        return {
          icon: <BookOpen className="w-6 h-6 text-indigo-400" />,
          label: "Platform Release",
          badgeStyle: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
          cardBorder: "border-indigo-500/25 hover:border-indigo-500/50",
          glowColor: "bg-indigo-500",
          gradient: "from-indigo-950/30 via-slate-900/80 to-slate-950",
          topLine: "via-indigo-500/50",
          btnGradient: "from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white",
          iconBg: "from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-300",
        };
    }
  };

  return (
    <section className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 w-full py-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/25 text-xs font-bold uppercase tracking-wider text-indigo-300 mb-4 shadow-sm">
            <Megaphone className="w-3.5 h-3.5 text-indigo-400" />
            <span>Latest Dispatches</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
            Announcements
          </h2>
          <p className="text-base sm:text-lg text-slate-300 mt-2 max-w-2xl leading-relaxed">
            Discover what&apos;s newly launched across TomeSphere, enhanced reader capabilities, and platform updates.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-400 bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-800">
          <Compass className="w-4 h-4 text-indigo-400" />
          <span>Updated Regularly</span>
        </div>
      </div>

      {/* Grand Luxury Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {announcements.slice(0, 2).map((announcement) => {
          const theme = getThemeMeta(announcement.type);

          return (
            <Card
              key={announcement.id}
              className={`relative overflow-hidden rounded-3xl p-8 sm:p-10 lg:p-12 bg-gradient-to-b ${theme.gradient} border ${theme.cardBorder} shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between group`}
            >
              {/* Top Gradient Highlight Line */}
              <div
                className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent ${theme.topLine} to-transparent`}
              />

              {/* Ambient Glow Orb */}
              <div
                className={`absolute -top-24 -right-24 w-72 h-72 rounded-full ${theme.glowColor} blur-[90px] opacity-15 group-hover:opacity-25 transition-opacity pointer-events-none`}
              />

              <div>
                {/* Header: Icon, Badge, and Timestamp */}
                <CardHeader className="p-0 pb-6">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${theme.iconBg} border shadow-inner`}
                      >
                        {theme.icon}
                      </div>

                      <div>
                        <span
                          className={`inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${theme.badgeStyle}`}
                        >
                          {theme.label}
                        </span>
                      </div>
                    </div>

                    <span
                      className="text-xs font-semibold text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800/80"
                      suppressHydrationWarning
                    >
                      {formatDate(announcement.startsAt)}
                    </span>
                  </div>

                  {/* Title */}
                  <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug pt-6">
                    {announcement.title}
                  </CardTitle>
                </CardHeader>

                {/* Content */}
                <CardContent className="p-0 pb-8">
                  <CardDescription className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                    {announcement.content}
                  </CardDescription>
                </CardContent>
              </div>

              {/* Action Footer */}
              <CardFooter className="p-0 pt-6 border-t border-slate-800/80 flex items-center justify-between gap-4 flex-wrap">
                <span className="text-xs text-slate-400 font-medium">
                  TomeSphere Platform Notice
                </span>

                {announcement.linkUrl && announcement.linkText ? (
                  <Button
                    asChild
                    size="default"
                    className={`h-11 px-6 text-sm font-bold rounded-xl shadow-lg bg-gradient-to-r ${theme.btnGradient} transition-all duration-200 group-hover:scale-105`}
                  >
                    <Link
                      href={announcement.linkUrl}
                      className="inline-flex items-center gap-2"
                    >
                      <span>{announcement.linkText}</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                ) : (
                  <span className="text-xs text-slate-500 font-mono">
                    Active
                  </span>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
