"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User, Settings, LogOut } from "lucide-react";
import { Dropdown } from "@/shared/ui/Dropdown";
import { supabase } from "@/shared/core/database/client";

export interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    avatarUrl?: string | null;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter();

  const getInitials = () => {
    if (user.name) {
      const parts = user.name.split(" ");
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return user.name.substring(0, 2).toUpperCase();
    }
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const trigger = (
    <div
      className="relative flex items-center justify-center w-10 h-10 rounded-full overflow-hidden bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white font-bold text-sm shadow-md border-2 border-indigo-400/40 hover:border-indigo-300 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
      title="Account Settings"
      aria-label="Account Settings"
    >
      {user.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt={user.name || "User avatar"}
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        <span className="group-hover:scale-110 transition-transform">
          {getInitials()}
        </span>
      )}
    </div>
  );

  return (
    <Dropdown
      trigger={trigger}
      items={[
        {
          label: "Profile",
          icon: <User size={16} />,
          onClick: () => router.push("/me/account"),
        },
        {
          label: "Settings",
          icon: <Settings size={16} />,
          onClick: () => router.push("/me/account"),
        },
        { divider: true, label: "" },
        {
          label: "Sign out",
          icon: <LogOut size={16} className="text-rose-500" />,
          onClick: handleSignOut,
        },
      ]}
    />
  );
}
