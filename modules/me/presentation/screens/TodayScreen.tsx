'use client';

import React from 'react';
import Link from 'next/link';
import { 
    Flame, 
    BookOpen, 
    FileText, 
    Heart, 
    Star, 
    MessageSquare, 
    CheckCircle2, 
    ChevronRight, 
    Target 
} from 'lucide-react';
import type { DashboardData } from '@/modules/me/application/GetTodayOverview/actions/dashboard';
import type { Note } from '@/modules/learning/notes/actions/notes';

interface TodayScreenProps {
    user: any;
    profileData: any;
    dashboardData: DashboardData;
    notes: Note[];
}

export default function TodayScreen({ user, profileData, dashboardData, notes }: TodayScreenProps) {
    const profile = profileData?.profile || {};
    const name = profile.name || user.email?.split('@')[0] || 'Reader';
    const streak = Number(profile.reading_streak_days) || 0;
    const readingGoal = Number(profile.reading_goal) || 12;
    const booksReadCount = profileData?.booksReadCount || 0;

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    // Find currently reading book
    const currentReading = dashboardData.readingList.find(item => item.library.state === 'currently_reading');

    // Filter notes
    const recentNotes = notes.slice(0, 3);

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header Greeting */}
            <div>
                <h2 className="text-3xl font-extrabold text-slate-50 tracking-tight">
                    {getGreeting()}, {name}
                </h2>
                <p className="text-slate-400 mt-1 text-sm font-medium">
                    Here is your reading and learning state for today.
                </p>
            </div>

            {/* Split Grid: Primary Tasks & Goals */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Currently Reading Card */}
                <div className="md:col-span-2 p-6 rounded-2xl bg-[var(--surface-default)] border border-[var(--border-default)] hover:border-[var(--border-strong)] transition-all duration-200 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <BookOpen size={16} className="text-indigo-400" />
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400">Continue Reading</span>
                        </div>

                        {currentReading ? (
                            <div className="flex gap-4">
                                <img
                                    src={currentReading.book.coverUrl || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=120'}
                                    alt={currentReading.book.title}
                                    className="w-20 h-28 object-cover rounded-xl shadow-md border border-[var(--border-subtle)]"
                                />
                                <div className="min-w-0">
                                    <h3 className="text-lg font-bold text-slate-50 truncate">{currentReading.book.title}</h3>
                                    <p className="text-xs text-slate-400 font-semibold truncate mt-0.5">{currentReading.book.author}</p>
                                    <span className="inline-block mt-3 px-2 py-0.5 bg-indigo-600/20 text-indigo-300 rounded-md text-[10px] font-bold uppercase tracking-wider">
                                        {currentReading.book.genre}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="py-6 text-center">
                                <p className="text-sm text-slate-400">No books currently in progress.</p>
                                <Link 
                                    href="/discover" 
                                    className="inline-block mt-3 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                                >
                                    Browse Library →
                                </Link>
                            </div>
                        )}
                    </div>

                    {currentReading && (
                        <div className="mt-5 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                            <span className="text-xs text-slate-400 font-semibold">Active progress tracked</span>
                            <Link 
                                href={`/read/${currentReading.book.id}`}
                                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shrink-0"
                            >
                                Open Reader
                            </Link>
                        </div>
                    )}
                </div>

                {/* Goals Progress Widget */}
                <div className="p-6 rounded-2xl bg-[var(--surface-default)] border border-[var(--border-default)] hover:border-[var(--border-strong)] transition-all duration-200 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Target size={16} className="text-pink-400" />
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-pink-400">Goals & Targets</span>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm font-bold text-slate-50">
                                    <span>Reading Goal</span>
                                    <span>{booksReadCount} / {readingGoal} Books</span>
                                </div>
                                <div className="w-full bg-[var(--surface-raised)] rounded-full h-2 mt-2 overflow-hidden border border-[var(--border-subtle)]">
                                    <div 
                                        className="bg-gradient-to-r from-pink-500 to-indigo-500 h-full rounded-full transition-all duration-500" 
                                        style={{ width: `${Math.min(100, (booksReadCount / readingGoal) * 100)}%` }}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mt-4 p-3.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)]">
                                <Flame className="w-6 h-6 text-orange-500 fill-orange-500/20" />
                                <div>
                                    <div className="text-sm font-bold text-slate-50">{streak} Days</div>
                                    <div className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Active Reading Streak</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Link 
                        href="/me/progress"
                        className="mt-6 flex items-center justify-between text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors group"
                    >
                        <span>View Progress Goals</span>
                        <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>

            </div>

            {/* Split Layout: Recent Notes vs Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Recent Smart Notes */}
                <div className="p-6 rounded-2xl bg-[var(--surface-default)] border border-[var(--border-default)] shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FileText size={16} className="text-purple-400" />
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400">Recent Study Notes</span>
                        </div>
                        <Link href="/me/learning/notes" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                            View All
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {recentNotes.length > 0 ? (
                            recentNotes.map(note => (
                                <Link 
                                    key={note.id}
                                    href={`/notes/${note.id}`}
                                    className="block p-3.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)] hover:bg-[var(--surface-overlay)] hover:border-[var(--border-strong)] transition-all duration-200"
                                >
                                    <div className="flex justify-between items-start gap-3">
                                        <h4 className="text-sm font-bold text-slate-50 truncate">{note.title}</h4>
                                        <span className="text-[9px] text-slate-500 font-semibold whitespace-nowrap">
                                            {new Date(note.updated_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 line-clamp-1 mt-1 font-medium">{note.content}</p>
                                </Link>
                            ))
                        ) : (
                            <div className="py-6 text-center text-slate-400 text-sm font-medium">
                                No notes created yet.
                                <Link href="/notes/create" className="block text-indigo-400 font-bold text-xs mt-1">
                                    Write your first note →
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="p-6 rounded-2xl bg-[var(--surface-default)] border border-[var(--border-default)] shadow-sm space-y-4">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-400" />
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">Quick Stats</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-center">
                            <Heart className="w-5 h-5 mx-auto text-pink-500 fill-pink-500/10 mb-1" />
                            <div className="text-xl font-bold text-slate-50">{dashboardData.likedBooks.length}</div>
                            <div className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Likes</div>
                        </div>

                        <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-center">
                            <Star className="w-5 h-5 mx-auto text-yellow-400 fill-yellow-400/10 mb-1" />
                            <div className="text-xl font-bold text-slate-50">{dashboardData.ratedBooks.length}</div>
                            <div className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Ratings</div>
                        </div>

                        <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-center">
                            <MessageSquare className="w-5 h-5 mx-auto text-indigo-400 fill-indigo-400/10 mb-1" />
                            <div className="text-xl font-bold text-slate-50">{dashboardData.comments.length}</div>
                            <div className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Comments</div>
                        </div>

                        <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-center">
                            <BookOpen className="w-5 h-5 mx-auto text-purple-400 mb-1" />
                            <div className="text-xl font-bold text-slate-50">{dashboardData.readingList.length}</div>
                            <div className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Books List</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
