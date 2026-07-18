'use client';

import { useState, useEffect } from 'react';
import { getRecentActivity } from '@/modules/community/actions/community';
import type { ActivityItem } from '@/modules/community/actions/community';
import { Clock, BookOpen, Users, Star } from 'lucide-react';

export default function ActivityFeed() {
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const res = await getRecentActivity();
            if (res.success && res.data) {
                setActivities(res.data);
            }
            setLoading(false);
        };
        load();
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case 'review': return <Star size={14} className="text-amber-400" />;
            case 'started': return <BookOpen size={14} className="text-green-400" />;
            case 'joined': return <Users size={14} className="text-blue-400" />;
            default: return <Clock size={14} className="text-slate-400" />;
        }
    };

    const getLabel = (item: ActivityItem) => {
        switch (item.type) {
            case 'review': return `reviewed "${item.book || 'a book'}"`;
            case 'started': return `started reading "${item.book || 'a book'}"`;
            case 'joined': return `joined ${item.group || 'a group'}`;
            default: return 'was active';
        }
    };

    if (loading) {
        return (
            <div className="glass-strong rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-12 bg-white/5 rounded-lg animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="glass-strong rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
            {activities.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No recent activity</p>
            ) : (
                <div className="space-y-3">
                    {activities.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 py-2">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                                {getIcon(item.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-slate-300 truncate">
                                    <span className="font-medium text-white">{item.user || 'Someone'}</span>
                                    {' '}{getLabel(item)}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {item.time}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
