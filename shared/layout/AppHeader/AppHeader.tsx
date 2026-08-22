"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, Search, Bell, User, Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "@/shared/providers/theme-context";

export type HeaderVariant = "marketing" | "application" | "reader";

export interface AppHeaderProps {
  className?: string;
  variant?: HeaderVariant;
  user?: {
    name?: string | null;
    email?: string | null;
    avatarUrl?: string | null;
  } | null;
}

import { UserMenu } from "./UserMenu";
import { SearchBar } from "@/modules/discovery/search/presentation/components/SearchBar";

const AUTH_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

export function AppHeader({ className = "", variant = "application", user }: AppHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Omit header entirely on authentication routes
  if (pathname && AUTH_ROUTES.includes(pathname)) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isDark = resolvedTheme === "dark";

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-200 ${isDark
        ? "bg-slate-950/95 backdrop-blur-md text-white border-b border-slate-800/80 shadow-md"
        : "bg-white/95 backdrop-blur-md text-slate-900 border-b border-slate-200/90 shadow-xs"
        } ${className}`}
      id="top-nav"
    >
      <div className="h-20 sm:h-22 lg:h-24 max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-between gap-4 sm:gap-6">

        {/* Left Side: Logo + Main Navigation Links */}
        <div className="flex items-center gap-6 lg:gap-10">
          {/* Logo */}
          <Link
            href={variant === "application" ? "/me" : "/"}
            className="flex items-center gap-3 hover:opacity-90 transition-opacity flex-shrink-0"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 font-bold">
              <BookOpen size={22} />
            </div>
            <span
              className={`tracking-tight font-display font-extrabold text-xl sm:text-2xl ${isDark ? "text-white" : "text-slate-900"
                }`}
            >
              TomeSphere
            </span>
          </Link>

          {/* Primary Navigation Links (Inline next to Logo) */}
          {variant === "application" && (
            <nav className="hidden md:flex items-center gap-1.5 sm:gap-2.5">
              <Link
                href="/me"
                className={`text-sm sm:text-base font-semibold px-3.5 py-2 rounded-xl transition-all ${pathname === "/me"
                  ? "bg-indigo-600/15 text-indigo-600 dark:text-indigo-400 font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }`}
              >
                Home
              </Link>
              <Link
                href="/discover"
                className={`text-sm sm:text-base font-semibold px-3.5 py-2 rounded-xl transition-all ${pathname && pathname.startsWith("/discover")
                  ? "bg-indigo-600/15 text-indigo-600 dark:text-indigo-400 font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }`}
              >
                Discover
              </Link>
              <Link
                href="/dashboard"
                className={`text-sm sm:text-base font-semibold px-3.5 py-2 rounded-xl transition-all ${pathname && pathname.startsWith("/dashboard")
                  ? "bg-indigo-600/15 text-indigo-600 dark:text-indigo-400 font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }`}
              >
                MyDashboard
              </Link>
              <Link
                href="/me/mylibrary"
                className={`text-sm sm:text-base font-semibold px-3.5 py-2 rounded-xl transition-all ${pathname && pathname.startsWith("/me/mylibrary")
                  ? "bg-indigo-600/15 text-indigo-600 dark:text-indigo-400 font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }`}
              >
                MyLibrary
              </Link>
            </nav>
          )}

          {variant === "marketing" && (
            <nav className="hidden md:flex items-center gap-1.5 sm:gap-2.5">
              <Link
                href="/discover"
                className={`text-sm sm:text-base font-medium px-3.5 py-2 rounded-xl transition-all ${isDark
                  ? "text-slate-300 hover:text-white hover:bg-white/10"
                  : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                  }`}
              >
                Discover
              </Link>
              <Link
                href="/discover/collections"
                className={`text-sm sm:text-base font-medium px-3.5 py-2 rounded-xl transition-all ${isDark
                  ? "text-slate-300 hover:text-white hover:bg-white/10"
                  : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                  }`}
              >
                Collections
              </Link>
              <Link
                href="/about"
                className={`text-sm sm:text-base font-medium px-3.5 py-2 rounded-xl transition-all ${isDark
                  ? "text-slate-300 hover:text-white hover:bg-white/10"
                  : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                  }`}
              >
                About
              </Link>
            </nav>
          )}
        </div>

        {/* Right Side: Search Bar + Utilities + Profile Avatar */}
        <div className="flex items-center gap-3 sm:gap-4">

          {/* Search Bar with live autocomplete */}
          <div className="relative hidden sm:flex items-center w-52 sm:w-72 md:w-80 lg:w-96">
            <SearchBar size="md" placeholder="Search digital archives..." />
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className={`p-2.5 rounded-xl transition-colors cursor-pointer md:hidden flex items-center justify-center ${isDark
              ? "text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
              }`}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`hidden lg:flex p-2.5 rounded-xl transition-colors cursor-pointer ${isDark
              ? "text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
              }`}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {variant === "application" ? (
            <>
              <button
                aria-label="Notifications"
                className={`p-2.5 rounded-xl transition-colors cursor-pointer hidden sm:flex items-center justify-center ${isDark
                  ? "text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
                  }`}
              >
                <Bell size={20} />
              </button>

              <div className={`h-6 w-px hidden sm:block ${isDark ? "bg-slate-800" : "bg-slate-200"}`} />

              {user ? (
                <UserMenu user={user} />
              ) : (
                <div
                  className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white font-bold text-sm shadow-md border-2 border-indigo-400/40"
                >
                  <User size={18} />
                </div>
              )}
            </>
          ) : variant === "reader" ? null : user ? (
            <UserMenu user={user} />
          ) : (
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/login"
                className={`text-sm font-semibold px-4 py-2 rounded-lg border transition-all ${isDark
                  ? "text-slate-200 border-slate-800 hover:bg-white/10 hover:text-white"
                  : "text-slate-700 border-slate-300 hover:bg-slate-100 hover:text-slate-900"
                  }`}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

      </div>

      {/* Mobile Menu Overlay & Drawer */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="md:hidden fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Side Drawer */}
          <div
            className={`md:hidden fixed inset-y-0 right-0 z-[70] w-[280px] sm:w-[320px] shadow-2xl flex flex-col animate-in slide-in-from-right fade-in duration-300 border-l ${
              isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-lg text-slate-800 dark:text-slate-200">Menu</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  isDark ? "hover:bg-slate-800 text-slate-400 hover:text-white" : "hover:bg-slate-100 text-slate-500 hover:text-slate-900"
                }`}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-1.5">
              <div className="relative flex items-center w-full mb-4 sm:hidden">
                <SearchBar size="sm" placeholder="Search digital archives..." />
              </div>

            {variant === "application" && (
              <>
                <Link
                  href="/me"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-base font-semibold px-4 py-3 rounded-xl transition-all ${pathname === "/me"
                    ? "bg-indigo-600/15 text-indigo-600 dark:text-indigo-400 font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    }`}
                >
                  Home
                </Link>
                <Link
                  href="/discover"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-base font-semibold px-4 py-3 rounded-xl transition-all ${pathname && pathname.startsWith("/discover")
                    ? "bg-indigo-600/15 text-indigo-600 dark:text-indigo-400 font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    }`}
                >
                  Discover
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-base font-semibold px-4 py-3 rounded-xl transition-all ${pathname && pathname.startsWith("/dashboard")
                    ? "bg-indigo-600/15 text-indigo-600 dark:text-indigo-400 font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    }`}
                >
                  MyDashboard
                </Link>
                <Link
                  href="/me/mylibrary"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-base font-semibold px-4 py-3 rounded-xl transition-all ${pathname && pathname.startsWith("/me/mylibrary")
                    ? "bg-indigo-600/15 text-indigo-600 dark:text-indigo-400 font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    }`}
                >
                  Library
                </Link>
              </>
            )}

            {variant === "marketing" && (
              <>
                <Link
                  href="/discover"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-base font-medium px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${isDark
                    ? "text-slate-300 hover:text-white hover:bg-white/10"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                >
                  <Search size={18} className="opacity-70" />
                  Discover
                </Link>
                <Link
                  href="/discover/collections"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-base font-medium px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${isDark
                    ? "text-slate-300 hover:text-white hover:bg-white/10"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                >
                  <BookOpen size={18} className="opacity-70" />
                  Collections
                </Link>
                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-base font-medium px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${isDark
                    ? "text-slate-300 hover:text-white hover:bg-white/10"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                >
                  <User size={18} className="opacity-70" />
                  About
                </Link>
              </>
            )}

            {/* Mobile Auth & Utilities */}
            {!user && variant !== "reader" && (
              <div className="border-t border-slate-100 dark:border-slate-800 mt-2 pt-4 px-4 flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-center text-sm font-semibold px-4 py-2.5 rounded-lg border transition-all ${isDark
                    ? "text-slate-200 border-slate-800 hover:bg-white/10"
                    : "text-slate-700 border-slate-300 hover:bg-slate-100"
                    }`}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-center bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
            
            <div className="border-t border-slate-100 dark:border-slate-800 mt-2 pt-4 px-4 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Theme</span>
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className={`p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center ${isDark
                  ? "text-slate-300 hover:text-white hover:bg-slate-800"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>
        </div>
        </>
      )}
    </header>
  );
}
