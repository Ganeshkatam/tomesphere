'use client';

import React from 'react';
import Link from 'next/link';
import { 
    FileText, 
    Link2, 
    Sparkles, 
    BookOpen, 
    GraduationCap, 
    BrainCircuit 
} from 'lucide-react';

export default function LearningHubPage() {
    const tools = [
        {
            title: 'Smart Notes',
            description: 'Write, format, organize, and search through your personal study notes.',
            icon: FileText,
            href: '/me/learning/notes',
            color: 'from-purple-500 to-pink-500',
            textColor: 'text-purple-400'
        },
        {
            title: 'Citations Generator',
            description: 'Format bibliography entries and references according to MLA, APA, or Chicago standards.',
            icon: Link2,
            href: '/me/learning/citations',
            color: 'from-green-500 to-emerald-500',
            textColor: 'text-green-400'
        },
        {
            title: 'Practice Tests',
            description: 'Challenge your comprehension with custom mock tests and exam preparation materials.',
            icon: BrainCircuit,
            href: '/me/learning/tests',
            color: 'from-indigo-500 to-blue-500',
            textColor: 'text-indigo-400',
            badge: 'Soon'
        },
        {
            title: 'Flashcards Decks',
            description: 'Train your memory with space-repetition deck reviews and key vocabulary definitions.',
            icon: Sparkles,
            href: '/me/learning/flashcards',
            color: 'from-orange-500 to-amber-500',
            textColor: 'text-orange-400',
            badge: 'Soon'
        },
        {
            title: 'Vocabulary List',
            description: 'Keep track of new terminology, phrases, and technical words from textbooks.',
            icon: BookOpen,
            href: '/me/learning/vocabulary',
            color: 'from-pink-500 to-rose-500',
            textColor: 'text-pink-400',
            badge: 'Soon'
        }
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div>
                <h2 className="text-2xl font-bold text-slate-50">Learning Space</h2>
                <p className="text-sm text-slate-400 mt-1">Access study materials, exam prep, and research tools.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tools.map((tool, idx) => {
                    const Icon = tool.icon;
                    return (
                        <div 
                            key={idx} 
                            className="p-6 rounded-2xl bg-[var(--surface-default)] border border-[var(--border-default)] hover:border-[var(--border-strong)] transition-all duration-200 shadow-sm flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center justify-between">
                                    <div className={`w-10 h-10 rounded-xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center ${tool.textColor}`}>
                                        <Icon size={20} />
                                    </div>
                                    {tool.badge && (
                                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-600/20 text-indigo-400 uppercase tracking-wider">
                                            {tool.badge}
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-base font-bold text-slate-50 mt-4">{tool.title}</h3>
                                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-medium">{tool.description}</p>
                            </div>

                            <Link 
                                href={tool.href}
                                className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                            >
                                <span>Open Tool</span>
                                <span className="text-sm">→</span>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
