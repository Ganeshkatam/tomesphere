"use client";

import React from "react";
import { ThemeProvider } from "@/shared/providers/theme-context";
import GlobalErrorBoundary from "@/shared/core/components/GlobalErrorBoundary";
import AppToaster from "@/shared/feedback/components/AppToaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <GlobalErrorBoundary>{children}</GlobalErrorBoundary>
      <AppToaster />
    </ThemeProvider>
  );
}
