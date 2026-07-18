'use client';

import { useReaderStore } from '../state/reader-store';
import { MessageSquarePlus, Trash2 } from 'lucide-react';

interface HighlightContextMenuProps {
    onAddNote: (highlightId: string) => void;
    onDeleteHighlight: (highlightId: string) => void;
}

export function HighlightContextMenu({ onAddNote, onDeleteHighlight }: HighlightContextMenuProps) {
    const { clickedHighlightId } = useReaderStore();

    if (!clickedHighlightId) return null;

    return (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-800 text-white shadow-2xl rounded-xl overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-4 min-w-[160px]">
            <button
                onClick={() => onAddNote(clickedHighlightId)}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm hover:bg-white/5 transition-colors text-left"
            >
                <MessageSquarePlus size={16} className="text-indigo-400" />
                Add Note
            </button>
            <div className="h-px bg-white/10" />
            <button
                onClick={() => onDeleteHighlight(clickedHighlightId)}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm hover:bg-white/5 transition-colors text-left text-red-400"
            >
                <Trash2 size={16} />
                Delete Highlight
            </button>
        </div>
    );
}
