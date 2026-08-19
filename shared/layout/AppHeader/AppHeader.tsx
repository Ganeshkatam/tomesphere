"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Search, Bell, User, Sun, Moon } from "lucide-react";
import { useTheme } from "@/shared/providers/theme-context";

export type HeaderVariant = "marketing" | "application" | "reader";

export interface AppHeaderProps {
  className?: string;
  variant?: HeaderVariant;
}

export function AppHeader({ className = "", variant = "application" }: AppHeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolledPastHero(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  // Determine if header should be dark glass (over hero/dark section) or match current theme surface
  const isDarkHeader = variant === "marketing" ? !isScrolledPastHero || resolvedTheme === "dark" : resolvedTheme === "dark";

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isDarkHeader
          ? "bg-slate-950/85 backdrop-blur-md border-b border-white/10 text-white"
          : "bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 text-slate-900"
      } shadow-xs ${className}`}
      id="top-nav"
    >
      {/* Upper Tier */}
      <div className="h-16 max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-xl font-extrabold hover:opacity-90 transition-opacity flex-shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 font-bold">
            <BookOpen size={18} />
          </div>
          <span
            className={`tracking-tight font-display font-bold text-lg ${
              isDarkHeader ? "text-white" : "text-slate-900 dark:text-white"
            }`}
          >
            TomeSphere
          </span>
        </Link>

        {/* Middle Section (Search for Application, Navigation for Marketing) */}
        <div className="flex-1 flex justify-center max-w-xl mx-auto">
          {variant === "application" && (
            <div className="w-full relative flex items-center bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-xl px-4 py-2 transition-all focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
              <Search size={18} className="text-[var(--text-tertiary)] mr-3 flex-shrink-0" />
              <input
                className="bg-transparent border-none focus:outline-none w-full text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
                placeholder="Search digital archives..."
                type="text"
              />
            </div>
          )}
          {variant === "marketing" && (
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/discover"
                className={`text-sm font-medium transition-colors ${
                  isDarkHeader
                    ? "text-slate-300 hover:text-white"
                    : "text-slate-700 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-white"
                }`}
              >
                Discover
              </Link>
              <Link
                href="/library"
                className={`text-sm font-medium transition-colors ${
                  isDarkHeader
                    ? "text-slate-300 hover:text-white"
                    : "text-slate-700 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-white"
                }`}
              >
                Library
              </Link>
              <Link
                href="/discover"
                className={`text-sm font-medium transition-colors ${
                  isDarkHeader
                    ? "text-slate-300 hover:text-white"
                    : "text-slate-700 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-white"
                }`}
              >
                Reader
              </Link>
              <Link
                href="/about"
                className={`text-sm font-medium transition-colors ${
                  isDarkHeader
                    ? "text-slate-300 hover:text-white"
                    : "text-slate-700 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-white"
                }`}
              >
                About
              </Link>
            </nav>
          )}
          {variant === "reader" && (
            <div className={`flex items-center text-sm font-semibold ${isDarkHeader ? "text-white" : "text-slate-900 dark:text-white"}`}>
              <span>Reader Mode</span>
            </div>
          )}
        </div>

        {/* Right Utilities */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isDarkHeader
                ? "text-slate-300 hover:text-white hover:bg-white/10 border border-white/10"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
            }`}
          >
            {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {variant === "application" ? (
            <>
              <button
                aria-label="Notifications"
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              >
                <Bell size={18} />
              </button>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />
              <Link
                href="/account"
                className="flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 bg-white dark:bg-slate-800 transition-all group"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                  <User size={16} />
                </div>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 hidden sm:block">
                  Account
                </span>
              </Link>
            </>
          ) : variant === "reader" ? null : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className={`text-sm font-medium transition-colors ${
                  isDarkHeader
                    ? "text-slate-300 hover:text-white"
                    : "text-slate-700 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-white"
                }`}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Lower Tier (Application navigation) */}
      {variant === "application" && (
        <div className="border-t border-[var(--border-subtle)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-11 flex items-center">
            <nav className="flex items-center gap-8 h-full">
              <Link
                href="/discover"
                className="text-sm font-bold h-full flex items-center text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
              >
                Discover
              </Link>
              <Link
                href="/library"
                className="text-sm font-semibold h-full flex items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors border-b-2 border-transparent hover:border-[var(--border-default)]"
              >
                Library
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
