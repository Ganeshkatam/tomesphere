'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getAuthStatus, logOut } from '@/modules/platform/authentication/actions/auth';
import {
    User,
    LogOut,
    Menu,
    X,
    Compass
} from 'lucide-react';
import ThemeToggle from '@/modules/shared/ui/ThemeToggle';
import { showSuccess, showError } from '@/lib/toast';
import { GLOBAL_NAVIGATION } from '@/modules/platform/navigation/global-navigation';
import { AppRoutes } from '@/modules/shared/kernel/navigation/AppRoutes';

export default function QuickAccessSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Check authentication via server action
    useEffect(() => {
        const checkAuth = async () => {
            const res = await getAuthStatus();
            if (res.success) {
                setIsLoggedIn(res.data.isLoggedIn);
            }
        };
        checkAuth();
    }, [pathname]);

    // Show trigger button after scrolling
    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 200);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close on Escape key
    useEffect(() => {
        if (!isOpen) return;
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    const handleLogout = useCallback(async () => {
        const res = await logOut();
        if (res.success) {
            showSuccess('Logged out successfully');
            setIsOpen(false);
            setIsLoggedIn(false);
            router.push('/');
        } else {
            showError(res.error || 'Failed to log out');
        }
    }, [router]);

    const navigateTo = useCallback((path: string) => {
        router.push(path);
        setIsOpen(false);
    }, [router]);

    const quickLinks = isLoggedIn ? GLOBAL_NAVIGATION : [
        { icon: Compass, label: 'Discover', href: AppRoutes.discover },
        { icon: User, label: 'Sign In', href: '/login' },
    ];

    const isActive = (path: string) => pathname === path;

    if (!mounted) return null;

    return (
        <>
            {/* Floating Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed right-6 top-24 z-40 w-14 h-14 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-primary/50 group ${
                    isVisible && !isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
                }`}
                aria-label="Open quick access menu"
            >
                <Menu size={20} className="text-slate-300 group-hover:text-primary transition-colors" />
            </button>

            {/* Only render overlay + panel when open */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] animate-fadeIn"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Panel */}
                    <div
                        className="fixed right-0 top-0 h-full w-80 z-[100] bg-slate-900/95 backdrop-blur-xl border-l border-white/10 shadow-2xl animate-slideInRight"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">📚</span>
                                <span className="text-xl font-bold gradient-text">TomeSphere</span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
                                aria-label="Close menu"
                            >
                                <X size={18} className="text-slate-400 hover:text-white" />
                            </button>
                        </div>

                        {/* Quick Links */}
                        <div className="p-4 space-y-2">
                            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-3">
                                Quick Access
                            </h3>
                            {quickLinks.map((link) => {
                                const Icon = link.icon;
                                const active = isActive(link.href);

                                return (
                                    <button
                                        key={link.href}
                                        onClick={() => navigateTo(link.href)}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl group transition-all duration-300 ${
                                            active 
                                                ? 'bg-primary/20 text-white shadow-inner border border-primary/30' 
                                                : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-transparent'
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg transition-colors ${
                                                active ? 'bg-primary/30' : 'bg-slate-800 group-hover:bg-slate-700'
                                            }`}>
                                                <Icon size={20} className={active ? (link as any).color : 'text-slate-400 group-hover:text-white'} />
                                            </div>
                                            <span className="font-medium">{link.label}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Theme Toggle */}
                        <div className="px-4 mt-4">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                                <span className="text-sm text-slate-400">Theme</span>
                                <ThemeToggle />
                            </div>
                        </div>

                        {/* Logout */}
                        {isLoggedIn && (
                            <div className="absolute bottom-6 left-0 right-0 px-4">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-600/10 border border-red-600/20 text-red-400 hover:bg-red-600/20 transition-all"
                                >
                                    <LogOut size={18} />
                                    <span className="font-medium">Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                .animate-slideInRight {
                    animation: slideInRight 0.3s ease-out;
                }
            `}</style>
        </>
    );
}
