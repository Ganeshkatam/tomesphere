import Link from "next/link";
import Navbar from "@/modules/shared/navigation/components/Navbar";
import {
  FadeIn,
  SlideUp,
  StaggerContainer,
  StaggerItem,
} from "@/modules/shared/ui/animations";

export const metadata = {
  title: "About | TomeSphere",
  description:
    "Learn more about TomeSphere, the next-generation platform for readers.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-page overflow-x-hidden">
      <Navbar />

      <main className="pt-24 pb-20 sm:pt-32 sm:pb-32 relative">
        {/* Background Decor */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-24 relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium mb-8 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              Our Mission
            </div>
            <h1 className="text-5xl sm:text-7xl font-display font-bold mb-8 tracking-tight">
              Redefining the <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-sm">
                Reading Experience
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              TomeSphere is a next-generation platform built for book lovers. We
              blend artificial intelligence, community engagement, and beautiful
              design to help you discover, track, and enjoy literature like
              never before.
            </p>
          </div>

          {/* Stats Grid */}
          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-32 max-w-4xl mx-auto">
            <StaggerItem>
              <div className="flex flex-col items-center justify-center p-8 rounded-3xl glass-strong border border-white/10 hover:border-indigo-500/30 transition-colors group">
                <div className="text-4xl sm:text-5xl font-bold text-indigo-400 mb-2 group-hover:scale-110 transition-transform">
                  AI
                </div>
                <div className="text-sm font-medium text-slate-400 uppercase tracking-wider text-center">
                  Smart Picks
                </div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="flex flex-col items-center justify-center p-8 rounded-3xl glass-strong border border-white/10 hover:border-purple-500/30 transition-colors group">
                <div className="text-4xl sm:text-5xl font-bold text-purple-400 mb-2 group-hover:scale-110 transition-transform">
                  ∞
                </div>
                <div className="text-sm font-medium text-slate-400 uppercase tracking-wider text-center">
                  Endless Library
                </div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="flex flex-col items-center justify-center p-8 rounded-3xl glass-strong border border-white/10 hover:border-pink-500/30 transition-colors group">
                <div className="text-4xl sm:text-5xl font-bold text-pink-400 mb-2 group-hover:scale-110 transition-transform">
                  100%
                </div>
                <div className="text-sm font-medium text-slate-400 uppercase tracking-wider text-center">
                  Free Access
                </div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="flex flex-col items-center justify-center p-8 rounded-3xl glass-strong border border-white/10 hover:border-sky-500/30 transition-colors group">
                <div className="text-4xl sm:text-5xl font-bold text-sky-400 mb-2 group-hover:scale-110 transition-transform">
                  24/7
                </div>
                <div className="text-sm font-medium text-slate-400 uppercase tracking-wider text-center">
                  Community
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>

          {/* Story Section */}
          <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
            <SlideUp>
              <div className="relative aspect-square rounded-3xl overflow-hidden glass-strong border border-white/10 p-2">
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-indigo-900/50 via-slate-900 to-purple-900/50 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
                  <div className="w-24 h-24 rounded-full bg-indigo-500/20 flex items-center justify-center mb-8 border border-indigo-500/30">
                    <svg
                      className="w-12 h-12 text-indigo-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">
                    A Universe of Books
                  </h3>
                  <p className="text-slate-400">
                    Everything you need to manage your reading life in one
                    beautifully designed workspace.
                  </p>
                </div>
              </div>
            </SlideUp>

            <SlideUp delay={0.2}>
              <div>
                <h2 className="text-3xl sm:text-4xl font-display font-bold mb-6 text-white">
                  Why We Built TomeSphere
                </h2>
                <div className="space-y-6 text-slate-400 text-lg leading-relaxed">
                  <p>
                    We believe that reading is one of the most powerful tools
                    for human growth, empathy, and entertainment. However,
                    finding the right book and keeping track of your reading
                    journey has often felt fragmented across different
                    disjointed platforms.
                  </p>
                  <p>
                    TomeSphere was created to solve this. We wanted a single,
                    unified sphere where readers could discover new worlds,
                    track their progress, review their favorites, and connect
                    with like-minded bibliophiles.
                  </p>
                  <p>
                    By combining a premium, distraction-free interface with
                    modern recommendation engines, we aim to make every reading
                    session more magical.
                  </p>
                </div>
              </div>
            </SlideUp>
          </div>

          {/* Features Grid */}
          <div className="mb-32">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-12 text-center text-white">
              What Makes Us Different
            </h2>
            <div className="grid sm:grid-cols-3 gap-8">
              <div className="glass p-8 rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-all hover:-translate-y-1">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 text-2xl">
                  🤖
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  AI Recommendations
                </h3>
                <p className="text-slate-400">
                  Our machine learning models analyze your reading patterns to
                  suggest books you&apos;ll actually love, not just what&apos;s
                  popular.
                </p>
              </div>
              <div className="glass p-8 rounded-3xl border border-white/5 hover:border-purple-500/30 transition-all hover:-translate-y-1">
                <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 text-2xl">
                  🌍
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Global Community
                </h3>
                <p className="text-slate-400">
                  Join discussions, write reviews, and share your reading lists
                  with readers from around the globe.
                </p>
              </div>
              <div className="glass p-8 rounded-3xl border border-white/5 hover:border-pink-500/30 transition-all hover:-translate-y-1">
                <div className="w-12 h-12 bg-pink-500/20 rounded-2xl flex items-center justify-center mb-6 text-2xl">
                  ✨
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Premium Design
                </h3>
                <p className="text-slate-400">
                  We believe your reading tracking app should be as beautiful as
                  the stories you read. Enjoy a clutter-free, gorgeous
                  interface.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="relative rounded-3xl overflow-hidden glass-strong border border-white/10 p-12 sm:p-20 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-5xl font-display font-bold mb-6 text-white">
                Ready to start your journey?
              </h2>
              <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                Join thousands of readers who have already made TomeSphere their
                home for literature.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-slate-900 text-lg font-bold hover:bg-slate-100 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)]"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
