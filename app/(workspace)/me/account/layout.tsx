import React from "react";
import { AccountLayoutShell } from "@/modules/me/account/presentation/components/AccountLayoutShell";

import BackButton from "@/shared/ui/BackButton";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AccountLayoutShell>
      <div className="w-full flex flex-col h-full min-h-0">
        <div className="flex items-center gap-3 mb-4 shrink-0">
          <div className="lg:hidden">
            <BackButton fallbackUrl="/me/dashboard" label="" className="!p-2" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white mb-0">
            Account Settings
          </h1>
        </div>
        
        <div className="flex-1 w-full overflow-y-auto min-h-0 pr-2 pb-14">
          {children}
        </div>
      </div>
    </AccountLayoutShell>
  );
}
