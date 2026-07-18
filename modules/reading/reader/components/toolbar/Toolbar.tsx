'use client';

import { useReaderStore } from '@/modules/reading/reader/state/reader-store';
import { ChevronLeft, Menu, Settings, Bookmark } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Toolbar() {
    const router = useRouter();
    const { sessionState, rendererReady, isReading } = useReaderStore();

    return (
        <div className="h-14 bg-slate-900 border-b border-white/10 flex items-center justify-between px-4 sticky top-0 z-50">
            {/* Left Section */}
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => router.back()}
                    className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
                    title="Back to Library"
                >
                    <ChevronLeft size={20} />
                </button>
                <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
                    <Menu size={20} />
                </button>
            </div>

            {/* Center Section: Status */}
            <div className="flex items-center gap-4">
                <div className="text-sm font-medium text-slate-300">
                    {!rendererReady ? (
                        <span className="text-slate-500">Loading...</span>
                    ) : (
                        <span className="text-slate-300">
                            {isReading ? 'Reading' : sessionState === 'paused' ? 'Paused' : 'Ready'}
                        </span>
                    )}
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
                    <Bookmark size={20} />
                </button>
                <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
                    <Settings size={20} />
                </button>
            </div>
        </div>
    );
}
