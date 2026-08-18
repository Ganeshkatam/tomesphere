"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, BookOpen, Layers, Clock } from "lucide-react";
import BookCard from "@/modules/books/components/BookCard";
import { BookDto } from "@/modules/library/application/dto/response/BookDto";

interface HomeCuratedSectionsProps {
  allBooks: BookDto[];
  currentlyReadingBooks: BookDto[];
  wantToReadBooks: BookDto[];
  handleAddToList: (id: string, status: any) => Promise<void>;
}

const SUBJECT_ICONS: Record<string, string> = {
  All: "🌐",
  Fiction: "📖",
  "Non-Fiction": "📰",
  Programming: "💻",
  "Computer Science": "🖥️",
  Mathematics: "📐",
  Science: "🔬",
  History: "🏛️",
  Philosophy: "🧠",
  Psychology: "🧬",
  Business: "📊",
  Romance: "💌",
  Mystery: "🔎",
  Fantasy: "🧙",
  "Science Fiction": "🚀",
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.06, duration: 0.4, ease: "easeOut" },
  }),
  exit: { opacity: 0, y: -12, scale: 0.97, transition: { duration: 0.25 } },
};

export default function HomeCuratedSections({
  allBooks,
  currentlyReadingBooks,
  wantToReadBooks,
  handleAddToList,
}: HomeCuratedSectionsProps) {
  const [activeSubject, setActiveSubject] = useState<string>("All");

  const subjects = useMemo(() => {
    const raw = allBooks
      .flatMap((b) => [
        ...(b.subjects?.map((s) => s.name) || []),
        ...(b.genres?.map((g) => g.name) || []),
      ])
      .filter(Boolean) as string[];
    const unique = Array.from(new Set(raw)).slice(0, 10);
    return ["All", ...unique];
  }, [allBooks]);

  const getCount = (sub: string) =>
    sub === "All"
      ? allBooks.length
      : allBooks.filter(
          (b) =>
            b.subjects?.some(
              (s) => s.name.toLowerCase() === sub.toLowerCase(),
            ) ||
            b.genres?.some((g) => g.name.toLowerCase() === sub.toLowerCase()),
        ).length;

  const subjectBooks = useMemo(() => {
    if (activeSubject === "All") return allBooks.slice(0, 6);
    return allBooks
      .filter(
        (b) =>
          b.subjects?.some(
            (s) => s.name.toLowerCase() === activeSubject.toLowerCase(),
          ) ||
          b.genres?.some(
            (g) => g.name.toLowerCase() === activeSubject.toLowerCase(),
          ),
      )
      .slice(0, 6);
  }, [activeSubject, allBooks]);

  const featuredBooks = useMemo(() => allBooks.slice(0, 6), [allBooks]);

  const bookCardProps = (book: BookDto) => ({
    book,
    onAddToList: (status: any) => handleAddToList(book.id, status),
  });

  return (
    <div className="w-full space-y-0 mt-12">
      {/* ──────── Continue Reading ──────── */}
      {currentlyReadingBooks.length > 0 && (
        <section className="py-16 w-full">
          <div className="mb-8">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-emerald-400 mb-2 flex items-center gap-2">
              <Clock size={12} />
              Pick Up Where You Left Off
            </p>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
              Continue{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Reading
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {currentlyReadingBooks.slice(0, 6).map((book, i) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4, ease: "easeOut" }}
              >
                <BookCard {...bookCardProps(book)} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ──────── Explore by Subject ──────── */}
      <section className="py-16 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-indigo-400 mb-2 flex items-center gap-2">
              <Layers size={12} />
              Browse by Topic
            </p>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
              Explore by{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Subject
              </span>
            </h2>
            <p className="text-slate-400 mt-2 max-w-md text-sm">
              Filter the full library by discipline and discover your next read.
            </p>
          </div>

          {/* Subject Chips */}
          <div className="flex flex-wrap gap-2 max-w-xl">
            {subjects.map((sub) => {
              const icon = SUBJECT_ICONS[sub] ?? "📚";
              const count = getCount(sub);
              const active = activeSubject === sub;
              return (
                <button
                  key={sub}
                  onClick={() => setActiveSubject(sub)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 flex items-center gap-1.5 ${
                    active
                      ? "bg-indigo-600 border-indigo-500 text-white shadow-[0_0_16px_rgba(99,102,241,0.45)]"
                      : "bg-white/5 border-[var(--border-default)] text-slate-400 hover:text-white hover:bg-white/10 hover:border-[var(--border-strong)]"
                  }`}
                >
                  <span>{icon}</span>
                  <span>{sub}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-white/10 text-slate-500"
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
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5"
          >
            {subjectBooks.length > 0 ? (
              subjectBooks.map((book, i) => (
                <motion.div
                  key={book.id}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <BookCard {...bookCardProps(book)} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center gap-3 py-16 text-slate-500">
                <BookOpen size={40} className="opacity-30" />
                <p className="text-sm">
                  No books found under{" "}
                  <span className="text-white/60">{activeSubject}</span> yet.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* View All */}
        <div className="flex justify-center mt-10">
          <a
            href="/discover"
            className="group flex items-center gap-2 px-8 py-3.5 rounded-full border border-[var(--border-default)] bg-white/5 hover:bg-white/10 hover:border-indigo-500/40 text-white font-semibold text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]"
          >
            <span>Browse all {getCount(activeSubject)} books</span>
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </a>
        </div>
      </section>

      {/* ──────── Featured Reading Collection ──────── */}
      <section className="py-16 w-full relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-br from-purple-600/8 via-pink-600/8 to-rose-600/8 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-purple-400 mb-2 flex items-center gap-2">
                <Sparkles size={12} />
                Editor&apos;s Picks
              </p>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                Featured{" "}
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                  Reading Collection
                </span>
              </h2>
              <p className="text-slate-400 mt-2 max-w-md text-sm">
                Curated titles for students, researchers, and professional
                learners.
              </p>
            </div>
            <a
              href="/discover"
              className="group hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-full border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-semibold text-sm transition-all duration-300 self-end"
            >
              <span>Explore Library</span>
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
          </div>

          {/* Book Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {featuredBooks.map((book, i) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4, ease: "easeOut" }}
              >
                <BookCard {...bookCardProps(book)} />
              </motion.div>
            ))}
          </div>

          {/* Mobile CTA */}
          <div className="flex justify-center mt-10 sm:hidden">
            <a
              href="/discover"
              className="group flex items-center gap-2 px-8 py-3.5 rounded-full border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-semibold text-sm transition-all"
            >
              <span>Explore Library</span>
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
