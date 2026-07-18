'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Book } from '@/modules/shared/core/database/client';
import Navbar from '@/modules/shared/navigation/components/Navbar';

import { CurrentlyReadingOutput } from '@/modules/shared/core/types/LibraryReadModels';

interface DashboardData {
    likedBooks: Book[];
    ratedBooks: Array<{ book: Book; rating: number }>;
    comments: Array<{ book: Book; content: string; created_at: string }>;
    readingList: CurrentlyReadingOutput[];
    dailyStats: Array<{ date: string; reading_time_minutes: number; pages_read: number; books_completed: number }>;
}

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface DashboardClientProps {
    user: any;
    initialData: DashboardData;
}

export default function DashboardClient({ user, initialData }: DashboardClientProps) {
    const [activeTab, setActiveTab] = useState<'likes' | 'ratings' | 'comments' | 'reading' | 'stats'>('likes');
    const router = useRouter();

    const stats = {
        totalLikes: initialData.likedBooks.length,
        totalRatings: initialData.ratedBooks.length,
        totalComments: initialData.comments.length,
        booksInList: initialData.readingList.length,
    };

    const hasActivity = stats.totalLikes > 0 || stats.totalRatings > 0 || stats.totalComments > 0 || stats.booksInList > 0;

    return (
        <div className="min-h-screen bg-transparent">
            {/* <Toaster position="top-right" /> */}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8 animate-fadeIn">
                    <h1 className="text-4xl font-bold text-slate-50 mb-2">
                        Knowledge Insights
                    </h1>
                    <p className="text-[var(--text-secondary)]">
                        Your reading activity, learning progress, and knowledge growth at a glance.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slideIn">
                    <div className="glass rounded-xl p-6">
                        <div className="text-3xl mb-2">❤️</div>
                        <div className="text-2xl font-bold text-slate-50">{stats.totalLikes}</div>
                        <div className="text-sm text-slate-400">Liked Books</div>
                    </div>
                    <div className="glass rounded-xl p-6">
                        <div className="text-3xl mb-2">⭐</div>
                        <div className="text-2xl font-bold text-slate-50">{stats.totalRatings}</div>
                        <div className="text-sm text-slate-400">Ratings Given</div>
                    </div>
                    <div className="glass rounded-xl p-6">
                        <div className="text-3xl mb-2">💬</div>
                        <div className="text-2xl font-bold text-slate-50">{stats.totalComments}</div>
                        <div className="text-sm text-slate-400">Comments</div>
                    </div>
                    <div className="glass rounded-xl p-6">
                        <div className="text-3xl mb-2">📚</div>
                        <div className="text-2xl font-bold text-slate-50">{stats.booksInList}</div>
                        <div className="text-sm text-slate-400">Reading List</div>
                    </div>
                </div>

                {!hasActivity ? (
                    <div className="glass-strong rounded-2xl p-12 text-center">
                        <div className="text-6xl mb-4">📖</div>
                        <h2 className="text-2xl font-bold text-slate-50 mb-2">
                            No Activity Yet
                        </h2>
                        <p className="text-slate-400 mb-6">
                            Start exploring books to see your activity here
                        </p>
                        <a
                            href="/home"
                            className="btn-primary inline-block"
                        >
                            Discover Books
                        </a>
                    </div>
                ) : (
                    <>
                        {/* Tabs */}
                        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                            <button
                                onClick={() => setActiveTab('likes')}
                                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${activeTab === 'likes'
                                    ? 'bg-indigo-600 text-white'
                                    : 'glass text-slate-300 hover:bg-[var(--surface-overlay)]'
                                    }`}
                            >
                                ❤️ Liked ({stats.totalLikes})
                            </button>
                            <button
                                onClick={() => setActiveTab('ratings')}
                                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${activeTab === 'ratings'
                                    ? 'bg-indigo-600 text-white'
                                    : 'glass text-slate-300 hover:bg-[var(--surface-overlay)]'
                                    }`}
                            >
                                ⭐ Ratings ({stats.totalRatings})
                            </button>
                            <button
                                onClick={() => setActiveTab('comments')}
                                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${activeTab === 'comments'
                                    ? 'bg-indigo-600 text-white'
                                    : 'glass text-slate-300 hover:bg-[var(--surface-overlay)]'
                                    }`}
                            >
                                💬 Comments ({stats.totalComments})
                            </button>
                            <button
                                onClick={() => setActiveTab('reading')}
                                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${activeTab === 'reading'
                                    ? 'bg-indigo-600 text-white'
                                    : 'glass text-slate-300 hover:bg-[var(--surface-overlay)]'
                                    }`}
                            >
                                📚 Reading List ({stats.booksInList})
                            </button>
                            <button
                                onClick={() => setActiveTab('stats')}
                                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${activeTab === 'stats'
                                    ? 'bg-indigo-600 text-white'
                                    : 'glass text-slate-300 hover:bg-[var(--surface-overlay)]'
                                    }`}
                            >
                                📈 Analytics
                            </button>
                        </div>

                        {/* Content */}
                        <div className="glass-strong rounded-2xl p-6">
                            {activeTab === 'likes' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {initialData.likedBooks.map(book => (
                                        <div key={book.id} className="bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg p-4 hover:bg-[var(--surface-overlay)] transition-all">
                                            <h3 className="text-slate-50 font-semibold mb-1 line-clamp-1">{book.title}</h3>
                                            <p className="text-sm text-slate-400">{book.author}</p>
                                            <span className="inline-block mt-2 px-2 py-1 bg-indigo-600/30 text-indigo-300 rounded text-xs">
                                                {book.genre}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'ratings' && (
                                <div className="space-y-3">
                                    {initialData.ratedBooks.map(({ book, rating }) => (
                                        <div key={book.id} className="bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg p-4 flex items-center gap-4 hover:bg-[var(--surface-overlay)] transition-all">
                                            <img
                                                src={book.cover_url || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=100'}
                                                alt={book.title}
                                                className="w-16 h-20 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <h3 className="text-slate-50 font-semibold mb-1">{book.title}</h3>
                                                <p className="text-sm text-slate-400">{book.author}</p>
                                            </div>
                                            <div className="flex text-yellow-400">
                                                {Array.from({ length: rating }).map((_, i) => (
                                                    <span key={i}>⭐</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'comments' && (
                                <div className="space-y-4">
                                    {initialData.comments.map((comment, idx) => (
                                        <div key={idx} className="bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg p-4 hover:bg-[var(--surface-overlay)] transition-all">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h4 className="text-slate-50 font-semibold">{comment.book.title}</h4>
                                                <span className="text-xs text-slate-500">
                                                    {new Date(comment.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-[var(--text-secondary)]">{comment.content}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'reading' && (
                                <div className="space-y-3">
                                    {initialData.readingList.map((item) => (
                                        <div key={item.book.id} className="bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg p-4 flex items-center gap-4 hover:bg-[var(--surface-overlay)] transition-all">
                                            <img
                                                src={item.book.coverUrl || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=100'}
                                                alt={item.book.title}
                                                className="w-16 h-20 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <h3 className="text-slate-50 font-semibold mb-1">{item.book.title}</h3>
                                                <p className="text-sm text-slate-400">{item.book.author}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.library.state === 'finished'
                                                ? 'bg-green-600/30 text-green-300'
                                                : item.library.state === 'currently_reading'
                                                    ? 'bg-blue-600/30 text-blue-300'
                                                    : 'bg-yellow-600/30 text-yellow-300'
                                                }`}>
                                                {item.library.state === 'finished' && '✅ Finished'}
                                                {item.library.state === 'currently_reading' && '📖 Reading'}
                                                {item.library.state === 'want_to_read' && '📚 Want to Read'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'stats' && (
                                <div className="space-y-6">
                                    {/* Today's Snapshot */}
                                    {(() => {
                                        const todayStr = new Date().toISOString().split('T')[0];
                                        const todayEntry = initialData.dailyStats?.find((s: any) => s.date === todayStr);
                                        return (
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-50 mb-3">Today&apos;s Snapshot</h3>
                                                <div className="grid grid-cols-3 gap-3 mb-6">
                                                    <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-xl p-4 text-center">
                                                        <div className="text-2xl font-bold text-indigo-300">{todayEntry?.pages_read || 0}</div>
                                                        <div className="text-xs text-slate-400 mt-1">Pages Read</div>
                                                    </div>
                                                    <div className="bg-emerald-600/10 border border-emerald-500/20 rounded-xl p-4 text-center">
                                                        <div className="text-2xl font-bold text-emerald-300">{todayEntry?.reading_time_minutes || 0}<span className="text-sm font-normal"> min</span></div>
                                                        <div className="text-xs text-slate-400 mt-1">Reading Time</div>
                                                    </div>
                                                    <div className="bg-amber-600/10 border border-amber-500/20 rounded-xl p-4 text-center">
                                                        <div className="text-2xl font-bold text-amber-300">{todayEntry?.books_completed || 0}</div>
                                                        <div className="text-xs text-slate-400 mt-1">Completed</div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    <h3 className="text-xl font-bold text-slate-50 mb-4">Reading Progress</h3>
                                    {initialData.dailyStats && initialData.dailyStats.length > 0 ? (
                                        <div className="h-80 w-full bg-[var(--surface-raised)] rounded-xl p-4 border border-[var(--border-default)]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={initialData.dailyStats}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" vertical={false} />
                                                    <XAxis dataKey="date" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                                                    <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                                                    <Tooltip 
                                                        contentStyle={{ backgroundColor: 'var(--surface-default)', border: '1px solid var(--border-default)', borderRadius: '8px', color: 'var(--text-primary)' }}
                                                        itemStyle={{ color: '#818cf8' }}
                                                    />
                                                    <Bar dataKey="pages_read" name="Pages Read" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 text-slate-400">
                                            No reading data yet. Read some books to populate your charts!
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
