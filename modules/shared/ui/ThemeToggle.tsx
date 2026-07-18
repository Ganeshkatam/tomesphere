'use client';

import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/modules/shared/providers/theme-context';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const handleToggle = () => {
        if (theme === 'system') {
            setTheme('light');
        } else if (theme === 'light') {
            setTheme('dark');
        } else {
            setTheme('system');
        }
    };

    // Get current state properties for icons, labels, tooltips and glow animations
    const state = {
        system: {
            icon: <Monitor size={18} className="text-slate-400 transition-transform group-hover:scale-110 duration-300" />,
            ariaLabel: "Current theme: System. Click to use light theme",
            title: "Use light theme",
            glowClass: "bg-slate-400/10",
        },
        light: {
            icon: <Sun size={18} className="text-amber-500 transition-transform group-hover:rotate-90 duration-500" />,
            ariaLabel: "Current theme: Light. Click to use dark theme",
            title: "Use dark theme",
            glowClass: "bg-amber-500/10",
        },
        dark: {
            icon: <Moon size={18} className="text-indigo-400 transition-transform group-hover:-rotate-12 duration-500" />,
            ariaLabel: "Current theme: Dark. Click to use system theme",
            title: "Use system theme",
            glowClass: "bg-indigo-400/10",
        },
    }[theme];

    return (
        <button
            onClick={handleToggle}
            className="relative w-10 h-10 rounded-lg bg-[var(--surface-default)]/60 hover:bg-[var(--surface-overlay)] border border-[var(--border-default)] hover:border-primary/30 transition-all duration-300 flex items-center justify-center group shadow-sm"
            aria-label={state.ariaLabel}
            title={state.title}
        >
            {state.icon}

            {/* Glow effect */}
            <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${state.glowClass}`} />
        </button>
    );
}
