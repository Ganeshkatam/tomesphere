import React from "react";
import { UniversalHeader } from "../navigation/UniversalHeader";

export function DiscoveryShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface font-sans">
      
      <UniversalHeader />

      {/* Main Layout Container */}
      <div className="flex-1 w-full mx-auto max-w-container-max px-margin-desktop flex items-start gap-12 pt-[152px] pb-32">
        
        {/* Sidebar */}
        <aside className="hidden lg:block w-[260px] shrink-0 sticky top-[152px]">
          <nav className="flex flex-col gap-1">
            <div className="text-[12px] font-semibold text-outline uppercase tracking-wider mb-3 px-3">Browse</div>
            <a href="#" className="px-3 py-2.5 rounded-md bg-surface-container-high text-primary font-label-md">Overview</a>
            <a href="#" className="px-3 py-2.5 rounded-md hover:bg-surface-container-high text-on-surface-variant hover:text-primary font-body-md transition-colors">Trending</a>
            <a href="#" className="px-3 py-2.5 rounded-md hover:bg-surface-container-high text-on-surface-variant hover:text-primary font-body-md transition-colors">New Arrivals</a>
            
            <div className="text-[12px] font-semibold text-outline uppercase tracking-wider mb-3 mt-8 px-3">Catalogue</div>
            <a href="#" className="px-3 py-2.5 rounded-md hover:bg-surface-container-high text-on-surface-variant hover:text-primary font-body-md transition-colors">Authors</a>
            <a href="#" className="px-3 py-2.5 rounded-md hover:bg-surface-container-high text-on-surface-variant hover:text-primary font-body-md transition-colors">Subjects</a>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
