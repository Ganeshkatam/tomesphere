'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, FileText, Tag, Download, Target } from 'lucide-react';
import VoiceInput from '@/modules/reading/search/components/VoiceInput';
import type { Note } from '@/modules/learning/notes/actions/notes';

interface NotesClientProps {
    initialNotes: Note[];
}

export default function NotesClient({ initialNotes, isNested = false }: NotesClientProps & { isNested?: boolean }) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredNotes = initialNotes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className={isNested ? "space-y-6" : "min-h-screen bg-transparent py-12 px-4"}>
            <div className={isNested ? "" : "max-w-7xl mx-auto"}>
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.push(isNested ? '/me/learning' : '/home')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 text-xs font-bold"
                    >
                        <ArrowLeft size={14} />
                        {isNested ? 'Back to Learning Hub' : 'Back to Home'}
                    </button>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                                <FileText size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-50">Smart Notes</h1>
                                <p className="text-xs text-slate-400 font-medium">Your personal study companion</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => router.push(isNested ? '/me/progress' : '/analytics')}
                                className="px-4 py-2.5 bg-[var(--surface-default)] hover:bg-[var(--surface-overlay)] text-slate-350 border border-[var(--border-default)] rounded-xl transition-all flex items-center gap-2 text-xs font-bold"
                            >
                                <Target size={16} />
                                Analytics
                            </button>
                            <button
                                onClick={() => router.push('/notes/create')}
                                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all flex items-center gap-2 text-xs font-bold shadow-md"
                            >
                                <Plus size={16} />
                                New Note
                            </button>
                        </div>
                    </div>
                </div>

                    {/* Search Bar */}
                    <div className="mb-6 flex gap-2 relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search notes by title, content, or tags..."
                            className="flex-1 px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                            <VoiceInput onTranscript={setSearchTerm} />
                        </div>
                    </div>

                    {/* Notes Grid */}
                    {filteredNotes.length === 0 ? (
                        <div className="text-center py-20 glass-strong rounded-2xl">
                            <div className="text-6xl mb-4">📝</div>
                            <h3 className="text-2xl font-bold text-white mb-2">No notes yet</h3>
                            <p className="text-slate-400 mb-6">
                                {searchTerm ? 'No notes match your search' : 'Create your first note to get started'}
                            </p>
                            {!searchTerm && (
                                <button
                                    onClick={() => router.push('/notes/create')}
                                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all"
                                >
                                    Create Note
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredNotes.map(note => (
                                <div
                                    key={note.id}
                                    onClick={() => router.push(`/notes/${note.id}`)}
                                    className="glass-strong rounded-2xl p-6 hover:border-purple-500/30 transition-all cursor-pointer border border-white/10"
                                >
                                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
                                        {note.title}
                                    </h3>
                                    <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                                        {note.content?.replace(/<[^>]*>/g, '') || 'No content'}
                                    </p>

                                    {/* Tags */}
                                    {note.tags && note.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {note.tags.slice(0, 3).map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-lg"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                            {note.tags.length > 3 && (
                                                <span className="px-2 py-1 text-slate-500 text-xs">
                                                    +{note.tags.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    <div className="text-xs text-slate-500">
                                        Updated {new Date(note.updated_at).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}



                {/* Info Banner */}
                <div className="mt-12 glass-strong rounded-2xl p-6 border-l-4 border-purple-500">
                    <div className="flex items-start gap-4">
                        <div className="text-3xl">💡</div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-2">Features</h3>
                            <ul className="text-slate-400 text-sm space-y-1">
                                <li>✓ Cloud-synced across devices</li>
                                <li>✓ Rich text editing with formatting</li>
                                <li>✓ Organize with tags</li>
                                <li>✓ Export as PDF or Word</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
