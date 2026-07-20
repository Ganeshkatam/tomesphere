"use client";

import React from "react";
import { useRouter } from "next/navigation";

export interface AuthGuardProps {
  authenticated: boolean;
  fallbackRedirect: string;
  children: React.ReactNode;
  className?: string;
}

export function AuthGuard({ authenticated, fallbackRedirect, children, className }: AuthGuardProps) {
  const router = useRouter();

  const handleIntercept = (e: React.MouseEvent) => {
    if (!authenticated) {
      e.preventDefault();
      e.stopPropagation();
      router.push(`/login?redirect=${encodeURIComponent(fallbackRedirect)}`);
    }
  };

  return (
    <div className={className} onClickCapture={handleIntercept}>
      {children}
    </div>
  );
}
