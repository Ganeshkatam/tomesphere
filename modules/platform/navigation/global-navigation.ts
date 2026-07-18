import { Home, Compass, Book, User, LucideIcon } from 'lucide-react';
import { AppRoutes } from '@/modules/shared/kernel/navigation/AppRoutes';

export interface NavigationItem {
    href: string;
    label: string;
    icon: LucideIcon;
    color?: string;
}

export const GLOBAL_NAVIGATION: NavigationItem[] = [
    { href: AppRoutes.home, label: 'Home', icon: Home, color: 'text-indigo-400' },
    { href: AppRoutes.discover, label: 'Discover', icon: Compass, color: 'text-purple-400' },
    { href: AppRoutes.library, label: 'Library', icon: Book, color: 'text-orange-400' },
    { href: AppRoutes.me, label: 'Me', icon: User, color: 'text-cyan-400' },
];
