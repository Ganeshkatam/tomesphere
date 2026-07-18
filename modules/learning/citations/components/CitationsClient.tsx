'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import type { Book } from '@/modules/shared/core/database/client';
import type { CitationFormat, Citation } from '../types';
import { CitationForm } from './CitationForm';
import { CitationList } from './CitationList';
import { getCitations } from '../actions/citations';

interface CitationsClientProps {
    initialHistory: Citation[];
}

export function CitationsClient({ initialHistory, isNested = false }: CitationsClientProps & { isNested?: boolean }) {
    const router = useRouter();
    const [selectedBooks, setSelectedBooks] = useState<Book[]>([]);
    const [format, setFormat] = useState<CitationFormat>('apa');
    const [savedBibliographies, setSavedBibliographies] = useState<Citation[]>(initialHistory);

    const handleAddBook = (book: Book) => {
        if (!selectedBooks.find(b => b.id === book.id)) {
            setSelectedBooks([...selectedBooks, book]);
        }
    };

    const handleRemoveBook = (bookId: string) => {
        setSelectedBooks(selectedBooks.filter(b => b.id !== bookId));
    };

    const handleLoadHistory = (books: Book[]) => {
        setSelectedBooks(books);
    };

    const refreshHistory = async () => {
        const res = await getCitations();
        if (res.success) {
            setSavedBibliographies(res.data);
        }
    };

    return (
        <div className={isNested ? "space-y-6" : "min-h-screen bg-transparent py-12 px-4"}>
            <div className={isNested ? "" : "max-w-6xl mx-auto"}>
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.push(isNested ? '/me/learning' : '/home')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 text-xs font-bold"
                    >
                        <ArrowLeft size={14} />
                        {isNested ? 'Back to Learning Hub' : 'Back to Home'}
                    </button>
                    <h1 className="text-2xl font-bold text-slate-50 mb-1">Citation Generator</h1>
                    <p className="text-xs text-slate-400 font-medium">Generate citations in APA, MLA, Chicago, or Harvard format</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: Search and Add Books */}
                    <CitationForm onAddBook={handleAddBook} />

                    {/* Right: Selected Books and Citations */}
                    <CitationList
                        selectedBooks={selectedBooks}
                        onRemoveBook={handleRemoveBook}
                        format={format}
                        setFormat={setFormat}
                        savedBibliographies={savedBibliographies}
                        onLoadHistory={handleLoadHistory}
                        onCitationSaved={refreshHistory}
                    />
                </div>

                {/* Format Guide */}
                <div className="mt-6 glass-strong rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-3">Citation Format Guide</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-indigo-400 font-medium mb-1">APA (7th Edition)</p>
                            <p className="text-slate-400">Author, A. A. (Year). <em>Title of work</em>. Publisher.</p>
                        </div>
                        <div>
                            <p className="text-indigo-400 font-medium mb-1">MLA (9th Edition)</p>
                            <p className="text-slate-400">Author. <em>Title</em>. Publisher, Year.</p>
                        </div>
                        <div>
                            <p className="text-indigo-400 font-medium mb-1">Chicago (17th Edition)</p>
                            <p className="text-slate-400">Author. <em>Title</em>. Publisher, Year.</p>
                        </div>
                        <div>
                            <p className="text-indigo-400 font-medium mb-1">Harvard</p>
                            <p className="text-slate-400">Author (Year) <em>Title</em>. Publisher.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
