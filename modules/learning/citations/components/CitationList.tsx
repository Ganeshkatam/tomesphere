'use client';

import { useState } from 'react';
import type { Book } from '@/modules/shared/core/database/client';
import type { CitationFormat, Citation } from '../types';
import { generateBibliography, copyToClipboard } from '@/modules/learning/citations/services/citations';
import { showError, showSuccess } from '@/lib/toast';
import { Copy, Download, Save } from 'lucide-react';
import { CitationCard } from './CitationCard';
import { saveCitation } from '../actions/citations';

interface CitationListProps {
    selectedBooks: Book[];
    onRemoveBook: (bookId: string) => void;
    format: CitationFormat;
    setFormat: (f: CitationFormat) => void;
    savedBibliographies: Citation[];
    onLoadHistory: (books: Book[]) => void;
    onCitationSaved: () => void;
}

export function CitationList({
    selectedBooks,
    onRemoveBook,
    format,
    setFormat,
    savedBibliographies,
    onLoadHistory,
    onCitationSaved
}: CitationListProps) {
    const [showHistory, setShowHistory] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [bibTitle, setBibTitle] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleCopy = async () => {
        const bibliography = generateBibliography(selectedBooks, format);
        try {
            await copyToClipboard(bibliography);
            showSuccess('Bibliography copied to clipboard!');
        } catch (error) {
            showError('Failed to copy');
        }
    };

    const handleDownload = () => {
        const bibliography = generateBibliography(selectedBooks, format);
        const blob = new Blob([bibliography], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bibliography-${format}.txt`;
        a.click();
        showSuccess('Bibliography downloaded!');
    };

    const handleSave = async () => {
        if (!bibTitle.trim()) {
            showError('Please enter a title');
            return;
        }

        setIsSaving(true);
        const res = await saveCitation({
            title: bibTitle,
            format,
            books: selectedBooks
        });
        setIsSaving(false);

        if (res.success) {
            showSuccess('Bibliography saved!');
            setShowSaveModal(false);
            setBibTitle('');
            onCitationSaved(); // Refresh history
        } else {
            showError(res.error);
        }
    };

    return (
        <div className="glass-strong rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Bibliography ({selectedBooks.length})</h2>
                <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="text-xs text-indigo-400 hover:text-indigo-300"
                >
                    {showHistory ? 'Hide History' : 'View History'}
                </button>
            </div>

            {/* Format Selector */}
            <div className="flex gap-2 mb-4">
                {(['apa', 'mla', 'chicago', 'harvard'] as CitationFormat[]).map(f => (
                    <button
                        key={f}
                        onClick={() => setFormat(f)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            format === f
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white/5 text-slate-400 hover:bg-white/10'
                        }`}
                    >
                        {f.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Selected Books List */}
            {!showHistory ? (
                <>
                    <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                        {selectedBooks.map(book => (
                            <CitationCard
                                key={book.id}
                                book={book}
                                format={format}
                                onRemove={onRemoveBook}
                            />
                        ))}
                        {selectedBooks.length === 0 && (
                            <div className="text-center py-8 text-slate-500">
                                No books selected. Search and add books to generate citations.
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    {selectedBooks.length > 0 && (
                        <div className="flex gap-2">
                            <button
                                onClick={handleCopy}
                                className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <Copy size={18} />
                                Copy
                            </button>
                            <button
                                onClick={handleDownload}
                                className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <Download size={18} />
                                Download
                            </button>
                            <button
                                onClick={() => setShowSaveModal(true)}
                                className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <Save size={18} />
                                Save
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                    {savedBibliographies.map(bib => (
                        <div key={bib.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="text-white font-medium">{bib.title}</p>
                                    <p className="text-xs text-slate-500">{new Date(bib.created_at).toLocaleDateString()}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        onLoadHistory(bib.books);
                                        setShowHistory(false);
                                    }}
                                    className="text-xs bg-indigo-600/20 text-indigo-400 px-2 py-1 rounded"
                                >
                                    Load
                                </button>
                            </div>
                            <p className="text-xs text-slate-400">{bib.books?.length || 0} books</p>
                        </div>
                    ))}
                    {savedBibliographies.length === 0 && (
                        <p className="text-center text-slate-500 py-4">No saved bibliographies found.</p>
                    )}
                </div>
            )}

            {/* Save Modal */}
            {showSaveModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="glass-strong rounded-2xl p-6 max-w-sm w-full relative">
                        <h3 className="text-lg font-bold text-white mb-4">Save Bibliography</h3>
                        <input
                            type="text"
                            value={bibTitle}
                            onChange={(e) => setBibTitle(e.target.value)}
                            placeholder="Bibliography Name"
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white mb-4 focus:outline-none focus:border-indigo-500"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowSaveModal(false)}
                                disabled={isSaving}
                                className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50"
                            >
                                {isSaving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
