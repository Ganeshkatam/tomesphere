import Navbar from "@/shared/navigation/components/Navbar";
import { createSupabaseServerClient } from "@/shared/core/database/server";
import { Sparkles, BookOpen, ShieldCheck, Target, ArrowRight, Zap, Award, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MarketingPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-page flex flex-col justify-between text-slate-100">
      <Navbar user={user} />

      <main className="flex-1">
        {/* Marketing Hero Section */}
        <section className="relative pt-20 pb-24 px-4 overflow-hidden text-center">
          {/* Ambient background glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-600/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-5xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-6">
              <Sparkles size={14} className="text-indigo-400" />
              <span>Next-Gen Knowledge Platform</span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-display font-extrabold text-white leading-tight mb-8">
              The Knowledge System Built for{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Curious Minds
              </span>
            </h1>

            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
              TomeSphere brings distraction-free reading, intelligent book discovery, custom library organization, and focus insights into one unified, elegant workspace.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/signup"
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/25 transition-all hover:scale-105 text-base flex items-center gap-2"
              >
                <span>Get Started Free</span>
                <ArrowRight size={18} />
              </a>
              <a
                href="/discover"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl border border-white/15 backdrop-blur-md transition-all text-base"
              >
                Explore Library
              </a>
            </div>
          </div>
        </section>

        {/* Brand Metrics Section */}
        <section className="py-12 border-y border-white/5 bg-slate-900/40">
          <div className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="p-4">
                <p className="text-4xl font-extrabold text-indigo-400 font-display">10,000+</p>
                <p className="text-xs text-slate-400 uppercase font-semibold mt-1 tracking-wider">Curated Titles</p>
              </div>
              <div className="p-4">
                <p className="text-4xl font-extrabold text-purple-400 font-display">100%</p>
                <p className="text-xs text-slate-400 uppercase font-semibold mt-1 tracking-wider">Distraction Free</p>
              </div>
              <div className="p-4">
                <p className="text-4xl font-extrabold text-pink-400 font-display">Instant</p>
                <p className="text-xs text-slate-400 uppercase font-semibold mt-1 tracking-wider">PDF & EPUB Access</p>
              </div>
              <div className="p-4">
                <p className="text-4xl font-extrabold text-emerald-400 font-display">24/7</p>
                <p className="text-xs text-slate-400 uppercase font-semibold mt-1 tracking-wider">Cross-Device Sync</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why TomeSphere Section */}
        <section className="py-24 max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-white mb-6">
              Why Readers Choose TomeSphere
            </h2>
            <p className="text-slate-400 text-base">
              Designed specifically for students, researchers, and lifelong readers who demand a cleaner, smarter way to read and retain knowledge.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-strong p-8 rounded-3xl border border-white/10 hover:border-indigo-500/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6">
                <BookOpen size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Pure Reading Focus</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                No intrusive ads, popups, or algorithmic distractions. Enjoy clean typography and immersive dark and sepia reading themes.
              </p>
            </div>

            <div className="glass-strong p-8 rounded-3xl border border-white/10 hover:border-purple-500/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Structured Learning</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Organize books into custom shelves, track your progress with reading goals, and maintain daily reading streaks effortless.
              </p>
            </div>

            <div className="glass-strong p-8 rounded-3xl border border-white/10 hover:border-pink-500/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Authoritative Catalog</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Explore thousands of high-quality titles across computer science, mathematics, literature, history, and academic disciplines.
              </p>
            </div>
          </div>
        </section>

        {/* Marketing CTA Section */}
        <section className="py-20 px-4 relative text-center">
          <div className="max-w-4xl mx-auto glass-strong p-14 rounded-3xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none" />
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-white mb-6">
              Start Your Reading Journey Today
            </h2>
            <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of readers discovering and organizing their digital libraries with TomeSphere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/signup"
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-2xl shadow-xl transition-all hover:scale-105 text-base"
              >
                Create Free Account
              </a>
              <a
                href="/discover"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl border border-white/15 transition-all text-base"
              >
                Explore Books
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
