'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Library } from 'lucide-react';
import type { Book } from '@/modules/shared/core/database/client';

interface CollectionsScreenProps {
    likedBooks: Book[];
}

export default function CollectionsScreen({ likedBooks }: CollectionsScreenProps) {
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div>
                <h2 className="text-2xl font-bold text-slate-50">My Collections</h2>
                <p className="text-sm text-slate-400 mt-1">Your curated shelves and book collections.</p>
            </div>

            {/* Grid of collections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Favorites Collection Card */}
                <div className="p-6 rounded-2xl bg-[var(--surface-default)] border border-[var(--border-default)] shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-500">
                                <Heart size={20} className="fill-pink-500/20" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-50">Favorites</h3>
                                <p className="text-xs text-slate-400 font-semibold">{likedBooks.length} books liked</p>
                            </div>
                        </div>

                        {/* Snippet of books */}
                        <div className="space-y-2.5 mt-4">
                            {likedBooks.slice(0, 3).map(book => (
                                <div key={book.id} className="flex items-center gap-3 p-2 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)]">
                                    <img
                                        src={book.cover_url || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=100'}
                                        alt={book.title}
                                        className="w-8 h-10 object-cover rounded shadow-sm"
                                    />
                                    <div className="min-w-0">
                                        <h4 className="text-xs font-bold text-slate-50 truncate">{book.title}</h4>
                                        <p className="text-[10px] text-slate-400 font-semibold truncate">{book.author}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Link 
                        href="/me/reading?status=all"
                        className="mt-6 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors text-right"
                    >
                        View all books →
                    </Link>
                </div>

                {/* Custom Shelves Placeholder Card */}
                <div className="p-6 rounded-2xl bg-[var(--surface-default)] border border-[var(--border-default)] border-dashed shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-default)] flex items-center justify-center text-slate-400 mb-3">
                        <Library size={24} />
                    </div>
                    <h3 className="text-base font-bold text-slate-50">Create Custom Shelf</h3>
                    <p className="text-xs text-slate-400 max-w-[200px] mt-1 font-medium">Group books by topic, course curriculum, or reading clubs.</p>
                    <button className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md">
                        New Shelf
                    </button>
                </div>
            </div>
        </div>
    );
}
