'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { joinStudyGroup } from '@/modules/community/actions/community';
import { showError, showSuccess } from '@/lib/toast';
import { ArrowLeft, Plus, Users, Lock } from 'lucide-react';

interface StudyGroup {
    id: string;
    name: string;
    description: string | null;
    subject: string | null;
    is_private: boolean | null;
    member_count?: number;
}

interface StudyGroupsClientProps {
    initialGroups: StudyGroup[];
}

export default function StudyGroupsClient({ initialGroups }: StudyGroupsClientProps) {
    const router = useRouter();
    const [selectedSubject, setSelectedSubject] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const subjects = ['All', 'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Engineering', 'Business', 'Literature'];

    const filteredGroups = useMemo(() => {
        let filtered = initialGroups;

        // Subject filter
        if (selectedSubject !== 'All') {
            filtered = filtered.filter(g => g.subject === selectedSubject);
        }

        // Search filter
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            filtered = filtered.filter(group =>
                group.name.toLowerCase().includes(lower) ||
                group.description?.toLowerCase().includes(lower)
            );
        }

        return filtered;
    }, [initialGroups, selectedSubject, searchTerm]);

    const handleJoinGroup = async (groupId: string) => {
        try {
            const res = await joinStudyGroup(groupId);

            if (!res.success) {
                if (res.error === 'Not authenticated') {
                    router.push('/login');
                } else {
                    throw new Error(res.error);
                }
                return;
            }

            showSuccess('Joined group!');
            router.push(`/study-groups/${groupId}`);
        } catch (error: any) {
            showError('Failed to join group');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-page py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/home')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft size={20} />
                        Back to Home
                    </button>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                                <Users size={32} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-1">Study Groups</h1>
                                <p className="text-slate-400">Join collaborative learning communities</p>
                            </div>
                        </div>

                        <button
                            onClick={() => router.push('/study-groups/create')}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Create Group
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search groups..."
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50"
                    />
                </div>

                {/* Subject Filter */}
                <div className="mb-8">
                    <div className="flex flex-wrap gap-2">
                        {subjects.map(subject => (
                            <button
                                key={subject}
                                onClick={() => setSelectedSubject(subject)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedSubject === subject
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                                    }`}
                            >
                                {subject}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Groups Grid */}
                {filteredGroups.length === 0 ? (
                    <div className="text-center py-20 glass-strong rounded-2xl">
                        <div className="text-6xl mb-4">👥</div>
                        <h3 className="text-2xl font-bold text-white mb-2">No groups found</h3>
                        <p className="text-slate-400 mb-6">
                            {searchTerm ? 'Try a different search' : 'Be the first to create a study group!'}
                        </p>
                        <button
                            onClick={() => router.push('/study-groups/create')}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all"
                        >
                            Create Group
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredGroups.map(group => (
                            <div
                                key={group.id}
                                className="glass-strong rounded-2xl p-6 hover:border-blue-500/30 transition-all border border-white/10"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <span className="px-3 py-1 bg-blue-600/20 text-blue-300 text-sm rounded-lg">
                                        {group.subject}
                                    </span>
                                    {group.is_private && (
                                        <Lock size={16} className="text-slate-400" />
                                    )}
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
                                    {group.name}
                                </h3>
                                <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                                    {group.description || 'No description'}
                                </p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-slate-400">
                                        <Users size={16} />
                                        <span>{group.member_count || 0} members</span>
                                    </div>
                                    <button
                                        onClick={() => handleJoinGroup(group.id)}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all text-sm font-medium"
                                    >
                                        Join
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
