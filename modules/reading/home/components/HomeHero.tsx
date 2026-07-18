'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, ArrowRight, CheckCircle2, FileText, Sparkles, BookMarked } from 'lucide-react';
import Image from 'next/image';

interface HomeHeroProps {
    user: any;
    userStats: {
        totalLikes: number;
        favoriteGenre: string;
        todayStats: {
            reading_time_minutes: number;
            pages_read: number;
            books_completed: number;
        } | null;
    };
    recommendations: any[];
    currentlyReadingBooks: any[];
    wantToReadBooks: any[];
    notes: any[];
    bookmarksCount: number;
    latestHighlight: any;
}

export default function HomeHero({
    user,
    recommendations = [],
    currentlyReadingBooks = [],
    notes = [],
    bookmarksCount = 0
}: HomeHeroProps) {
    const router = useRouter();
    const [greeting, setGreeting] = useState('Welcome');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good morning');
        else if (hour < 18) setGreeting('Good afternoon');
        else setGreeting('Good evening');
    }, []);

    if (!user) return null;

    const displayName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Reader';
    const firstName = displayName.split(' ')[0];

    // Current Reading Book
    const currentBook = currentlyReadingBooks?.[0] || recommendations?.[0] || null;
    const isCurrentlyReading = currentlyReadingBooks?.length > 0;

    // Simulated progress details
    const currentPage = isCurrentlyReading ? 128 : 0;
    const totalPages = currentBook?.pages || 642;
    const progressPercent = currentBook && totalPages ? Math.min(100, Math.round((currentPage / totalPages) * 100)) : 0;

    return (
        <div className="w-full space-y-6">
            {/* Minimal Header Greeting */}
            <div className="pb-1">
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-300">
                    {greeting}, <span className="text-white font-extrabold">{firstName}</span>
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm mt-1 font-medium">What would you like to learn today?</p>
            </div>

            {/* Header Content Grid: Continue Reading (Left) + Learning Hub (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Layer 1 — Continue Reading (2/3 width) */}
                <div className="lg:col-span-2 glass-strong border border-white/10 hover:border-indigo-500/20 rounded-3xl p-6 relative overflow-hidden group transition-all duration-300 shadow-[0_12px_40px_rgba(0,0,0,0.4)] flex flex-col justify-between min-h-[250px]">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-indigo-500/15 transition-colors duration-500" />
                    
                    <div className="relative z-10 flex flex-col md:flex-row gap-6 sm:gap-8 items-start md:items-center justify-between h-full">
                        <div className="flex gap-6 items-center">
                            {/* Premium Book Cover Mockup with Crease Shadow */}
                            <div className="relative w-20 h-28 sm:w-24 sm:h-36 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-950 to-slate-900 border border-white/15 flex-shrink-0 shadow-[0_8px_20px_rgba(99,102,241,0.2)] group-hover:shadow-[0_12px_30px_rgba(99,102,241,0.35)] group-hover:scale-[1.02] transition-all duration-300">
                                {currentBook?.cover_url ? (
                                    <Image
                                        src={currentBook.cover_url}
                                        alt={currentBook.title}
                                        fill
                                        unoptimized
                                        priority
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center">
                                        <BookOpen size={28} className="text-white/20 mb-2" />
                                        <div className="text-[9px] font-bold text-white/90 line-clamp-3 leading-snug">{currentBook?.title || 'No Books'}</div>
                                    </div>
                                )}
                                {/* Crease overlay */}
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-black/25 border-r border-white/5" />
                            </div>

                            {/* Book metadata and Reading status */}
                            <div className="space-y-3 min-w-0">
                                <span className="text-[10px] sm:text-xs font-bold text-indigo-400 uppercase tracking-widest block">
                                    {isCurrentlyReading ? 'Continue Reading' : 'Start Reading'}
                                </span>
                                
                                {currentBook ? (
                                    <div>
                                        <h3 className="text-lg sm:text-xl font-bold text-white line-clamp-1 group-hover:text-indigo-300 transition-colors leading-tight">
                                            {currentBook.title}
                                        </h3>
                                        <p className="text-slate-400 text-xs sm:text-sm mt-0.5 font-medium truncate">by {currentBook.author}</p>
                                    </div>
                                ) : (
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Your Reading Shelf is Waiting</h3>
                                        <p className="text-slate-400 text-xs mt-0.5">Explore books to get started</p>
                                    </div>
                                )}

                                {currentBook && (
                                    isCurrentlyReading ? (
                                        <div className="space-y-1.5 max-w-xs">
                                            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/5">
                                                <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${progressPercent}%` }} />
                                            </div>
                                            <span className="text-[10px] text-slate-500 font-semibold block">{progressPercent}% Completed • Page {currentPage} of {totalPages}</span>
                                        </div>
                                    ) : (
                                        <span className="text-[10px] text-slate-500 font-semibold block">{totalPages} pages • {currentBook.genre || 'Study Material'}</span>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Resume / Explore action button */}
                        <button
                            onClick={() => router.push(currentBook ? `/read/${currentBook.id}` : '/discover')}
                            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 text-white rounded-xl text-xs sm:text-sm font-bold shadow-[0_4px_16px_rgba(99,102,241,0.2)] transition-all hover:scale-[1.02] active:scale-95 flex-shrink-0"
                        >
                            <span>{currentBook ? (isCurrentlyReading ? 'Resume Reading' : 'Start Reading') : 'Explore Books'}</span>
                            <ArrowRight size={14} />
                        </button>
                    </div>
                </div>

                {/* Layer 3 — Learning Hub (1/3 width) */}
                <div className="glass-strong border border-white/10 hover:border-emerald-500/20 rounded-3xl p-6 relative overflow-hidden group transition-all duration-300 shadow-[0_12px_40px_rgba(0,0,0,0.4)] flex flex-col justify-between min-h-[250px]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[70px] pointer-events-none" />
                    
                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">
                                <BookMarked size={14} />
                                <span>Learning Hub</span>
                            </div>
                        </div>

                        {/* Compact Actionable Items */}
                        <div className="space-y-2.5 pt-2">
                            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300 font-medium">
                                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                                <span>{bookmarksCount} highlights waiting</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300 font-medium">
                                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                                <span>{notes.length} notes created</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300 font-medium">
                                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                                <span>Review flashcards</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push('/exam-prep')}
                        className="relative z-10 w-full flex items-center justify-center gap-2 px-5 py-3 border border-white/10 hover:border-emerald-500/30 bg-white/5 hover:bg-emerald-500/5 text-slate-300 hover:text-white rounded-xl text-xs sm:text-sm font-semibold transition-all"
                    >
                        <span>Resume Learning</span>
                        <ArrowRight size={14} />
                    </button>
                </div>

            </div>
        </div>
    );
}
