'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, BookOpen, Layers } from 'lucide-react';
import BookCard from '@/modules/reading/books/components/BookCard';
import { Book } from '@/modules/shared/core/database/client';

interface LandingCuratedSectionsProps {
  allBooks: Book[];
}

const SUBJECT_ICONS: Record<string, string> = {
  All: '🌐',
  Fiction: '📖',
  'Non-Fiction': '📰',
  Programming: '💻',
  'Computer Science': '🖥️',
  Mathematics: '📐',
  Science: '🔬',
  History: '🏛️',
  Philosophy: '🧠',
  Psychology: '🧬',
  Business: '📊',
  Romance: '💌',
  Mystery: '🔎',
  Fantasy: '🧙',
  'Science Fiction': '🚀',
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.06, duration: 0.4, ease: 'easeOut' },
  }),
  exit: { opacity: 0, y: -12, scale: 0.97, transition: { duration: 0.25 } },
};

export default function LandingCuratedSections({ allBooks }: LandingCuratedSectionsProps) {
  const [activeSubject, setActiveSubject] = useState<string>('All');

  const subjects = useMemo(() => {
    const raw = allBooks.map(b => b.academic_subject || b.genre).filter(Boolean) as string[];
    const unique = Array.from(new Set(raw)).slice(0, 10);
    return ['All', ...unique];
  }, [allBooks]);

  const getCount = (sub: string) =>
    sub === 'All'
      ? allBooks.length
      : allBooks.filter(b =>
          (b.academic_subject || b.genre || '').toLowerCase() === sub.toLowerCase()
        ).length;

  const subjectBooks = useMemo(() => {
    if (activeSubject === 'All') return allBooks.slice(0, 6);
    return allBooks
      .filter(b => (b.academic_subject || b.genre || '').toLowerCase() === activeSubject.toLowerCase())
      .slice(0, 6);
  }, [activeSubject, allBooks]);

  const featuredBooks = useMemo(() => allBooks.slice(0, 6), [allBooks]);

  return (
    <div className="w-full relative z-20">

      {/* ──────── Explore by Subject ──────── */}
      <section className="py-20 w-full">
        <div className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-indigo-400 mb-2 flex items-center gap-2">
                <Layers size={12} />
                Browse by Topic
              </p>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-[var(--text-primary)]">
                Explore by{' '}
                <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Subject
                </span>
              </h2>
              <p className="text-[var(--text-secondary)] mt-2 max-w-md text-sm">
                Filter our entire library by discipline and discover books that match your interests.
              </p>
            </div>

            {/* Subject Chips */}
            <div className="flex flex-wrap gap-2 max-w-xl">
              {subjects.map(sub => {
                const icon = SUBJECT_ICONS[sub] ?? '📚';
                const count = getCount(sub);
                const active = activeSubject === sub;
                return (
                  <button
                    key={sub}
                    onClick={() => setActiveSubject(sub)}
                    className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 flex items-center gap-1.5 ${
                      active
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_16px_rgba(99,102,241,0.45)]'
                        : 'bg-[var(--surface-default)] border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-overlay)]'
                    }`}
                  >
                    <span>{icon}</span>
                    <span>{sub}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        active ? 'bg-white/20 text-white' : 'bg-[var(--surface-raised)] text-[var(--text-tertiary)]'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Animated Book Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSubject}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5"
            >
              {subjectBooks.length > 0 ? (
                subjectBooks.map((book, i) => (
                  <motion.div key={book.id} custom={i} variants={cardVariants} initial="hidden" animate="visible" exit="exit">
                    <BookCard book={book} onLike={() => { window.location.href = '/login'; }} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center gap-3 py-16 text-[var(--text-tertiary)]">
                  <BookOpen size={40} className="opacity-30" />
                  <p className="text-sm">No books found under <span className="text-[var(--text-secondary)]">{activeSubject}</span> yet.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* View All CTA */}
          <div className="flex justify-center mt-10">
            <a
              href="/search"
              className="group flex items-center gap-2 px-8 py-3.5 rounded-full border border-[var(--border-default)] bg-[var(--surface-default)] hover:bg-[var(--surface-overlay)] hover:border-indigo-500/40 text-[var(--text-primary)] font-semibold text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]"
            >
              <span>Browse all {getCount(activeSubject)} books</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>

      {/* ──────── Featured Reading Collection ──────── */}
      <section className="py-20 w-full relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-br from-indigo-600/8 via-purple-600/8 to-pink-600/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16 relative z-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-purple-400 mb-2 flex items-center gap-2">
                <Sparkles size={12} />
                Editor&apos;s Picks
              </p>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-[var(--text-primary)]">
                Featured{' '}
                <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 bg-clip-text text-transparent">
                  Reading Collection
                </span>
              </h2>
              <p className="text-[var(--text-secondary)] mt-2 max-w-md text-sm">
                Hand-picked books for students, professionals, and curious minds.
              </p>
            </div>
            <a
              href="/discover"
              className="group hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-full border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-semibold text-sm transition-all duration-300 self-end"
            >
              <span>Explore Library</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          {/* Book Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {featuredBooks.map((book, i) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4, ease: 'easeOut' }}
              >
                <BookCard book={book} onLike={() => { window.location.href = '/login'; }} />
              </motion.div>
            ))}
          </div>

          {/* Mobile CTA */}
          <div className="flex justify-center mt-10 sm:hidden">
            <a
              href="/discover"
              className="group flex items-center gap-2 px-8 py-3.5 rounded-full border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-semibold text-sm transition-all duration-300"
            >
              <span>Explore Library</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
