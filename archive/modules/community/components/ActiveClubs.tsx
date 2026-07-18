'use client';

import { BookOpen, Users, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getBookClubs } from '@/modules/community/actions/community';

export default function ActiveClubs() {
    const [clubs, setClubs] = useState<any[]>([]);

    useEffect(() => {
        const fetchClubs = async () => {
            const res = await getBookClubs();
            if (res.success && res.data) {
                setClubs(res.data);
            }
        };
        fetchClubs();
    }, []);

    // Assign colors based on index for variety
    const colors = ['bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-blue-500', 'bg-teal-500'];

    return (
        <div className="glass-strong rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">👥 Active Book Clubs</h3>
                <a href="/community" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                    View All →
                </a>
            </div>

            {clubs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <BookOpen size={28} className="text-slate-500" />
                    </div>
                    <p className="text-slate-400 text-sm mb-1">No active clubs yet</p>
                    <p className="text-slate-500 text-xs">Join the community to find book clubs</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {clubs.slice(0, 3).map((club, i) => (
                        <div key={club.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg ${colors[i % colors.length]} flex items-center justify-center font-bold text-white shadow-lg`}>
                                    {club.name.substring(0, 1)}
                                </div>
                                <div>
                                    <p className="text-white font-medium text-sm group-hover:text-indigo-300 transition-colors">{club.name}</p>
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <span className="flex items-center gap-1"><Users size={12} /> {club.member_count}</span>
                                        <span>•</span>
                                        <span>{club.is_private ? 'Private' : 'Public'}</span>
                                    </div>
                                </div>
                            </div>
                            <ChevronRight size={16} className="text-slate-500 group-hover:text-white transition-colors" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
