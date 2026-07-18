'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay, ease: 'easeOut' },
});

export default function StudentSection() {
  const router = useRouter();

  const handleSubjectClick = (subject: string) => {
    const genreName = subject.split(' ').slice(1).join(' ');
    router.push(`/explore?genre=${encodeURIComponent(genreName)}`);
  };

  return (
    <section id="study-tools-section" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'var(--study-tools-bg)' }} />
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/6 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16">

        {/* ── 40 / 60 Split ── */}
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20 items-center">

          {/* ── LEFT: Product Intro (40%) ── */}
          <div className="w-full lg:w-[38%] shrink-0 flex flex-col gap-8">

            {/* Badge */}
            <motion.div {...fadeUp(0)}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600/20 border border-indigo-500/30 w-fit">
                <span className="text-lg">🛠</span>
                <span className="text-sm font-semibold text-indigo-300 tracking-wide">Study Tools</span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div {...fadeUp(0.07)} className="space-y-3">
              <h2 className="text-4xl sm:text-5xl font-display font-bold leading-tight text-slate-50">
                From Reading<br />
                to{' '}
                <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                  Remembering
                </span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
                Everything you need to transform a book into organised, reviewable knowledge.
              </p>
            </motion.div>

            {/* Workflow indicator */}
            <motion.div {...fadeUp(0.13)} className="flex items-center gap-3 text-sm font-semibold text-slate-400">
              <span className="text-slate-50">Read</span>
              <span className="text-indigo-500">→</span>
              <span className="text-slate-50">Annotate</span>
              <span className="text-indigo-500">→</span>
              <span className="text-slate-50">Retain</span>
            </motion.div>

            {/* Bullet benefits */}
            <motion.ul {...fadeUp(0.18)} className="space-y-3">
              {[
                'Open books in the immersive reader',
                'Highlight important concepts',
                'Create connected notes',
                'Generate citations automatically',
                'Review with flashcard decks',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-300 text-sm">
                  <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                    <Check size={11} className="text-emerald-400" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </motion.ul>

            {/* CTA */}
            <motion.div {...fadeUp(0.22)}>
              <button
                onClick={() => router.push('/discover')}
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm transition-all duration-300 shadow-[0_0_24px_rgba(16,185,129,0.3)] hover:shadow-[0_0_32px_rgba(16,185,129,0.45)] hover:-translate-y-0.5"
              >
                Explore Study Tools
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          </div>

          {/* ── RIGHT: Asymmetric Bento Grid (60%) ── */}
          <motion.div
            {...fadeUp(0.1)}
            className="w-full lg:flex-1 grid grid-cols-2 grid-rows-3 gap-4"
            style={{ gridTemplateRows: 'auto auto auto' }}
          >
            {/* Row 1: Open Book + Highlight (equal halves) */}
            <div
              onClick={() => router.push('/discover')}
              className="group glass-strong rounded-2xl p-5 border border-[var(--border-default)] hover:border-indigo-500/40 hover:bg-[var(--surface-overlay)] transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[130px]"
            >
              <div className="text-2xl mb-2">📖</div>
              <div>
                <p className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-1">Step 1</p>
                <h3 className="text-slate-50 font-bold text-sm group-hover:text-indigo-500 dark:group-hover:text-indigo-300 transition-colors">Open Book</h3>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">Browse and open any title in the immersive reader.</p>
              </div>
            </div>
 
            <div
              className="group glass-strong rounded-2xl p-5 border border-[var(--border-default)] hover:border-yellow-500/40 hover:bg-[var(--surface-overlay)] transition-all duration-300 flex flex-col justify-between min-h-[130px]"
            >
              <div className="text-2xl mb-2">✨</div>
              <div>
                <p className="text-[10px] font-bold text-amber-600 dark:text-yellow-400 uppercase tracking-widest mb-1">Step 2</p>
                <h3 className="text-slate-50 font-bold text-sm group-hover:text-amber-500 dark:group-hover:text-yellow-300 transition-colors">Highlight Text</h3>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">Mark key passages in custom colours.</p>
              </div>
            </div>

            {/* Row 2: Create Notes — full-width hero card */}
            <div
              onClick={() => router.push('/notes')}
              className="col-span-2 group relative glass-strong rounded-2xl p-7 border border-emerald-500/20 hover:border-emerald-500/50 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 hover:from-emerald-500/10 hover:to-teal-500/10 transition-all duration-300 cursor-pointer overflow-hidden min-h-[150px] flex flex-col justify-between"
            >
              {/* Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-2xl pointer-events-none" />
              <div className="relative">
                <div className="text-3xl mb-3">✍️</div>
                <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Step 3 · The Heart of Learning</p>
                <h3 className="text-slate-50 font-bold text-xl group-hover:text-emerald-300 transition-colors">Create Notes</h3>
                <p className="text-slate-400 text-sm mt-2 max-w-md leading-relaxed">
                  Attach personal notes to highlighted quotes. Build a structured knowledge map from every book you read.
                </p>
              </div>
              <div className="relative mt-4 flex items-center gap-2 text-emerald-400 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Open Notes <ArrowRight size={12} />
              </div>
            </div>

            {/* Row 3: Citations + Review Decks */}
            <div
              onClick={() => router.push('/citations')}
              className="group glass-strong rounded-2xl p-5 border border-[var(--border-default)] hover:border-purple-500/40 hover:bg-[var(--surface-overlay)] transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[130px]"
            >
              <div className="text-2xl mb-2">📑</div>
              <div>
                <p className="text-[10px] font-bold text-purple-500 dark:text-purple-400 uppercase tracking-widest mb-1">Step 4</p>
                <h3 className="text-slate-50 font-bold text-sm group-hover:text-purple-500 dark:group-hover:text-purple-300 transition-colors">Citations</h3>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">Auto-generate APA, MLA, or Harvard references.</p>
              </div>
            </div>
 
            <div
              onClick={() => router.push('/exam-prep')}
              className="group glass-strong rounded-2xl p-5 border border-[var(--border-default)] hover:border-rose-500/40 hover:bg-[var(--surface-overlay)] transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[130px]"
            >
              <div className="text-2xl mb-2">🎯</div>
              <div>
                <p className="text-[10px] font-bold text-rose-500 dark:text-rose-400 uppercase tracking-widest mb-1">Step 5</p>
                <h3 className="text-slate-50 font-bold text-sm group-hover:text-rose-500 dark:group-hover:text-rose-300 transition-colors">Review Decks</h3>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">Turn annotations into flashcard decks for active recall.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Popular Study Areas ── */}
        <motion.div {...fadeUp(0.2)} className="mt-20 pt-10 border-t border-white/5">
          <h3 className="text-center text-sm font-semibold text-slate-500 uppercase tracking-widest mb-6">Popular Study Areas</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {['📐 Mathematics', '🔬 Science', '💻 Computer Science', '⚖️ Law', '🏥 Medicine', '💼 Business', '🎨 Arts', '🌍 History', '📊 Economics', '🧪 Chemistry', '🔭 Physics', '🧬 Biology'].map((subject) => (
              <button
                key={subject}
                onClick={() => handleSubjectClick(subject)}
                className="px-4 py-2 bg-[var(--surface-default)] hover:bg-[var(--surface-overlay)] border border-[var(--border-default)] hover:border-emerald-500/30 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-200"
              >
                {subject}
              </button>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
