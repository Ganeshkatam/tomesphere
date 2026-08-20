import React from "react";
import { AccountLayoutShell } from "@/modules/me/account/presentation/components/AccountLayoutShell";

import { AccountTabs } from "@/modules/me/account/presentation/components/AccountTabs";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AccountLayoutShell>
      <div className="w-full flex flex-col h-full">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white mb-6">
          Account Settings
        </h1>
        
        <AccountTabs />
        
        <div className="flex-1 w-full mt-2">
          {children}
        </div>
      </div>
    </AccountLayoutShell>
  );
}
