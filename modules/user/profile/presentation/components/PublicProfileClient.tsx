'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toggleFollow } from '@/modules/user/profile/actions/profile';
import Navbar from '@/modules/shared/navigation/components/Navbar';
import { showError, showSuccess } from '@/lib/toast';
import {
    BookOpen, Star, TrendingUp, Zap, Trophy, Flame, Crown, Sparkles, MessageSquare, Globe,
    Link2, AtSign, Briefcase, Mail, Calendar, UserPlus, UserMinus, User, ArrowLeft, Clock, Users
} from 'lucide-react';

interface PublicProfileClientProps {
    id: string;
    currentUser: any | null;
    initialProfileData: any;
    initialFollowersCount: number;
    initialFollowingCount: number;
    initialIsFollowing: boolean;
    initialBooksReadCount: number;
}

export default function PublicProfileClient({ 
    id,
    currentUser,
    initialProfileData,
    initialFollowersCount,
    initialFollowingCount,
    initialIsFollowing,
    initialBooksReadCount
}: PublicProfileClientProps) {
    const router = useRouter();
    const profile = initialProfileData;
    
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [followersCount, setFollowersCount] = useState(initialFollowersCount);
    const [followingCount, setFollowingCount] = useState(initialFollowingCount);

    const streak = profile?.streak || 0;
    const calculatedLevel = Math.floor((initialBooksReadCount / 5) + 1);

    const [stats] = useState({
        booksRead: initialBooksReadCount,
        pagesRead: 0,
        readingStreak: streak,
        totalHours: 0,
        achievements: 0,
        level: calculatedLevel
    });

    const handleFollowToggle = async () => {
        if (!currentUser) {
            router.push('/login');
            return;
        }
        try {
            const res = await toggleFollow(id);
            if (res.success) {
                if (res.data.isFollowing) {
                    setIsFollowing(true);
                    setFollowersCount(prev => prev + 1);
                    showSuccess(`Followed ${profile?.name}`);
                } else {
                    setIsFollowing(false);
                    setFollowersCount(prev => Math.max(0, prev - 1));
                    showSuccess(`Unfollowed ${profile?.name}`);
                }
            } else {
                showError(res.error);
            }
        } catch (error) {
            showError('Failed to toggle follow');
        }
    };

    const handleFollow = () => handleFollowToggle();
    const handleUnfollow = () => handleFollowToggle();

    const handleMessage = () => {
        if (!currentUser) {
            router.push('/login');
            return;
        }
        router.push(`/messages/${id}`);
    };

    if (!profile) return null;

    return (
        <div className="min-h-screen bg-transparent">

            <div className="max-w-7xl mx-auto px-4 py-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back
                </button>

                {/* Header Card */}
                <div className="relative overflow-hidden rounded-3xl border border-[var(--border-default)] mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/20 via-purple-950/20 to-pink-950/20" />
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

                    <div className="relative glass-strong p-8">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">

                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                                    <div className="w-full h-full rounded-full bg-[var(--surface-default)] overflow-hidden flex items-center justify-center">
                                        {profile.avatar_url ? (
                                            <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={64} className="text-slate-400" />
                                        )}
                                    </div>
                                </div>
                                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg border border-white/10">
                                    <Crown size={14} />
                                    Lv {stats.level}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <h1 className="text-4xl font-bold text-slate-50 mb-2">{profile.name}</h1>


                                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 mb-6">
                                    <div className="flex items-center gap-2">
                                        <Users className="text-blue-400" size={18} />
                                        <span className="text-slate-50 font-bold">{followersCount}</span> Followers
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <UserPlus className="text-green-400" size={18} />
                                        <span className="text-slate-50 font-bold">{followingCount}</span> Following
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="text-orange-400" size={18} />
                                        Joined {new Date(profile.created_at).toLocaleDateString()}
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div className="flex gap-4">

                                </div>
                            </div>

                            {/* Actions */}
                            {currentUser && currentUser.id !== id && (
                                <div className="flex flex-col gap-3 min-w-[160px]">
                                    {isFollowing ? (
                                        <button
                                            onClick={handleUnfollow}
                                            className="w-full py-3 bg-[var(--surface-default)] hover:bg-[var(--surface-overlay)] text-slate-50 rounded-xl font-bold transition-all border border-[var(--border-default)] flex items-center justify-center gap-2"
                                        >
                                            <UserMinus size={18} />
                                            Unfollow
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleFollow}
                                            className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-pink-600/20 flex items-center justify-center gap-2"
                                        >
                                            <UserPlus size={18} />
                                            Follow
                                        </button>
                                    )}
                                    <button
                                        onClick={handleMessage}
                                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
                                    >
                                        <MessageSquare size={18} />
                                        Message
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatBox icon={BookOpen} label="Books Read" value={stats.booksRead} color="from-blue-600 to-cyan-600" />
                    <StatBox icon={Sparkles} label="Pages Read" value={stats.pagesRead.toLocaleString()} color="from-purple-600 to-pink-600" />
                    <StatBox icon={Flame} label="Day Streak" value={stats.readingStreak} color="from-orange-600 to-red-600" />
                    <StatBox icon={Trophy} label="Achievements" value={stats.achievements} color="from-yellow-600 to-orange-600" />
                </div>

                {/* Recent Activity (Mock) */}
                <h3 className="text-xl font-bold text-slate-50 mb-4">Badges & Achievements</h3>
                <div className="glass-strong rounded-2xl p-6 border border-[var(--border-default)]">
                    <div className="flex flex-wrap gap-4">
                        {['🥇', '🥈', '🥉', '🏆', '⭐', '💎', '🚀', '📚'].map((badge, i) => (
                            <div key={i} className="w-16 h-16 bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-2xl flex items-center justify-center text-3xl hover:scale-110 transition-transform cursor-help" title="Badge Title">
                                {badge}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

function StatBox({ icon: Icon, label, value, color }: any) {
    return (
        <div className="glass-strong p-6 rounded-2xl border border-[var(--border-subtle)] flex flex-col items-center justify-center text-center group hover:scale-[1.02] transition-transform">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} p-2.5 mb-3 shadow-lg group-hover:rotate-6 transition-transform`}>
                <Icon className="w-full h-full text-white" />
            </div>
            <div className="text-3xl font-bold text-slate-50 mb-1">{value}</div>
            <div className="text-sm text-slate-400">{label}</div>
        </div>
    );
}
