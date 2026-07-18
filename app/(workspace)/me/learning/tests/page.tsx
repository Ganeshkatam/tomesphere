'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BrainCircuit } from 'lucide-react';

export default function TestsPlaceholderPage() {
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
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto mb-4">
                    <BrainCircuit size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-50">Practice Tests</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed font-medium">
                    Test prep capability is coming soon. Review material, generate custom mock quizzes, and evaluate your knowledge based on read textbooks.
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
