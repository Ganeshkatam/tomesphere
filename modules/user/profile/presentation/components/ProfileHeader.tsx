'use client';

import { Camera, Crown, User, Edit2, Lock, Users } from 'lucide-react';

interface ProfileHeaderProps {
    formData: any;
    profile: any;
    user: any;
    stats: any;
    activeTab: 'overview' | 'edit' | 'activity' | 'security' | 'network';
    setActiveTab: (tab: 'overview' | 'edit' | 'activity' | 'security' | 'network') => void;
}

export default function ProfileHeader({
    formData,
    profile,
    user,
    stats,
    activeTab,
    setActiveTab
}: ProfileHeaderProps) {
    return (
        <div className="relative overflow-hidden rounded-3xl border border-[var(--border-default)] mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

            <div className="relative glass-strong p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-1">
                            <div className="w-full h-full rounded-full bg-[var(--surface-default)] flex items-center justify-center overflow-hidden">
                                {formData.avatar_url ? (
                                    <img src={formData.avatar_url} alt={formData.name} className="w-full h-full object-cover" />
                                ) : (
                                    <User size={64} className="text-slate-50" />
                                )}
                            </div>
                        </div>
                        <button className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full shadow-lg hover:bg-indigo-700 transition-colors">
                            <Camera size={18} className="text-white" />
                        </button>
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                            <Crown size={14} />
                            Lv {stats.level}
                        </div>
                    </div>

                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-slate-50 mb-2">{formData.name}</h1>

                    </div>

                    <button
                        onClick={() => setActiveTab(activeTab === 'edit' ? 'overview' : 'edit')}
                        className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg flex items-center gap-2"
                    >
                        <Edit2 size={18} />
                        {activeTab === 'edit' ? 'Cancel' : 'Edit Profile'}
                    </button>
                    <button
                        onClick={() => setActiveTab(activeTab === 'security' ? 'overview' : 'security')}
                        className={`px-6 py-2 border rounded-lg transition-all ml-2 flex items-center gap-2 ${activeTab === 'security' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' : 'bg-[var(--surface-default)]/60 border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--surface-overlay)] hover:text-[var(--text-primary)]'}`}
                    >
                        <Lock size={18} />
                        Security
                    </button>
                    <button
                        onClick={() => setActiveTab(activeTab === 'network' ? 'overview' : 'network')}
                        className={`px-6 py-2 border rounded-lg transition-all ml-2 flex items-center gap-2 ${activeTab === 'network' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' : 'bg-[var(--surface-default)]/60 border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--surface-overlay)] hover:text-[var(--text-primary)]'}`}
                    >
                        <Users size={18} />
                        Network
                    </button>
                </div>
            </div>
        </div>
    );
}
