'use client';

import { BookOpen, Sparkles, Flame, Clock, Trophy, TrendingUp } from 'lucide-react';

interface ProfileStatsProps {
    stats: any;
}

export default function ProfileStats({ stats }: ProfileStatsProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6 pt-6 border-t border-[var(--border-default)]">
            <StatBox icon={BookOpen} label="Books Read" value={stats.booksRead} color="from-blue-600 to-cyan-600" />
            <StatBox icon={Sparkles} label="Pages" value={stats.pagesRead.toLocaleString()} color="from-purple-600 to-pink-600" />
            <StatBox icon={Flame} label="Day Streak" value={stats.readingStreak} color="from-orange-600 to-red-600" />
            <StatBox icon={Clock} label="Total Hours" value={stats.totalHours} color="from-green-600 to-emerald-600" />
            <StatBox icon={Trophy} label="Achievements" value={stats.achievements} color="from-yellow-600 to-orange-600" />
            <StatBox icon={TrendingUp} label="Level" value={stats.level} color="from-indigo-600 to-purple-600" />
        </div>
    );
}

function StatBox({ icon: Icon, label, value, color }: any) {
    return (
        <div className="text-center">
            <div className={`w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br ${color} p-0.5 mb-3 shadow-lg`}>
                <div className="w-full h-full bg-[var(--surface-default)] rounded-2xl flex items-center justify-center">
                    <Icon className="text-slate-50" size={20} />
                </div>
            </div>
            <div className="text-2xl font-bold text-slate-50 mb-1">{value}</div>
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">{label}</div>
        </div>
    );
}
