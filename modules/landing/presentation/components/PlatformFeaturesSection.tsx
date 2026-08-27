import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Highlighter,
  Library,
  Compass,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PlatformFeaturesSection() {
  const features = [
    {
      icon: <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      tag: "Standalone Shell",
      title: "Immersive Reader Sanctuary",
      description:
        "Engineered for deep focus with custom typographic scaling, light and dark themes, page retention, and seamless EPUB and PDF rendering.",
      gradient:
        "from-indigo-50/70 via-white to-slate-50 dark:from-indigo-950/30 dark:via-slate-900/80 dark:to-slate-950",
      border:
        "border-indigo-200/80 hover:border-indigo-400 dark:border-indigo-500/25 dark:hover:border-indigo-500/50",
      iconBg:
        "bg-indigo-100 dark:bg-indigo-500/15 border-indigo-200 dark:border-indigo-500/30",
    },
    {
      icon: <Highlighter className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
      tag: "Scholarly Notes",
      title: "Margin Highlights & Annotations",
      description:
        "Capture insights on the fly with multi-color highlight palettes, sticky margin notes, and persistent search across all your saved passages.",
      gradient:
        "from-amber-50/70 via-white to-slate-50 dark:from-amber-950/30 dark:via-slate-900/80 dark:to-slate-950",
      border:
        "border-amber-200/80 hover:border-amber-400 dark:border-amber-500/25 dark:hover:border-amber-500/50",
      iconBg:
        "bg-amber-100 dark:bg-amber-500/15 border-amber-200 dark:border-amber-500/30",
    },
    {
      icon: <Library className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      tag: "Personal Organization",
      title: "Custom Reading Shelves",
      description:
        "Curate personal collections, organize active reading queues, track completion progress, and archive favorite literary volumes effortlessly.",
      gradient:
        "from-emerald-50/70 via-white to-slate-50 dark:from-emerald-950/30 dark:via-slate-900/80 dark:to-slate-950",
      border:
        "border-emerald-200/80 hover:border-emerald-400 dark:border-emerald-500/25 dark:hover:border-emerald-500/50",
      iconBg:
        "bg-emerald-100 dark:bg-emerald-500/15 border-emerald-200 dark:border-emerald-500/30",
    },
    {
      icon: <Compass className="w-6 h-6 text-sky-600 dark:text-cyan-400" />,
      tag: "Knowledge Engine",
      title: "Deep Catalog Discovery",
      description:
        "Explore curated taxonomies across genres, eras, philosophical dialogues, scientific treatises, and historical subjects with instant search.",
      gradient:
        "from-sky-50/70 via-white to-slate-50 dark:from-cyan-950/30 dark:via-slate-900/80 dark:to-slate-950",
      border:
        "border-sky-200/80 hover:border-sky-400 dark:border-cyan-500/25 dark:hover:border-cyan-500/50",
      iconBg:
        "bg-sky-100 dark:bg-cyan-500/15 border-sky-200 dark:border-cyan-500/30",
    },
  ];

  return (
    <section className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 w-full py-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/25 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Built for Deep Readers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
            Crafted for Literary Exploration
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">
            Every feature in TomeSphere is engineered with intention: distraction-free reading, persistent scholarship, and effortless collection management.
          </p>
        </div>

        <Button
          asChild
          variant="outline"
          className="h-11 px-6 font-semibold rounded-xl border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100"
        >
          <Link href="/about" className="inline-flex items-center gap-2">
            <span>Learn More</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>

      {/* 4-Card Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className={`relative overflow-hidden rounded-3xl p-8 bg-gradient-to-b ${feature.gradient} border ${feature.border} shadow-lg dark:shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl flex flex-col justify-between group`}
          >
            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${feature.iconBg} shadow-xs`}
                >
                  {feature.icon}
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  {feature.tag}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                {feature.title}
              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
