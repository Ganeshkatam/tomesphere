'use client';

import { useState, useEffect } from 'react';
import ActivityFeed from './ActivityFeed';
import TrendingReviews from './TrendingReviews';
import ActiveClubs from './ActiveClubs';
import TopReaders from './TopReaders';

interface SocialShowcaseProps {
    initialStats?: {
        readers: number;
        books: number;
        studyGroups: number;
        satisfaction: number;
    };
    activeChallenge?: {
        title: string;
        description: string;
        icon: string;
        target: number;
        unit: string;
    } | null;
}

export default function SocialShowcase({ initialStats, activeChallenge }: SocialShowcaseProps) {
    const formatCount = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K+` : `${n}`;

    const [stats] = useState({
        readers: formatCount(initialStats?.readers ?? 0),
        reviews: formatCount(initialStats?.books ?? 0),
        clubs: `${initialStats?.studyGroups ?? 0}`,
        satisfaction: `${initialStats?.satisfaction ?? 100}%`
    });

    return (
        <section className="py-12 sm:py-16 relative">
            <div className="w-full max-w-[2000px] mx-auto px-2 sm:px-4 lg:px-6">
                {/* Section Header */}
                <div className="text-center mb-10">
                    <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6">
                        <span className="text-white">Join the </span>
                        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Reading Community
                        </span>
                    </h2>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Connect with thousands of passionate readers. Share reviews, join clubs, and discover your next favorite book together.
                    </p>
                </div>

                {/* Stats Banner */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    <div className="glass-strong rounded-xl p-4 border border-white/10 text-center">
                        <div className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            {stats.readers}
                        </div>
                        <div className="text-sm text-slate-400">Active Readers</div>
                    </div>
                    <div className="glass-strong rounded-xl p-4 border border-white/10 text-center">
                        <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                            {stats.reviews}
                        </div>
                        <div className="text-sm text-slate-400">Books Available</div>
                    </div>
                    <div className="glass-strong rounded-xl p-4 border border-white/10 text-center">
                        <div className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                            {stats.clubs}
                        </div>
                        <div className="text-sm text-slate-400">Study Groups</div>
                    </div>
                    <div className="glass-strong rounded-xl p-4 border border-white/10 text-center">
                        <div className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                            {stats.satisfaction}
                        </div>
                        <div className="text-sm text-slate-400">User Satisfaction</div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Left Column - Activity Feed & Top Readers */}
                    <div className="space-y-6">
                        <ActivityFeed />
                        <TopReaders />
                    </div>

                    {/* Middle & Right Columns - Reviews & Clubs */}
                    <div className="lg:col-span-2 space-y-6">
                        <TrendingReviews />
                        <ActiveClubs />
                    </div>
                </div>

                {/* Reading Challenge Banner */}
                <div className="glass-strong rounded-2xl p-8 border-2 border-indigo-500/30 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-4xl">{activeChallenge?.icon || "🎯"}</span>
                                <h3 className="text-2xl font-bold text-white">{activeChallenge?.title || `${new Date().getFullYear()} Reading Challenge`}</h3>
                            </div>
                            <p className="text-slate-300 mb-4">
                                {activeChallenge?.description ? (
                                    <>
                                        {activeChallenge.description}
                                        {(initialStats?.readers ?? 0) > 0 && ` Join ${formatCount(initialStats!.readers)} readers already participating!`}
                                    </>
                                ) : (
                                    (initialStats?.readers ?? 0) > 0 ? (
                                        <>Join <span className="text-indigo-400 font-semibold">{formatCount(initialStats!.readers)} readers</span> committed to reading more this year!</>
                                    ) : (
                                        <>Be the first to join the community in reading more this year!</>
                                    )
                                )}
                            </p>
                        </div>
                        <div className="flex-shrink-0">
                            <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all hover:scale-105 shadow-lg shadow-indigo-500/50">
                                Join the Challenge →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
