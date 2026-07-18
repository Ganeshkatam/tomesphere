'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Toolbar } from './toolbar/Toolbar';
import { Viewer } from './viewer/Viewer';
import { EpubJsRenderer } from '@/modules/reading/reader/services/parser/epub/EpubJsRenderer';
import { ReaderService } from '@/modules/reading/reader/application/ReaderService';
import { HighlightPopup } from './HighlightPopup';

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

    const handleCreateHighlight = useCallback((color: string) => {
        serviceRef.current?.createHighlight(color);
    }, []);

    return (
        <div className="flex flex-col h-screen w-full bg-slate-950 overflow-hidden">
            <Toolbar />
            <div className="flex flex-1 overflow-hidden relative">
                <main className="flex-1 relative">
                    <Viewer ref={viewerRef} />
                    <HighlightPopup onCreateHighlight={handleCreateHighlight} />
                </main>
            </div>
        </div>
    );
}

