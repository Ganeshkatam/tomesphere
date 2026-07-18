'use client';

import { Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getTopReaders } from '@/modules/community/actions/community';

export default function TopReaders() {
    const [readers, setReaders] = useState<any[]>([]);
    
    useEffect(() => {
        const fetchReaders = async () => {
            const res = await getTopReaders();
            if (res.success && res.data) {
                setReaders(res.data);
            }
        };
        fetchReaders();
    }, []);

    return (
        <div className="glass-strong rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">🏆 Top Readers This Month</h3>
            </div>

            {readers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <Users size={28} className="text-slate-500" />
                    </div>
                    <p className="text-slate-400 text-sm mb-1">Leaderboard coming soon</p>
                    <p className="text-slate-500 text-xs">Start reading to climb the ranks!</p>
                </div>
            ) : (
                <>
                    <div className="flex flex-col gap-4">
                        {readers.map((reader) => (
                            <div key={reader.rank} className="flex items-center gap-4 group">
                                <div className="relative">
                                    <img src={reader.avatar} alt={reader.name} className="w-12 h-12 rounded-full border-2 border-white/10 group-hover:border-indigo-400 transition-colors" />
                                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                                        #{reader.rank}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-white font-medium group-hover:text-indigo-300 transition-colors">{reader.name}</p>
                                    <p className="text-xs text-slate-400">{reader.books} books • {(reader.pages / 1000).toFixed(1)}k pages</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition-colors border border-white/5">
                        View Full Leaderboard
                    </button>
                </>
            )}
        </div>
    );
}
