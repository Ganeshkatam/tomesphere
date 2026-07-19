"use client";

// import Link from 'next/link';
import Image from "next/image";
import { GLOBAL_NAVIGATION } from "@/modules/navigation/global-navigation";
import { usePathname, useRouter } from "next/navigation";
import { User, LogOut, Library, Target, Search } from "lucide-react";
import { logOut } from "@/modules/authentication/actions/auth";
import { showError, showSuccess } from "@/lib/toast";
import { useEffect, useState } from "react";

import ThemeToggle from "@/modules/shared/ui/ThemeToggle";


interface NavbarProps {
  role?: string;
  currentPage?: string;
  user?: any;
  minimal?: boolean;
}

export default function Navbar({
  user: propUser,
  minimal = false,
}: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(propUser || null);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  useEffect(() => {
    if (propUser) {
      setUser(propUser);
    }
  }, [propUser]);

  const handleLogout = async () => {
    try {
      const res = await logOut();
      
      showSuccess("Logged out successfully");
      setIsProfileDrawerOpen(false);
      router.push("/");
    } catch (error: any) {
      console.error("Logout error:", error);
      showError("Error logging out");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/discover/search?q=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  const isActive = (path: string) => {
    if (path === "/home") {
      return pathname === "/home";
    }
    return pathname.startsWith(path);
  };

  const getInitials = () => {
    const name = user?.user_metadata?.name || "";
    if (name.trim()) {
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return name.slice(0, 2).toUpperCase();
    }

    const email = user?.email || "Reader";
    const emailName = email.split("@")[0];
    const emailParts = emailName.split(/[\._\-]+/);
    if (emailParts.length >= 2) {
      return (emailParts[0][0] + emailParts[1][0]).toUpperCase();
    }
    return emailName.slice(0, 2).toUpperCase();
  };

  const navLinks = GLOBAL_NAVIGATION;

  return (
    <>
      {/* Glass Navbar — 76px Height with soft blur, borders and breathing room */}
      <nav className="glass-nav sticky top-0 z-50 h-[76px] flex items-center">
        <div className="w-full px-4 sm:px-8 lg:px-16">
          <div className="flex items-center justify-between">
            {/* Left Side: Logo + Tagline & Desktop Navigation */}
            <div className="flex items-center gap-8">
              {/* Logo + Tagline block */}
              <a
                href={user ? "/home" : "/"}
                className="flex items-center gap-3 group"
              >
                <div className="w-10 h-10 group-hover:scale-110 transition-transform">
                  <Image src="/logo.png" alt="TomeSphere Logo" width={40} height={40} className="w-full h-full" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-extrabold tracking-tight text-[var(--text-primary)] leading-none">
                    TomeSphere
                  </span>
                  <span className="text-[9px] text-[var(--text-tertiary)] font-bold tracking-wider mt-1 block uppercase">
                    Built for learners
                  </span>
                </div>
              </a>

              {/* Desktop Navigation Links */}
              {!minimal && (
                <div className="hidden xl:flex items-center gap-6 border-l border-[var(--border-default)] pl-8 h-8">
                  {navLinks
                    .filter((link) => {
                      if (link.label === "Profile") return false;
                      if (!user && (link.href === "/library" || link.href === "/me" || link.href === "/home")) return false;
                      if (user && (link.href === "/support" || link.href === "/about")) return false;
                      return true;
                    })
                    .map((link) => {
                      const Icon = link.icon;
                      const active = isActive(link.href);
                      return (
                        <a
                          key={link.href}
                          href={link.href}
                          className={`relative py-2 text-sm font-medium transition-all duration-200 group flex items-center gap-2 ${active
                            ? "text-[var(--text-primary)] font-semibold active-link"
                            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                            }`}
                        >
                          <Icon
                            size={14}
                            className={
                              active
                                ? link.color
                                : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
                            }
                          />
                          <span>{link.label}</span>
                          <span
                            className={`absolute bottom-[-10px] left-0 w-full h-[2px] bg-indigo-500 transition-transform duration-200 origin-left ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                          />
                        </a>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Center Piece: Integrated Global Search (Command Center) */}
            {!minimal && (
              <form
                onSubmit={handleSearchSubmit}
                className="hidden md:flex items-center relative max-w-sm lg:max-w-md w-full mx-8"
              >
                <Search
                  size={16}
                  className="absolute left-3.5 text-[var(--text-tertiary)]"
                />
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Search books, authors, ISBN, topics..."
                  className="w-full header-search-input bg-[var(--surface-default)] border border-[var(--border-default)] hover:border-[var(--border-strong)] focus:border-indigo-500/50 focus:bg-[var(--surface-overlay)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] text-xs sm:text-sm pl-11 pr-4 py-2.5 rounded-xl transition-all outline-none"
                />
              </form>
            )}

            {/* Right Side: Notifications, Avatar (Floating Dropdown) */}
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  {/* Avatar Photo + Floating Dropdown Panel Container */}
                  <div className="relative">
                    <button
                      onClick={() =>
                        setIsProfileDrawerOpen(!isProfileDrawerOpen)
                      }
                      className="relative w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 border border-white/20 hover:border-indigo-400 flex items-center justify-center text-white font-extrabold text-xs shadow-md transition-all hover:scale-105 shrink-0"
                    >
                      {user?.user_metadata?.avatar_url ? (
                        <Image
                          src={user.user_metadata.avatar_url}
                          alt="Avatar"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <span>{getInitials()}</span>
                      )}
                    </button>

                    {isProfileDrawerOpen && (
                      <>
                        {/* Click Catcher backdrop for floating card */}
                        <div
                          className="fixed inset-0 z-40 bg-transparent cursor-default"
                          onClick={() => setIsProfileDrawerOpen(false)}
                        />
                        {/* Floating Dropdown Card overlay panel */}
                        <div className="absolute right-0 mt-3 w-80 profile-dropdown-card bg-[var(--surface-floating)] border border-[var(--border-default)] rounded-2xl shadow-[var(--shadow-dropdown)] z-50 p-5 space-y-4">
                          {/* User info header block */}
                          <div className="flex items-center gap-3 pb-3 border-b border-[var(--border-subtle)]">
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 border border-[var(--border-default)] flex items-center justify-center text-white font-extrabold text-xs shadow-md shrink-0">
                              {user?.user_metadata?.avatar_url ? (
                                <Image
                                  src={user.user_metadata.avatar_url}
                                  alt="Avatar"
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              ) : (
                                <span>{getInitials()}</span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-[var(--text-primary)] leading-tight truncate">
                                {user?.user_metadata?.name ||
                                  user?.email?.split("@")[0] ||
                                  "Reader"}
                              </h4>
                              <p className="text-[10px] text-[var(--text-tertiary)] font-medium truncate">
                                {user?.email}
                              </p>
                            </div>
                          </div>

                          {/* Navigation lists */}
                          <div className="space-y-1">
                            <a
                              href="/me"
                              onClick={() => setIsProfileDrawerOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--surface-overlay)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-transparent hover:border-[var(--border-subtle)] transition-all text-xs font-semibold"
                            >
                              <User size={14} className="text-cyan-400" />
                              <span>Personal Center</span>
                            </a>
                            <a
                              href="/library"
                              onClick={() => setIsProfileDrawerOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--surface-overlay)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-transparent hover:border-[var(--border-subtle)] transition-all text-xs font-semibold"
                            >
                              <Library size={14} className="text-orange-400" />
                              <span>My Library</span>
                            </a>
                            <a
                              href="/me/learning"
                              onClick={() => setIsProfileDrawerOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--surface-overlay)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-transparent hover:border-[var(--border-subtle)] transition-all text-xs font-semibold"
                            >
                              <Target size={14} className="text-pink-400" />
                              <span>Learning Space</span>
                            </a>
                          </div>
                          {/* Theme toggler integrated row switcher */}
                          <div className="flex items-center justify-between px-3 py-2 border border-[var(--border-subtle)] rounded-xl bg-[var(--surface-default)]">
                            <span className="text-[var(--text-secondary)] font-semibold text-xs">
                              Theme Mode
                            </span>
                            <ThemeToggle />
                          </div>

                          {/* Footer trigger action log out */}
                          <div className="pt-3 border-t border-[var(--border-subtle)]">
                            <button
                              onClick={handleLogout}
                              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 font-bold border border-red-500/20 hover:border-red-500/30 transition-all text-xs shadow-md"
                            >
                              <LogOut size={14} />
                              <span>Logout</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <a
                    href="/login"
                    className="px-4 py-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-overlay)] transition-all text-sm font-semibold"
                  >
                    Sign In
                  </a>
                  <a
                    href="/signup"
                    className="btn-primary py-2 px-4 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 shadow-md"
                  >
                    Get Started
                  </a>
                </>
              )}

            </div>
          </div>
        </div>
      </nav>

    </>
  );
}
