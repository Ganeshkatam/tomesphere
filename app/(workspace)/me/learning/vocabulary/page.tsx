'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';

export default function VocabularyPlaceholderPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <Link 
                href="/me/learning"
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors"
            >
                <ArrowLeft size={14} />
                <span>Back to Learning Hub</span>
            </Link>

            <div className="py-20 p-6 rounded-2xl bg-[var(--surface-default)] border border-[var(--border-default)] border-dashed text-center max-w-lg mx-auto">
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mx-auto mb-4">
                    <BookOpen size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-50">Vocabulary lists</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed font-medium">
                    Build and track vocabulary decks derived directly from terms marked in the e-reader during your study sessions.
                </p>
                <Link 
                    href="/me/learning"
                    className="inline-block mt-6 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                >
                    Back to Learning
                </Link>
            </div>
        </div>
    );
}
