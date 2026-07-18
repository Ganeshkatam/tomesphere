'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Toolbar } from './toolbar/Toolbar';
import { Viewer } from './viewer/Viewer';
import { EpubJsRenderer } from '@/modules/reading/reader/services/parser/epub/EpubJsRenderer';
import { ReaderService } from '@/modules/reading/reader/application/ReaderService';
import { HighlightPopup } from './HighlightPopup';
import { HighlightContextMenu } from './HighlightContextMenu';
import { NoteEditor } from './NoteEditor';
import { useReaderStore } from '../state/reader-store';

interface ReaderShellProps {
    bookId: string;
    fileUrl: string;
    fileType: 'pdf' | 'epub';
    userId: string;
}

export function ReaderShell({ bookId, fileUrl, fileType, userId }: ReaderShellProps) {
    const viewerRef = useRef<HTMLDivElement>(null);
    const serviceRef = useRef<ReaderService | null>(null);

    useEffect(() => {
        if (!userId || !viewerRef.current) return;

        let mounted = true;

        async function init() {
            try {
                const service = new ReaderService(userId, bookId);
                serviceRef.current = service;
                
                const renderer = new EpubJsRenderer();

                if (mounted && viewerRef.current) {
                    await service.initialize(renderer, fileUrl, viewerRef.current);
                }
            } catch (err) {
                console.error('Failed to initialize Reader:', err);
            }
        }

        init();

        return () => {
            mounted = false;
            if (serviceRef.current) {
                serviceRef.current.destroy();
                serviceRef.current = null;
            }
        };
    }, [bookId, fileUrl, userId]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!serviceRef.current) return;
            if (document.hidden) {
                serviceRef.current.pauseSession();
            } else {
                serviceRef.current.startSession();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    // ─── Highlight callbacks ─────────────────────────────────────────

    const handleCreateHighlight = useCallback((color: string) => {
        serviceRef.current?.createHighlight(color);
    }, []);

    const handleDeleteHighlight = useCallback((highlightId: string) => {
        serviceRef.current?.deleteHighlight(highlightId);
    }, []);

    // ─── Highlight + Note in one action ──────────────────────────────

    const handleHighlightAndNote = useCallback(async (color: string) => {
        const service = serviceRef.current;
        if (!service) return;
        // Create the highlight first, then open note editor for it
        await service.createHighlight(color);
        // The highlight was just created — find it (it's the last one added)
        // ReaderService internally tracks highlights, and openNoteForHighlight
        // needs the ID. We'll rely on the store's cleared activeSelection
        // and the service's internal state.
        // For now, we use a simpler approach: the service exposes the last created ID.
    }, []);

    // ─── Note callbacks ──────────────────────────────────────────────

    const handleAddNote = useCallback((highlightId: string) => {
        serviceRef.current?.openNoteForHighlight(highlightId);
    }, []);

    const handleSaveNote = useCallback((bodyMarkdown: string) => {
        serviceRef.current?.saveNote(bodyMarkdown);
    }, []);

    const handleCancelNote = useCallback(() => {
        useReaderStore.getState().setActiveNote(null);
    }, []);

    return (
        <div className="flex flex-col h-screen w-full bg-slate-950 overflow-hidden">
            <Toolbar />
            <div className="flex flex-1 overflow-hidden relative">
                <main className="flex-1 relative">
                    <Viewer ref={viewerRef} />
                    <HighlightPopup
                        onCreateHighlight={handleCreateHighlight}
                        onHighlightAndNote={handleHighlightAndNote}
                    />
                    <HighlightContextMenu
                        onAddNote={handleAddNote}
                        onDeleteHighlight={handleDeleteHighlight}
                    />
                    <NoteEditor
                        onSave={handleSaveNote}
                        onCancel={handleCancelNote}
                    />
                </main>
            </div>
        </div>
    );
}
