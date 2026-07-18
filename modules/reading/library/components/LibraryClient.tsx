'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/modules/shared/navigation/components/Navbar';
import BookCard from '@/modules/reading/books/components/BookCard';
import VoiceInput from '@/modules/reading/search/components/VoiceInput';
import type { CurrentlyReadingOutput } from '@/modules/reading/library/application/Outputs';

interface LibraryClientProps {
    user: any;
    initialLibrary: CurrentlyReadingOutput[];
}

export default function LibraryClient({ user, initialLibrary }: LibraryClientProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'reading' | 'want' | 'finished'>('reading');
    const [searchQuery, setSearchQuery] = useState('');

    // Derived state for the currently active tab using initial pre-fetched data
    const books = useMemo(() => {
        const statusMap = {
            reading: 'currently_reading',
            want: 'want_to_read',
            finished: 'finished'
        };

        const currentStatus = statusMap[activeTab];
        let filtered = initialLibrary.filter(item => item.library.state === currentStatus);

        if (searchQuery.trim()) {
            const lowerQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(item => 
                item.book.title?.toLowerCase().includes(lowerQuery) ||
                item.book.author?.toLowerCase().includes(lowerQuery)
            );
        }

        return filtered;
    }, [initialLibrary, activeTab, searchQuery]);

    const counts = useMemo(() => {
        return {
            reading: initialLibrary.filter(item => item.library.state === 'currently_reading').length,
            want: initialLibrary.filter(item => item.library.state === 'want_to_read').length,
            finished: initialLibrary.filter(item => item.library.state === 'finished').length,
        };
    }, [initialLibrary]);

    return (
        <div className="min-h-screen bg-gradient-page">
            {/* <Toaster position="top-right" /> */}

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8 animate-fadeIn">
                    <h1 className="text-5xl font-display font-bold mb-2">My Library</h1>
                    <p className="text-xl text-slate-400">Organize and track your reading journey</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-white/10">
                    {[
                        { key: 'reading', label: '📖 Currently Reading', count: counts.reading },
                        { key: 'want', label: '📚 Want to Read', count: counts.want },
                        { key: 'finished', label: '✅ Finished', count: counts.finished }
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as any)}
                            className={`px-6 py-3 font-semibold transition-all ${activeTab === tab.key
                                ? 'border-b-2 border-primary text-primary-light'
                                : 'text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="mb-6 flex gap-2 relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search your library..."
                        className="flex-1 px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <VoiceInput onTranscript={(text) => setSearchQuery(text)} />
                    </div>
                </div>

                {/* Books Grid */}
                {books.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-6">📚</div>
                        <h3 className="text-2xl font-bold mb-2">No books yet</h3>
                        <p className="text-slate-400 mb-6">Start building your library</p>
                        <button onClick={() => router.push('/discover')} className="btn btn-primary">
                            Explore Books
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-8">
                        {books.map(item => (
                            <div key={item.library.bookId} className="h-full">
                                <BookCard
                                    book={item.book as any} // BookCard might still expect old type, we'll fix if needed
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

