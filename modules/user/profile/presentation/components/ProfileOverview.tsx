'use client';

import { Target, Star, Globe } from 'lucide-react';

import { CurrentlyReadingOutput } from '@/modules/shared/core/types/LibraryReadModels';

interface ProfileOverviewProps {
    stats: any;
    formData: any;
    profile: any;
    recentBooks?: CurrentlyReadingOutput[];
}

export default function ProfileOverview({ stats, formData, profile, recentBooks = [] }: ProfileOverviewProps) {
    const availableBadges = ['🥇', '🥈', '🥉', '🏆', '⭐', '💎', '🚀', '📚', '🎯', '👑'];
    const earnedBadges = availableBadges.slice(0, stats.achievements);
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                {/* Reading Progress */}
                <div className="glass-strong rounded-2xl p-6 border border-[var(--border-default)]">
                    <h3 className="text-xl font-bold text-slate-50 mb-4 flex items-center gap-2">
                        <Target className="text-indigo-400" />
                        Reading Progress
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-[var(--text-secondary)]">Annual Goal</span>
                                <span className="text-slate-50 font-bold">{stats.booksRead} / {formData.reading_goal} books</span>
                            </div>
                            <div className="h-3 bg-[var(--border-default)] rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full" style={{ width: `${Math.min((stats.booksRead / formData.reading_goal) * 100, 100)}%` }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recently Read */}
                <div className="glass-strong rounded-2xl p-6 border border-[var(--border-default)]">
                    <h3 className="text-xl font-bold text-slate-50 mb-4">Recently Read</h3>
                    <div className="space-y-3">
                        {recentBooks.length > 0 ? (
                            recentBooks.map((item, i) => {
                                const book = item.book;
                                if (!book) return null;
                                return (
                                    <div key={i} className="flex gap-4 p-3 bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg hover:bg-[var(--surface-overlay)] transition-colors">
                                        {book.coverUrl ? (
                                            <img src={book.coverUrl} alt={book.title} className="w-12 h-16 object-cover rounded shadow" />
                                        ) : (
                                            <div className="w-12 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded flex items-center justify-center text-xs text-white/50 text-center p-1">No Cover</div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-slate-50 font-medium truncate">{book.title}</h4>
                                            <p className="text-sm text-slate-400 truncate">{book.author}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                                <span className="text-xs text-slate-400">Finished</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-slate-400 text-sm italic">No books read yet. Start exploring the library!</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                {/* Profile Details */}
                <div className="glass-strong rounded-2xl p-6 border border-[var(--border-default)]">
                    <h3 className="text-lg font-bold text-slate-50 mb-4">Profile Details</h3>
                    <div className="space-y-3 text-sm">
                        {formData.location && (
                            <div className="flex justify-between">
                                <span className="text-slate-400">Location</span>
                                <span className="text-slate-50">{formData.location}</span>
                            </div>
                        )}
                        {formData.date_of_birth && (
                            <div className="flex justify-between">
                                <span className="text-slate-400">Birthday</span>
                                <span className="text-slate-50">{new Date(formData.date_of_birth).toLocaleDateString()}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-slate-400">Member Since</span>
                            <span className="text-slate-50">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}</span>
                        </div>
                    </div>
                </div>

                {/* Badges */}
                <div className="glass-strong rounded-2xl p-6 border border-[var(--border-default)]">
                    <h3 className="text-lg font-bold text-slate-50 mb-4">Badges</h3>
                    {earnedBadges.length > 0 ? (
                        <div className="grid grid-cols-3 gap-3">
                            {earnedBadges.map((badge, i) => (
                                <div key={i} className="aspect-square bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-600/50 rounded-xl flex items-center justify-center text-3xl hover:scale-110 transition-transform cursor-help" title="Earned Badge">
                                    {badge}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-400 text-sm italic">Keep reading and engaging to earn your first badge!</p>
                    )}
                </div>
            </div>
        </div>
    );
}
