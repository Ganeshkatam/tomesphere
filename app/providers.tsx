'use client';

import React from 'react';
import { ThemeProvider } from '@/modules/shared/providers/theme-context';
import { PWAProvider } from '@/modules/shared/providers/pwa-context';
import GlobalErrorBoundary from '@/modules/shared/core/components/GlobalErrorBoundary';
import AppToaster from '@/modules/shared/feedback/components/AppToaster';
import PWAUpdatePrompt from '@/modules/shared/navigation/components/PWAUpdatePrompt';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <PWAProvider>
            <ThemeProvider>
                <GlobalErrorBoundary>
                    {children}
                </GlobalErrorBoundary>
                <PWAUpdatePrompt />
                <AppToaster />
            </ThemeProvider>
        </PWAProvider>
    );
}
