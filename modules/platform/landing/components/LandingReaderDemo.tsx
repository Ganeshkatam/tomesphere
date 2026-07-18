'use client';

import { SlideUp, FadeIn } from '@/modules/shared/ui/animations';
import Image from 'next/image';

export default function LandingReaderDemo() {
    return (
        <section id="reader-demo-section" className="py-16 sm:py-24 relative overflow-hidden bg-slate-950">
            <div className="w-full max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16">
                <FadeIn className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6 text-slate-50">
                        A World-Class <span className="bg-gradient-to-r from-primary-light via-accent to-secondary bg-clip-text text-transparent">Reading Experience</span>
                    </h2>
                    <p className="text-lg sm:text-xl text-slate-400">
                        Read books with focus, highlight what matters, take notes in context, and build your bibliography — all in one distraction-free reading space.
                    </p>
                </FadeIn>

                <SlideUp className="relative rounded-3xl overflow-hidden border border-[var(--border-default)] bg-slate-900/40 p-4 sm:p-6 backdrop-blur-xl shadow-2xl hover:border-primary/20 transition-colors duration-500 max-w-5xl mx-auto" delay={0.2}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-80 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />

                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[var(--border-subtle)] bg-slate-950 aspect-[16/10]">
                        <Image
                            src="/reader_mockup.png"
                            alt="TomeSphere Digital Reader — highlight, annotate, and learn"
                            fill
                            className="object-cover object-top hover:scale-[1.02] transition-transform duration-700 ease-out"
                            priority
                        />
                    </div>

                    {/* Feature badges below the screenshot */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 pt-8 border-t border-[var(--border-subtle)]">
                        <div className="text-center sm:text-left">
                            <h4 className="text-slate-50 font-bold mb-2 flex items-center gap-2 justify-center sm:justify-start">
                                <span className="text-yellow-400">✍️</span> Active Highlights
                            </h4>
                            <p className="text-slate-400 text-sm">Select any text to highlight, add notes, and save contextual quotes as you read.</p>
                        </div>
                        <div className="text-center sm:text-left">
                            <h4 className="text-slate-50 font-bold mb-2 flex items-center gap-2 justify-center sm:justify-start">
                                <span className="text-emerald-400">📊</span> Progress Tracking
                            </h4>
                            <p className="text-slate-400 text-sm">Monitor reading velocity, calculate pages read, and maintain reading streaks automatically.</p>
                        </div>
                        <div className="text-center sm:text-left">
                            <h4 className="text-slate-50 font-bold mb-2 flex items-center gap-2 justify-center sm:justify-start">
                                <span className="text-sky-400">📝</span> Bibliography Builder
                            </h4>
                            <p className="text-slate-400 text-sm">Auto-generate clean academic citations in Harvard, MLA, APA, or Chicago formats instantly.</p>
                        </div>
                    </div>
                </SlideUp>
            </div>
        </section>
    );
}
