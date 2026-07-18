'use client';

import React, { useState } from 'react';
import { supabase } from '@/modules/shared/core/database/client';
import { Bell, Check, Trash2, MailOpen } from 'lucide-react';
import { showSuccess, showError } from '@/lib/toast';

interface Notification {
    id: string;
    title: string;
    content: string;
    read: boolean;
    created_at: string;
}

interface InboxScreenProps {
    initialNotifications: Notification[];
    user: any;
}

export default function InboxScreen({ initialNotifications, user }: InboxScreenProps) {
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

    const markAsRead = async (id: string) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ read: true })
                .eq('id', id);

            if (error) throw error;

            setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
            showSuccess('Notification marked as read');
        } catch (err) {
            showError('Failed to mark notification as read');
        }
    };

    const markAllRead = async () => {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ read: true })
                .eq('user_id', user.id);

            if (error) throw error;

            setNotifications(notifications.map(n => ({ ...n, read: true })));
            showSuccess('All notifications marked as read');
        } catch (err) {
            showError('Failed to mark all as read');
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setNotifications(notifications.filter(n => n.id !== id));
            showSuccess('Notification deleted');
        } catch (err) {
            showError('Failed to delete notification');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-50">Inbox Updates</h2>
                    <p className="text-sm text-slate-400 mt-1">Milestones, alerts, and system notifications.</p>
                </div>
                {notifications.some(n => !n.read) && (
                    <button
                        onClick={markAllRead}
                        className="px-4 py-2 bg-[var(--surface-default)] hover:bg-[var(--surface-overlay)] text-xs font-bold text-slate-350 border border-[var(--border-default)] rounded-xl transition-all flex items-center gap-2 self-start sm:self-auto"
                    >
                        <MailOpen size={14} />
                        <span>Mark all as read</span>
                    </button>
                )}
            </div>

            {/* List of items */}
            <div className="space-y-3">
                {notifications.length > 0 ? (
                    notifications.map(n => (
                        <div 
                            key={n.id}
                            className={`p-4 rounded-xl border flex items-start gap-4 transition-all ${
                                n.read
                                ? 'bg-[var(--surface-default)]/60 border-[var(--border-default)]'
                                : 'bg-[var(--surface-default)] border-indigo-500/25 shadow-sm'
                            }`}
                        >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                n.read 
                                ? 'bg-slate-500/10 text-slate-400' 
                                : 'bg-indigo-600/10 text-indigo-400'
                            }`}>
                                <Bell size={16} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-3">
                                    <h4 className={`text-sm font-bold truncate ${n.read ? 'text-slate-300' : 'text-slate-50'}`}>
                                        {n.title}
                                    </h4>
                                    <span className="text-[10px] text-slate-500 font-semibold whitespace-nowrap">
                                        {new Date(n.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1 leading-relaxed font-medium">
                                    {n.content}
                                </p>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                                {!n.read && (
                                    <button 
                                        onClick={() => markAsRead(n.id)}
                                        className="p-1.5 rounded-lg hover:bg-[var(--surface-overlay)] text-emerald-450 hover:text-emerald-400 transition-colors"
                                        title="Mark as read"
                                    >
                                        <Check size={14} />
                                    </button>
                                )}
                                <button 
                                    onClick={() => deleteNotification(n.id)}
                                    className="p-1.5 rounded-lg hover:bg-[var(--surface-overlay)] text-slate-450 hover:text-red-400 transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 rounded-xl border border-dashed border-[var(--border-default)] text-slate-400">
                        No notifications in your inbox.
                    </div>
                )}
            </div>
        </div>
    );
}
