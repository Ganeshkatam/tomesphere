'use client';

import { UserPlus, Users, User, MessageSquare, UserMinus, Sparkles } from 'lucide-react';

interface ProfileNetworkProps {
    following: any[];
    followers: any[];
    suggestedUsers: any[];
    router: any;
    handleUnfollow: (id: string) => void;
    handleFollow: (id: string) => void;
}

export default function ProfileNetwork({
    following,
    followers,
    suggestedUsers,
    router,
    handleUnfollow,
    handleFollow
}: ProfileNetworkProps) {
    return (
        <div className="glass-strong rounded-2xl p-8 border border-[var(--border-default)] animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold text-slate-50 mb-6">Your Network</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Following */}
                <div>
                    <h3 className="text-lg font-semibold text-slate-50 mb-4 flex items-center gap-2">
                        <UserPlus className="text-green-400" size={20} />
                        Following ({following.length})
                    </h3>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {following.length > 0 ? (
                            following.map((profile: any) => (
                                <div key={profile.id} className="flex items-center justify-between p-3 bg-[var(--surface-raised)]/60 border border-[var(--border-subtle)] rounded-xl hover:bg-[var(--surface-overlay)] transition-colors">
                                    <div
                                        className="flex items-center gap-3 cursor-pointer"
                                        onClick={() => router.push(`/profile/${profile.id}`)}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-[var(--border-default)] overflow-hidden">
                                            {profile.avatar_url ? (
                                                <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-full h-full p-2 text-slate-400" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-slate-50 font-medium hover:text-pink-400 transition-colors">{profile.name}</div>
                                            <div className="text-xs text-slate-400">Lv 1 • Reader</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => router.push(`/messages/${profile.id}`)}
                                            className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"
                                        >
                                            <MessageSquare size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleUnfollow(profile.id)}
                                            className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                            title="Unfollow"
                                        >
                                            <UserMinus size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-slate-500 italic">Not following anyone yet.</div>
                        )}
                    </div>
                </div>

                {/* Followers */}
                <div>
                    <h3 className="text-lg font-semibold text-slate-50 mb-4 flex items-center gap-2">
                        <Users className="text-blue-400" size={20} />
                        Followers ({followers.length})
                    </h3>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {followers.length > 0 ? (
                            followers.map((profile: any) => (
                                <div key={profile.id} className="flex items-center justify-between p-3 bg-[var(--surface-raised)]/60 border border-[var(--border-subtle)] rounded-xl hover:bg-[var(--surface-overlay)] transition-colors">
                                    <div
                                        className="flex items-center gap-3 cursor-pointer"
                                        onClick={() => router.push(`/profile/${profile.id}`)}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-[var(--border-default)] overflow-hidden">
                                            {profile.avatar_url ? (
                                                <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-full h-full p-2 text-slate-400" />
                                            )}
                                        </div>
                                        <div className="text-slate-50 font-medium hover:text-pink-400 transition-colors">{profile.name}</div>
                                    </div>
                                    <button
                                        onClick={() => router.push(`/messages/${profile.id}`)}
                                        className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"
                                    >
                                        <MessageSquare size={16} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-slate-500 italic">No followers yet.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Suggestions */}
            {suggestedUsers.length > 0 && (
                <div className="mt-8 pt-8 border-t border-[var(--border-default)]">
                    <h3 className="text-lg font-semibold text-slate-50 mb-4 flex items-center gap-2">
                        <Sparkles className="text-yellow-400" size={20} />
                        Suggested for you
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {suggestedUsers.map((profile) => (
                            <div key={profile.id} className="flex items-center gap-4 p-4 bg-[var(--surface-raised)]/60 border border-[var(--border-subtle)] hover:border-pink-500/30 transition-all rounded-xl">
                                <div className="w-12 h-12 rounded-full bg-[var(--border-default)] overflow-hidden flex-shrink-0">
                                    {profile.avatar_url ? (
                                        <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-full h-full p-3 text-slate-400" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div
                                        className="text-slate-50 font-medium truncate cursor-pointer hover:text-pink-400"
                                        onClick={() => router.push(`/profile/${profile.id}`)}
                                    >
                                        {profile.name}
                                    </div>
                                    <button
                                        onClick={() => handleFollow(profile.id)}
                                        className="text-xs text-pink-400 hover:text-pink-300 font-bold mt-1"
                                    >
                                        + Follow
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
