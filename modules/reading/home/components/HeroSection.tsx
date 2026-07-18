'use client';

import React from 'react';
import { FadeIn, SlideUp } from '@/modules/shared/ui/animations';
import VoiceInput from '@/modules/reading/search/components/VoiceInput';

interface HeroSectionProps {
    user: any;
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    handleSearch: () => void;
    isSearching: boolean;
    selectedGenres: string[];
    setSelectedGenres: (genres: string[]) => void;
}

export default function HeroSection({
    user,
    searchQuery,
    setSearchQuery,
    setSearchTerm,
    handleSearch,
    isSearching,
    selectedGenres,
    setSelectedGenres
}: HeroSectionProps) {
    return (
        <section className="relative py-20 sm:py-24 lg:py-32 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[2000px] pointer-events-none">
                <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute top-40 right-10 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] mix-blend-screen animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
            </div>

            <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <FadeIn className="text-center" delay={0.2}>
                    {/* Welcome badge with user info */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6 hover:bg-white/10 transition-colors cursor-default">
                        <span className="flex h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
                        <span className="text-sm font-medium text-slate-300">
                            {user ? `Welcome back, ${user.email?.split('@')[0]}!` : 'Discover Your Next Read'}
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold mb-6 leading-[1.1] tracking-tight">
                        <span className="text-balance text-white drop-shadow-sm">Find Books That</span>
                        <br />
                        <span className="bg-gradient-to-r from-indigo-400 via-pink-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
                            Inspire You
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl mb-10 text-balance max-w-2xl mx-auto leading-relaxed text-slate-400">
                        {user ? 'Explore personalized recommendations and discover your next favorite book' : 'Your personalized reading journey awaits'}
                    </p>

                    {/* Central Search Bar */}
                    <SlideUp className="w-full max-w-4xl mx-auto mb-12" delay={0.4}>
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl opacity-25 group-hover:opacity-50 blur transition duration-1000 group-hover:duration-200" />

                            <div className="relative flex flex-col md:flex-row gap-4 p-3 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-2xl">
                                <div className="relative flex-1 group/input">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                        <span className="text-2xl opacity-50 text-slate-400 group-focus-within/input:text-indigo-400 transition-colors">🔍</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setSearchTerm(e.target.value);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleSearch();
                                        }}
                                        placeholder="Search titles, authors, or topics..."
                                        className="w-full bg-transparent border-none py-4 pl-14 pr-12 text-white placeholder:text-slate-400 focus:outline-none focus:ring-0 text-lg rounded-xl transition-all"
                                    />
                                    <div className="absolute inset-y-0 right-4 flex items-center">
                                        <VoiceInput onTranscript={(text) => {
                                            setSearchQuery(prev => prev ? prev + ' ' + text : text);
                                            setSearchTerm(prev => prev ? prev + ' ' + text : text);
                                        }} />
                                    </div>
                                </div>

                                <div className="hidden md:block w-px bg-white/10 my-2" />

                                <div className="relative flex-shrink-0 min-w-[200px]">
                                    <select
                                        value=""
                                        onChange={(e) => {
                                            const genre = e.target.value;
                                            if (genre && !selectedGenres.includes(genre)) {
                                                setSelectedGenres([...selectedGenres, genre]);
                                            }
                                        }}
                                        className="w-full h-full bg-transparent border-none py-4 px-4 pr-10 text-slate-300 focus:outline-none focus:ring-0 text-base font-medium appearance-none cursor-pointer"
                                    >
                                        <option value="" className="bg-slate-900">All Genres</option>
                                        <optgroup label="📚 Popular" className="bg-slate-900">
                                            <option value="Fiction" className="bg-slate-900">Fiction</option>
                                            <option value="Non-Fiction" className="bg-slate-900">Non-Fiction</option>
                                            <option value="Romance" className="bg-slate-900">Romance</option>
                                            <option value="Mystery" className="bg-slate-900">Mystery</option>
                                            <option value="Fantasy" className="bg-slate-900">Fantasy</option>
                                        </optgroup>
                                        <optgroup label="🎓 Academic" className="bg-slate-900">
                                            <option value="Computer Science" className="bg-slate-900">Computer Science</option>
                                            <option value="Mathematics" className="bg-slate-900">Mathematics</option>
                                            <option value="Science" className="bg-slate-900">Science</option>
                                        </optgroup>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSearch}
                                    disabled={isSearching}
                                    className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform active:scale-95 flex items-center justify-center gap-2"
                                >
                                    {isSearching ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            Search
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Selected Genres Tags */}
                        {selectedGenres.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2 mt-4 px-2">
                                <span className="text-sm text-slate-400 font-medium">Filtering by:</span>
                                {selectedGenres.map(genre => (
                                    <span key={genre} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                        {genre}
                                        <button
                                            onClick={() => setSelectedGenres(selectedGenres.filter(g => g !== genre))}
                                            className="hover:text-white hover:bg-indigo-500/20 rounded-full p-0.5 transition-colors"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </span>
                                ))}
                                <button
                                    onClick={() => setSelectedGenres([])}
                                    className="text-xs text-slate-400 hover:text-white transition-colors underline decoration-slate-400/50 underline-offset-4 ml-2"
                                >
                                    Clear all
                                </button>
                            </div>
                        )}
                    </SlideUp>
                </FadeIn>
            </div>
        </section>
    );
}
