'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { Book } from '@/modules/shared/core/database/client';

// Deterministic gradient palette so the same book always gets the same colour
const COVER_GRADIENTS = [
  'from-indigo-900 via-purple-900 to-slate-900',
  'from-rose-900 via-pink-900 to-slate-900',
  'from-emerald-900 via-teal-900 to-slate-900',
  'from-amber-900 via-orange-900 to-slate-900',
  'from-sky-900 via-cyan-900 to-slate-900',
  'from-violet-900 via-indigo-900 to-slate-900',
];

function getGradient(title: string) {
  const hash = title.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return COVER_GRADIENTS[hash % COVER_GRADIENTS.length];
}

interface LandingTrendingProps {
  popularBooks: Book[];
}

export default function LandingTrending({ popularBooks }: LandingTrendingProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!popularBooks || popularBooks.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % popularBooks.length);
    }, 4000); // Auto-scroll every 4 seconds
    return () => clearInterval(interval);
  }, [popularBooks]);

  if (!popularBooks || popularBooks.length === 0) return null;

  const currentBook = popularBooks[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % popularBooks.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + popularBooks.length) % popularBooks.length);
  };

  return (
    <section className="py-16 relative overflow-hidden w-full">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Constrained Header Container */}
      <div className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16 mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-2 text-[var(--text-primary)] flex items-center gap-2">
              <span>🔥</span> <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Trending Now</span>
            </h2>
            <p className="text-base sm:text-lg text-[var(--text-secondary)]">
              Discover what students are reading right now
            </p>
          </div>
        </div>
      </div>

      {/* Netflix Billboard Style Featured Area */}
      <div className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16 relative z-20">
        <div className="glass-card p-8 sm:p-12 rounded-3xl border border-[var(--border-default)] bg-[var(--surface-default)] shadow-[var(--shadow-card)] relative overflow-hidden group min-h-[45vh] flex items-center">
          {/* Ambient Glow Backdrop Behind Card */}
          <div className="absolute -right-20 -top-20 w-[500px] h-[500px] bg-gradient-to-br from-indigo-600/10 to-purple-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left & Right Absolute Navigation Arrow Overlays */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[var(--surface-floating)] hover:bg-[var(--surface-overlay)] border border-[var(--border-default)] rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all z-30 opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Previous trending book"
          >
            <ArrowLeft size={18} />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[var(--surface-floating)] hover:bg-[var(--surface-overlay)] border border-[var(--border-default)] rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all z-30 opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Next trending book"
          >
            <ArrowRight size={18} />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full relative z-20">
            {/* Left Column: Book metadata & details */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/10 text-[11px] font-bold text-amber-300 uppercase tracking-widest">
                <Sparkles size={12} />
                <span>Top Pick This Week</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-3xl sm:text-5xl font-display font-bold text-[var(--text-primary)] leading-tight">
                  {currentBook.title}
                </h3>
                <p className="text-sm sm:text-base text-[var(--text-secondary)] font-medium">
                  by <span className="text-[var(--text-primary)]">{currentBook.author}</span> • <span className="text-indigo-500 font-semibold">{currentBook.genre || currentBook.academic_subject || 'Academic'}</span>
                </p>
              </div>

              <p className="text-base text-[var(--text-secondary)] leading-relaxed max-w-2xl line-clamp-4">
                {currentBook.description || 'Dive into this highly-rated textbook. Explore clear structure, step-by-step guides, notes, Highlights, and active recall study templates inside TomeSphere.'}
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => window.location.href = `/books/${currentBook.id}`}
                  className="btn-primary px-8 py-3 rounded-xl font-bold tracking-wide flex items-center gap-2 shadow-glow hover:shadow-glow-lg transition-all"
                >
                  <span>📖 Start Reading</span>
                </button>
                <button
                  onClick={() => window.location.href = `/books/${currentBook.id}`}
                  className="px-6 py-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-default)] hover:bg-[var(--surface-overlay)] text-[var(--text-primary)] font-bold transition-all"
                >
                  <span>ℹ️ Book Details</span>
                </button>
              </div>
            </div>

            {/* Right Column: 3D Tilting Book Cover Art */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-6">
              <div className="relative group/cover perspective-1000">
                {/* Book shadow glow */}
                <div className="absolute -inset-2 bg-gradient-to-tr from-indigo-500/30 to-purple-500/30 rounded-2xl opacity-40 blur-2xl transition duration-500 group-hover/cover:opacity-60" />

                <div className="relative w-48 sm:w-64 aspect-[2/3] rounded-2xl overflow-hidden border border-[var(--border-default)] shadow-2xl transition-all duration-500 group-hover/cover:scale-[1.03] group-hover/cover:rotate-y-6 group-hover/cover:rotate-x-3 bg-slate-900 flex items-center justify-center">
                  {currentBook.cover_url ? (
                    <Image
                      src={currentBook.cover_url}
                      alt={currentBook.title}
                      fill
                      unoptimized
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getGradient(currentBook.title)} flex flex-col justify-between p-5 relative overflow-hidden`}>
                      {/* Decorative circles */}
                      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/5" />
                      <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5" />
                      {/* Top: branding */}
                      <div className="relative flex items-center justify-between">
                        <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/30">TomeSphere</span>
                        {currentBook.genre && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-white/50 font-semibold truncate max-w-[70px]">{currentBook.genre}</span>
                        )}
                      </div>
                      {/* Centre: icon */}
                      <div className="relative flex justify-center">
                        <BookOpen size={40} className="text-white/20" strokeWidth={1.2} />
                      </div>
                      {/* Bottom: title + author */}
                      <div className="relative space-y-1">
                        <p className="text-white font-display font-bold text-sm leading-snug line-clamp-3">{currentBook.title}</p>
                        <p className="text-white/50 text-[11px] font-medium truncate">{currentBook.author}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Indicator dots */}
              <div className="flex gap-2">
                {popularBooks.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === idx ? 'w-6 bg-indigo-500' : 'w-1.5 bg-[var(--border-strong)] hover:bg-[var(--text-secondary)]'}`}
                    aria-label={`Go to book ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
