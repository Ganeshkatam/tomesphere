import React from "react";
import { UniversalHeader } from "../navigation/UniversalHeader";

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface font-sans">
      
      <UniversalHeader />

      {/* Main Content */}
      <main className="flex-1 w-full mx-auto max-w-container-max px-margin-desktop pt-[152px] pb-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-outline-variant bg-surface-container-low mt-auto">
        <div className="mx-auto max-w-container-max px-margin-desktop py-16 flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-sm">
            <span className="font-serif font-bold text-xl tracking-tight text-primary mb-4 block">Athenaeum Digital</span>
            <p className="text-base text-on-surface-variant leading-[24px]">
              A modern custodian of knowledge, bridging the timeless authority of physical archives with the accessibility of digital reading.
            </p>
          </div>
          <div className="flex gap-16 text-base text-on-surface-variant">
            <div className="flex flex-col gap-4">
              <span className="font-semibold text-on-surface text-sm tracking-wide">Discovery</span>
              <a href="#" className="hover:text-primary">Search Catalogue</a>
              <a href="#" className="hover:text-primary">New Arrivals</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-semibold text-on-surface text-sm tracking-wide">Support</span>
              <a href="#" className="hover:text-primary">Accessibility</a>
              <a href="#" className="hover:text-primary">Contact Librarian</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
