"use client";

import React from "react";
import { ThemeProvider } from "@/shared/providers/theme-context";
import { PWAProvider } from "@/shared/providers/pwa-context";
import GlobalErrorBoundary from "@/shared/core/components/GlobalErrorBoundary";
import AppToaster from "@/shared/feedback/components/AppToaster";
import PWAUpdatePrompt from "@/shared/feedback/PWAUpdatePrompt/PWAUpdatePrompt";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PWAProvider>
      <ThemeProvider>
        <GlobalErrorBoundary>{children}</GlobalErrorBoundary>
        <PWAUpdatePrompt />
        <AppToaster />
      </ThemeProvider>
    </PWAProvider>
  );
}
