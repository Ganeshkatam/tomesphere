"use client";

import Link from "next/link";
import { LogOut, Settings } from "lucide-react";
import { logOut } from "@/modules/authentication/actions/auth";
import { useRouter } from "next/navigation";
import { showSuccess, showError } from "@/lib/toast";
import { GLOBAL_NAVIGATION } from "@/modules/navigation/global-navigation";

interface SidebarNavigationProps {
  user: any;
  currentPage: string;
}

export default function SidebarNavigation({
  user,
  currentPage,
}: SidebarNavigationProps) {
  const router = useRouter();

  const isActive = (path: string) => currentPage === path;

  const navLinks = GLOBAL_NAVIGATION;

  const handleLogout = async () => {
    try {
      const res = await logOut();
      
      showSuccess("Logged out successfully");
      router.push("/");
    } catch (error) {
      showError("Error logging out");
    }
  };

  if (!user) return null;

  return (
    <div className="sticky top-24 w-64 hidden xl:block flex-shrink-0">
      <div className="glass-strong rounded-3xl p-4 border border-white/10 flex flex-col gap-2 h-[calc(100vh-120px)]">
        <div className="px-4 py-2 mb-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Navigation
          </p>
        </div>

        <div className="flex-1 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium ${
                  active
                    ? "bg-indigo-600/10 text-indigo-400 shadow-[inset_0_0_20px_rgba(79,70,229,0.1)] border border-indigo-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
              >
                <Icon
                  size={20}
                  className={active ? "text-indigo-400" : "text-slate-500"}
                />
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-1">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5"
          >
            <Settings size={20} className="text-slate-500" />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full text-left"
          >
            <LogOut size={20} className="text-red-500/50" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
