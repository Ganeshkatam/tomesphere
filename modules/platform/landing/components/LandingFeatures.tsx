'use client';

import { useState } from 'react';
import { SlideUp, FadeIn } from '@/modules/shared/ui/animations';

export default function LandingFeatures() {
    const [checklist, setChecklist] = useState([
        { id: 1, text: 'Read Chapter 1 (Introduction to Algorithms)', completed: true },
        { id: 2, text: 'Highlight key citation references', completed: false },
        { id: 3, text: 'Practice question bank (Set A)', completed: false }
    ]);

    const toggleCheck = (id: number) => {
        setChecklist(checklist.map(item => 
            item.id === id ? { ...item, completed: !item.completed } : item
        ));
    };

    return (
        <section id="features-section" className="py-16 sm:py-24 relative overflow-hidden bg-slate-900/20 border-y border-white/5">
            <div className="w-full max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16">
                <FadeIn className="text-center mb-16 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600/20 border border-emerald-500/30 mb-6">
                        <span className="text-sm font-semibold text-emerald-300">Your Reading Tools</span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6 text-slate-50">
                        Read, Track, <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400 bg-clip-text text-transparent">and Remember</span>
                    </h2>
                    <p className="text-lg sm:text-xl text-slate-400">
                        Everything you need to go from finding a book to truly understanding it — reading goals, highlights, notes, and progress tracking in one place.
                    </p>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Widget 1: Reading Goal */}
                    <SlideUp className="glass-strong rounded-3xl p-6 border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between" delay={0.1}>
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Weekly Goal</span>
                                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-medium">Active</span>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-50 mb-2">3.5 hrs / 5 hrs</h3>
                            <p className="text-slate-400 text-sm mb-4">You are on track to complete your reading target this week.</p>
                            
                            {/* Progress bar */}
                            <div className="w-full bg-white/5 rounded-full h-2.5 mb-2 overflow-hidden border border-white/5">
                                <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '70%' }} />
                            </div>
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>70% completed</span>
                                <span>1.5 hrs left</span>
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                            <span className="text-slate-400">Streak Tracker</span>
                            <span className="text-orange-400 font-bold flex items-center gap-1">🔥 5 Days</span>
                        </div>
                    </SlideUp>

                    {/* Widget 2: Study Checklist */}
                    <SlideUp className="glass-strong rounded-3xl p-6 border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between" delay={0.2}>
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Study Planner</span>
                                <span className="text-xs text-indigo-400">Interactive</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-50 mb-3">Tasks for Today</h3>
                            <div className="space-y-3">
                                {checklist.map(item => (
                                    <label key={item.id} className="flex items-start gap-3 cursor-pointer group select-none">
                                        <input 
                                            type="checkbox" 
                                            checked={item.completed} 
                                            onChange={() => toggleCheck(item.id)}
                                            className="mt-1 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-0 focus:ring-offset-0 accent-emerald-500"
                                        />
                                        <span className={`text-sm transition-all duration-300 ${item.completed ? 'line-through text-slate-500' : 'text-slate-300 group-hover:text-slate-50'}`}>
                                            {item.text}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/5 text-center text-xs text-slate-500">
                            Check tasks to mark as completed
                        </div>
                    </SlideUp>

                    {/* Widget 3: Recent Highlights */}
                    <SlideUp className="glass-strong rounded-3xl p-6 border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between" delay={0.3}>
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Featured Quote</span>
                                <span className="text-xs text-amber-400">★ Highlight</span>
                            </div>
                            <p className="text-slate-300 text-sm italic mb-4 leading-relaxed font-serif">
                                &ldquo;The limits of my language mean the limits of my world. We must learn to read not just words, but the concepts underneath.&rdquo;
                            </p>
                        </div>
                        <div>
                            <h4 className="text-slate-50 text-xs font-bold font-sans">Ludwig Wittgenstein</h4>
                            <p className="text-slate-500 text-[10px]">Tractatus Logico-Philosophicus • p. 45</p>
                        </div>
                    </SlideUp>

                    {/* Widget 4: Reading Analytics */}
                    <SlideUp className="glass-strong rounded-3xl p-6 border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between" delay={0.4}>
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Weekly Activity</span>
                                <span className="text-xs text-sky-400">Analytics</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-50 mb-4">Reading Velocity</h3>
                            
                            {/* Mock Bar Chart */}
                            <div className="flex items-end justify-between h-20 gap-2 px-2 mt-2">
                                {[
                                    { day: 'M', mins: 45, height: 'h-[45%]' },
                                    { day: 'T', mins: 60, height: 'h-[60%]' },
                                    { day: 'W', mins: 30, height: 'h-[30%]' },
                                    { day: 'T', mins: 90, height: 'h-[90%]' },
                                    { day: 'F', mins: 40, height: 'h-[40%]' }
                                ].map((bar, idx) => (
                                    <div key={idx} className="flex flex-col items-center flex-1 group relative">
                                        <div className="absolute -top-7 bg-slate-900 text-slate-50 text-[10px] px-1.5 py-0.5 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            {bar.mins} mins
                                        </div>
                                        <div className={`w-full bg-emerald-500/80 group-hover:bg-emerald-400 rounded-t-sm transition-all duration-300 ${bar.height}`} />
                                        <span className="text-[10px] text-slate-400 mt-2 font-medium">{bar.day}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/5 text-center text-xs text-slate-400 font-medium">
                            Daily Average: 53 minutes
                        </div>
                    </SlideUp>
                </div>
            </div>
        </section>
    );
}
