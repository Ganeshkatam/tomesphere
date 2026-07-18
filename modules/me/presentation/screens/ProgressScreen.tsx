'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Target, Flame, Trophy, Award, BarChart2 } from 'lucide-react';
import type { DashboardData } from '@/modules/me/application/GetTodayOverview/actions/dashboard';

interface ProgressScreenProps {
    profileData: any;
    dashboardData: DashboardData;
}

export default function ProgressScreen({ profileData, dashboardData }: ProgressScreenProps) {
    const profile = profileData?.profile || {};
    const readingGoal = Number(profile.reading_goal) || 12;
    const booksReadCount = profileData?.booksReadCount || 0;
    const streak = Number(profile.reading_streak_days) || 0;
    const totalPoints = Number(profile.total_points) || 0;
    const level = Math.floor(totalPoints / 1000) + 1;
    const engagementScore = Number(profile.engagement_score) || 0;

    const badges = [
        { id: '1', name: 'First Milestone', desc: 'Read your first book', earned: booksReadCount >= 1 },
        { id: '2', name: 'Consistency', desc: 'Reach a 7-day streak', earned: streak >= 7 },
        { id: '3', name: 'Bookworm', desc: 'Read 5 books', earned: booksReadCount >= 5 },
        { id: '4', name: 'Scholar', desc: 'Earn 1,000 points', earned: totalPoints >= 1000 }
    ];

    // Today's entry
    const todayStr = new Date().toISOString().split('T')[0];
    const todayEntry = dashboardData.dailyStats?.find((s: any) => s.date === todayStr);

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            <div>
                <h2 className="text-2xl font-bold text-slate-50">My Progress</h2>
                <p className="text-sm text-slate-400 mt-1">Track reading accomplishments and goals.</p>
            </div>

            {/* Section 1: Goals First */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Active Goals */}
                <div className="p-6 rounded-2xl bg-[var(--surface-default)] border border-[var(--border-default)] shadow-sm space-y-6">
                    <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-indigo-400" />
                        <h3 className="text-base font-bold text-slate-50">Active Targets</h3>
                    </div>

                    <div className="space-y-5">
                        {/* Today's Goal Progress */}
                        <div>
                            <div className="flex justify-between text-sm font-bold text-slate-50">
                                <span>Today&apos;s Reading</span>
                                <span>{todayEntry?.reading_time_minutes || 0} / 30 min</span>
                            </div>
                            <div className="w-full bg-[var(--surface-raised)] rounded-full h-2 mt-2 overflow-hidden border border-[var(--border-subtle)]">
                                <div 
                                    className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min(100, ((todayEntry?.reading_time_minutes || 0) / 30) * 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* Annual Goal */}
                        <div>
                            <div className="flex justify-between text-sm font-bold text-slate-50">
                                <span>Annual Book Goal</span>
                                <span>{booksReadCount} / {readingGoal} Books</span>
                            </div>
                            <div className="w-full bg-[var(--surface-raised)] rounded-full h-2 mt-2 overflow-hidden border border-[var(--border-subtle)]">
                                <div 
                                    className="bg-pink-500 h-full rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min(100, (booksReadCount / readingGoal) * 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Streak & Level Info Card */}
                <div className="p-6 rounded-2xl bg-[var(--surface-default)] border border-[var(--border-default)] shadow-sm space-y-6">
                    <div className="flex items-center gap-2">
                        <Flame className="w-5 h-5 text-orange-500 fill-orange-500/10" />
                        <h3 className="text-base font-bold text-slate-50">Reading Consistency</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-center">
                            <Flame className="w-6 h-6 mx-auto text-orange-500 fill-orange-500/10 mb-1" />
                            <div className="text-xl font-bold text-slate-50">{streak} Days</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Current Streak</div>
                        </div>
                        <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-center">
                            <Trophy className="w-6 h-6 mx-auto text-yellow-400 fill-yellow-400/10 mb-1" />
                            <div className="text-xl font-bold text-slate-50">Level {level}</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{totalPoints} Points</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 2: Achievements & Badges */}
            <div className="p-6 rounded-2xl bg-[var(--surface-default)] border border-[var(--border-default)] shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-400" />
                    <h3 className="text-base font-bold text-slate-50">Earned Badges</h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {badges.map(badge => (
                        <div 
                            key={badge.id}
                            className={`p-4 rounded-xl border text-center transition-all ${
                                badge.earned
                                ? 'bg-indigo-600/10 border-indigo-500/35 text-slate-50'
                                : 'bg-[var(--surface-raised)]/40 border-[var(--border-default)] opacity-40'
                            }`}
                        >
                            <span className="text-3xl block mb-2">🏅</span>
                            <div className="text-xs font-bold">{badge.name}</div>
                            <div className="text-[9px] text-slate-400 mt-1 font-semibold leading-snug">{badge.desc}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Section 3: Reading Statistics Chart */}
            <div className="p-6 rounded-2xl bg-[var(--surface-default)] border border-[var(--border-default)] shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-base font-bold text-slate-50">Reading Statistics</h3>
                </div>

                {dashboardData.dailyStats && dashboardData.dailyStats.length > 0 ? (
                    <div className="h-64 w-full bg-[var(--surface-raised)] rounded-xl p-4 border border-[var(--border-subtle)]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dashboardData.dailyStats}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" vertical={false} />
                                <XAxis dataKey="date" stroke="var(--text-tertiary)" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--text-tertiary)" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: 'var(--surface-default)', border: '1px solid var(--border-default)', borderRadius: '8px', color: 'var(--text-primary)' }}
                                    itemStyle={{ color: '#818cf8', fontSize: '12px' }}
                                />
                                <Bar dataKey="pages_read" name="Pages Read" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="text-center py-12 text-slate-400 text-xs font-medium">
                        No reading statistics logged yet.
                    </div>
                )}
            </div>
        </div>
    );
}
