'use client';

import type { Book } from '@/modules/shared/core/database/client';
import type { CitationFormat } from '../types';
import { generateCitation } from '@/modules/learning/citations/services/citations';

interface CitationCardProps {
    book: Book;
    format: CitationFormat;
    onRemove: (bookId: string) => void;
}

export function CitationCard({ book, format, onRemove }: CitationCardProps) {
    return (
        <div className="p-3 bg-white/5 rounded-lg">
            <div className="flex items-start justify-between mb-2">
                <p className="text-white text-sm font-medium flex-1">{book.title}</p>
                <button
                    onClick={() => onRemove(book.id)}
                    className="text-red-400 hover:text-red-300 text-xs ml-2"
                >
                    ✕
                </button>
            </div>
            <p className="text-slate-400 text-xs font-mono">
                {generateCitation(book, format).replace(/_/g, '')}
            </p>
        </div>
    );
}
