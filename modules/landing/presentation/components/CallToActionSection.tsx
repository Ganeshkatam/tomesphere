import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CallToActionSection() {
  return (
    <section className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 w-full py-16">
      <div className="relative overflow-hidden rounded-3xl p-10 sm:p-14 lg:p-20 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white shadow-2xl border border-indigo-500/20 text-center flex flex-col items-center justify-center">
        {/* Ambient Glows */}
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-indigo-500/20 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-purple-500/20 blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-wider text-indigo-200 mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Begin Your Journey</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight mb-6 leading-tight">
            Your Personal Digital Sanctuary Awaits
          </h2>

          <p className="text-base sm:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
            Immerse yourself in thousands of curated volumes, customize your reading experience, and build scholarly marginalia that endures.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="h-13 px-8 text-base font-bold rounded-2xl bg-white text-slate-950 hover:bg-slate-100 shadow-xl transition-all hover:scale-105"
            >
              <Link href="/discover" className="inline-flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>Explore the Catalog</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-13 px-8 text-base font-bold rounded-2xl border-white/25 text-white hover:bg-white/10 hover:text-white transition-all hover:scale-105"
            >
              <Link href="/sign-up" className="inline-flex items-center gap-2">
                <span>Create Free Account</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
