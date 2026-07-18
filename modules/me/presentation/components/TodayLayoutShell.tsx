'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    Calendar, 
    BookOpen, 
    Library, 
    GraduationCap, 
    TrendingUp, 
    Inbox, 
    User, 
    Settings, 
    Shield, 
    Flame, 
    BookCheck 
} from 'lucide-react';

interface UserSummary {
    name: string;
    avatarUrl: string | null;
    memberSince: number;
    streak: number;
    booksRead: number;
    unreadCount: number;
}

interface TodayLayoutShellProps {
    userSummary: UserSummary;
    children: React.ReactNode;
}

export function TodayLayoutShell({ userSummary, children }: TodayLayoutShellProps) {
    const pathname = usePathname();

    const getInitials = (name: string) => {
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    const navigationGroups = [
        {
            title: 'TODAY',
            items: [
                { href: '/me', label: 'Today', icon: Calendar }
            ]
        },
        {
            title: 'READING',
            items: [
                { href: '/me/reading', label: 'Reading', icon: BookOpen },
                { href: '/me/collections', label: 'Collections', icon: Library }
            ]
        },
        {
            title: 'LEARNING',
            items: [
                { href: '/me/learning', label: 'Learning', icon: GraduationCap }
            ]
        },
        {
            title: 'PERSONAL',
            items: [
                { href: '/me/progress', label: 'Progress', icon: TrendingUp },
                { 
                    href: '/me/inbox', 
                    label: 'Inbox', 
                    icon: Inbox, 
                    badge: userSummary.unreadCount > 0 ? userSummary.unreadCount : undefined 
                }
            ]
        },
        {
            title: 'SETTINGS',
            items: [
                { href: '/me/profile', label: 'Profile', icon: User },
                { href: '/me/preferences', label: 'Preferences', icon: Settings },
                { href: '/me/security', label: 'Security', icon: Shield }
            ]
        }
    ];

    const isActive = (href: string) => {
        if (href === '/me') {
            return pathname === '/me';
        }
        return pathname.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Persistent User Info Header Card */}
                <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-[var(--surface-default)] border border-[var(--border-default)] shadow-[var(--shadow-sm)] flex flex-col sm:flex-row items-center justify-between gap-6 animate-in fade-in duration-300">
                    <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                        {/* Avatar */}
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 border border-[var(--border-strong)] flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shrink-0">
                            {userSummary.avatarUrl ? (
                                <img
                                    src={userSummary.avatarUrl}
                                    alt={userSummary.name}
                                    className="w-full h-full object-cover rounded-2xl"
                                />
                            ) : (
                                <span>{getInitials(userSummary.name)}</span>
                            )}
                        </div>

                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-50 tracking-tight leading-tight">
                                {userSummary.name}
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                                Reading since {userSummary.memberSince}
                            </p>
                        </div>
                    </div>

                    {/* Stats summary indicator badge list */}
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        {/* Streak Badge */}
                        <div className="flex items-center gap-2.5 px-4.5 py-2.5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border-subtle)]">
                            <Flame className="w-5 h-5 text-orange-500 fill-orange-500/20" />
                            <div className="text-left">
                                <div className="text-sm font-bold text-slate-50">{userSummary.streak} Days</div>
                                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Active Streak</div>
                            </div>
                        </div>

                        {/* Books Read Badge */}
                        <div className="flex items-center gap-2.5 px-4.5 py-2.5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border-subtle)]">
                            <BookCheck className="w-5 h-5 text-green-500" />
                            <div className="text-left">
                                <div className="text-sm font-bold text-slate-50">{userSummary.booksRead} Books</div>
                                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Completed</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Primary Content Container Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    {/* Desktop Left Sidebar Panel */}
                    <aside className="hidden lg:block lg:col-span-1 space-y-6">
                        <div className="p-5 rounded-2xl bg-[var(--surface-default)] border border-[var(--border-default)] space-y-6 sticky top-24">
                            {navigationGroups.map((group, groupIdx) => (
                                <div key={groupIdx} className="space-y-2">
                                    {/* Sidebar Section Title */}
                                    <h3 className="px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                                        {group.title}
                                    </h3>
                                    
                                    {/* Link Items */}
                                    <div className="space-y-1">
                                        {group.items.map((item, itemIdx) => {
                                            const Icon = item.icon;
                                            const active = isActive(item.href);
                                            return (
                                                <Link
                                                    key={itemIdx}
                                                    href={item.href}
                                                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold border border-transparent transition-all duration-200 group ${
                                                        active 
                                                        ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/20' 
                                                        : 'text-slate-400 hover:text-slate-200 hover:bg-[var(--surface-overlay)] hover:border-[var(--border-subtle)]'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Icon size={16} className={active ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'} />
                                                        <span>{item.label}</span>
                                                    </div>
                                                    {item.badge !== undefined && (
                                                        <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-indigo-600 text-white">
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* Mobile Navigation Horizontal Scroll View (Lg viewport hide) */}
                    <div className="block lg:hidden overflow-x-auto pb-3 mb-2">
                        <div className="flex gap-2 min-w-max">
                            {navigationGroups.flatMap(g => g.items).map((item, idx) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);
                                return (
                                    <Link
                                        key={idx}
                                        href={item.href}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                                            active 
                                            ? 'bg-indigo-600 text-white border-indigo-600' 
                                            : 'bg-[var(--surface-default)] text-slate-400 border-[var(--border-default)] hover:bg-[var(--surface-overlay)]'
                                        }`}
                                    >
                                        <Icon size={14} />
                                        <span>{item.label}</span>
                                        {item.badge !== undefined && (
                                            <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${active ? 'bg-white text-indigo-600' : 'bg-indigo-600 text-white'}`}>
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Main Workspace Sub-page Panel */}
                    <main className="lg:col-span-3">
                        <div className="animate-in fade-in duration-300">
                            {children}
                        </div>
                    </main>

                </div>
            </div>
        </div>
    );
}
