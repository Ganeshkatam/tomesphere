"use client";

import React from "react";
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

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const isDark = resolvedTheme === "dark";

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-200 ${
        isDark
          ? "bg-slate-950/90 backdrop-blur-md text-white"
          : "bg-white/95 backdrop-blur-md text-slate-900"
      } ${variant !== "marketing" ? (isDark ? "border-b border-white/10 shadow-xs" : "border-b border-slate-200/90 shadow-xs") : ""} ${className}`}
      id="top-nav"
    >
      {/* Upper Tier */}
      <div className="h-[88px] max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 text-xl font-extrabold hover:opacity-90 transition-opacity flex-shrink-0"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 font-bold">
            <BookOpen size={22} />
          </div>
          <span
            className={`tracking-tight font-display font-bold text-xl ${
              isDark ? "text-white" : "text-slate-900"
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
            <nav className="hidden md:flex items-center gap-2">
              <Link
                href="/discover"
                className={`text-base font-medium px-4 py-2 rounded-lg transition-all ${
                  isDark
                    ? "text-slate-300 hover:text-white hover:bg-white/10"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-200"
                }`}
              >
                Discover
              </Link>
              <Link
                href="/library"
                className={`text-base font-medium px-4 py-2 rounded-lg transition-all ${
                  isDark
                    ? "text-slate-300 hover:text-white hover:bg-white/10"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-200"
                }`}
              >
                Library
              </Link>
              <Link
                href="/discover"
                className={`text-base font-medium px-4 py-2 rounded-lg transition-all ${
                  isDark
                    ? "text-slate-300 hover:text-white hover:bg-white/10"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-200"
                }`}
              >
                Reader
              </Link>
              <Link
                href="/about"
                className={`text-base font-medium px-4 py-2 rounded-lg transition-all ${
                  isDark
                    ? "text-slate-300 hover:text-white hover:bg-white/10"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-200"
                }`}
              >
                About
              </Link>
            </nav>
          )}
          {variant === "reader" && (
            <div className={`flex items-center text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
              <span>Reader Mode</span>
            </div>
          )}
        </div>

        {/* Right Utilities */}
        <div className="flex items-center gap-6 flex-shrink-0">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
              isDark
                ? "text-slate-300 hover:text-white hover:bg-white/10 border border-white/10"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {variant === "application" ? (
            <>
              <button
                aria-label="Notifications"
                className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                  isDark
                    ? "text-slate-300 hover:text-white hover:bg-white/10 border border-white/10"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Bell size={20} />
              </button>
              <div className={`h-6 w-px mx-1 hidden sm:block ${isDark ? "bg-slate-800" : "bg-slate-200"}`} />
              <Link
                href="/account"
                className={`flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-xl border transition-all group ${
                  isDark
                    ? "border-slate-800 hover:border-indigo-500 bg-slate-900"
                    : "border-slate-200 hover:border-indigo-500 bg-white"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                  <User size={18} />
                </div>
                <span className={`text-sm font-semibold hidden sm:block ${isDark ? "text-slate-100" : "text-slate-800"}`}>
                  Account
                </span>
              </Link>
            </>
          ) : variant === "reader" ? null : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className={`text-base font-semibold px-5 py-2.5 rounded-lg border transition-all ${
                  isDark
                    ? "text-slate-200 border-white/15 hover:bg-white/10 hover:text-white"
                    : "text-slate-700 border-slate-300 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white text-base font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-all"
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
