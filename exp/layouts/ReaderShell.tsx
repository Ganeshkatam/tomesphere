import React from "react";
import { UniversalHeader } from "../navigation/UniversalHeader";

export function ReaderShell({ children, showChrome = true }: { children: React.ReactNode, showChrome?: boolean }) {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface font-sans selection:bg-secondary-container selection:text-on-secondary-container">
      
      {/* Universal Header replacing Reader top chrome */}
      <UniversalHeader className={showChrome ? "translate-y-0" : "-translate-y-full"} />

      {/* Main Reading Area */}
      {/* 
        Max width is constrained for optimal reading line length.
        Padding is fluid: min 24px, max 64px.
      */}
      <main className="flex-1 w-full mx-auto max-w-[70ch] px-[clamp(24px,5vw,64px)] pt-[152px] pb-32 text-body-lg text-on-surface">
        {children}
      </main>

      {/* Bottom Progress */}
      <div 
        className={`fixed bottom-0 left-0 right-0 h-[6px] bg-surface-container-high transition-transform duration-300 z-50 ${
          showChrome ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="h-full bg-secondary rounded-r-full" style={{ width: "32%" }} />
      </div>
    </div>
  );
}
