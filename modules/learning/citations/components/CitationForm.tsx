'use client';

import { useState } from 'react';
import type { Book } from '@/modules/shared/core/database/client';
import { searchBooksAction } from '../actions/citations';
import { showError } from '@/lib/toast';

interface CitationFormProps {
    onAddBook: (book: Book) => void;
}

export function CitationForm({ onAddBook }: CitationFormProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!searchTerm.trim()) return;

        setLoading(true);
        try {
            const res = await searchBooksAction(searchTerm);
            if (res.success) {
                setSearchResults(res.data);
            } else {
                showError(res.error);
            }
        } catch (error) {
            showError('Failed to search books');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-strong rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Add Books</h2>

            {/* Search */}
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search by title or author..."
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50"
                />
                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all disabled:opacity-50"
                >
                    Search
                </button>
            </div>

            {/* Search Results */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
                {searchResults.map((book) => (
                    <div
                        key={book.id}
                        className="p-3 bg-white/5 rounded-lg flex items-center justify-between hover:bg-white/10 transition-all"
                    >
                        <div className="flex-1">
                            <p className="text-white font-medium text-sm line-clamp-1">{book.title}</p>
                            <p className="text-slate-400 text-xs">{book.author}</p>
                        </div>
                        <button
                            onClick={() => onAddBook(book)}
                            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-all"
                        >
                            Add
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
