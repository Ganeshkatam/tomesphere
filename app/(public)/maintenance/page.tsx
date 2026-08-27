import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  ShieldAlert,
  CheckCircle2,
  Clock,
  BookOpen,
  Library,
  Highlighter,
  Search,
  ArrowRight,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { createSupabaseServerClient } from "@/shared/core/database/server";
import { SupabaseAnnouncementReadModel } from "@/modules/announcements/infrastructure/read-models/SupabaseAnnouncementReadModel";
import { GetActiveAnnouncementsQueryHandler } from "@/modules/announcements/application/queries/GetActiveAnnouncements/handler";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "System Status & Scheduled Maintenance",
  description:
    "Live system status, maintenance schedules, and operational health across TomeSphere reader and catalog services.",
};

export const revalidate = 60; // Refresh every 60s

export default async function MaintenancePage() {
  const supabase = await createSupabaseServerClient();
  const readModel = new SupabaseAnnouncementReadModel(supabase);
  const handler = new GetActiveAnnouncementsQueryHandler(readModel);

  const announcements = await handler.execute().catch(() => []);

  const maintenanceAnnouncements = announcements.filter(
    (a) =>
      a.type === "warning" ||
      a.type === "maintenance" ||
      a.type === "error"
  );

  const services = [
    {
      name: "Reader Engine & Standalone Shell",
      description: "EPUB/PDF rendering, typographic engine, and viewports",
      status: "Operational",
      icon: <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      badgeClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    },
    {
      name: "Margin Notes & Highlights",
      description: "Scholarly annotations, local cache, and persistent quote clips",
      status: "Operational",
      icon: <Highlighter className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      badgeClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    },
    {
      name: "User Library & Shelves Sync",
      description: "Curated collection management and reading queue persistence",
      status: "Operational",
      icon: <Library className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      badgeClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    },
    {
      name: "Catalog Indexing & Search Service",
      description: "Full-text search, subject taxonomy, and author lookups",
      status: maintenanceAnnouncements.length > 0 ? "Maintenance Active" : "Operational",
      icon: <Search className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      badgeClass:
        maintenanceAnnouncements.length > 0
          ? "bg-amber-500/15 text-amber-900 dark:text-amber-300 border-amber-500/40"
          : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--surface-canvas)] text-[var(--text-primary)]">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-6 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            <span>Platform Status & Maintenance</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight mb-4 leading-tight">
            System Status & Operations
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Real-time operational updates, scheduled database maintenance windows, and reader service health indicators.
          </p>
        </div>

        {/* Active Maintenance Advisory Card */}
        {maintenanceAnnouncements.length > 0 ? (
          <div className="space-y-6 mb-12">
            {maintenanceAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className="relative overflow-hidden rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-orange-500/10 dark:from-amber-950/40 dark:via-slate-950/90 dark:to-amber-950/30 border border-amber-400/50 dark:border-amber-500/30 shadow-xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-amber-300/40 dark:border-amber-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center border border-amber-400/40">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                        Active Maintenance Notice
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400" suppressHydrationWarning>
                        Posted {formatDate(announcement.startsAt)}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-200 border border-amber-400/50 w-fit">
                    Scheduled Window
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                  {announcement.title}
                </h2>

                <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl mb-6">
                  {announcement.content}
                </p>

                <div className="flex items-center gap-2 text-xs font-medium text-amber-800 dark:text-amber-300/90 bg-amber-500/10 px-4 py-2.5 rounded-2xl border border-amber-500/25 w-fit">
                  <Clock className="w-4 h-4" />
                  <span>Reader sessions & offline margin notes remain completely uninterrupted.</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl p-8 bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/30 shadow-md mb-12 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                All Systems Fully Operational
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                No active maintenance or service interruptions at this time. All catalog queries, shelves, and reading tools are running at 100% capacity.
              </p>
            </div>
          </div>
        )}

        {/* Subsystem Health Grid */}
        <div className="mb-14">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Service Health & Subsystems
            </h2>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Updated automatically
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((service, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-0.5">
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {service.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {service.description}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border whitespace-nowrap ${service.badgeClass}`}
                >
                  {service.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="rounded-3xl p-8 sm:p-10 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-lg mb-12">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Maintenance FAQs
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">
                Will my reading progress or notes be lost during optimization?
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                No. All reader progress, active highlights, and marginalia are cached locally on your device and automatically reconciled once database sync completes.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">
                Can I continue reading open books during maintenance?
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Yes. Standalone reader shells operate autonomously in your browser and do not require active database connectivity once the book session is initiated.
              </p>
            </div>
          </div>
        </div>

        {/* Back Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <Button
            asChild
            variant="outline"
            className="h-11 px-6 font-semibold rounded-xl border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Link href="/discover" className="inline-flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>Explore Catalog</span>
            </Link>
          </Button>

          <Button
            asChild
            className="h-11 px-6 font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
          >
            <Link href="/support" className="inline-flex items-center gap-2">
              <span>Contact Reader Support</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
