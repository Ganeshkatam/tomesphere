import React from "react";
import Link from "next/link";

export type HeaderVariant = "marketing" | "application" | "reader";

export interface AppHeaderProps {
  className?: string;
  variant?: HeaderVariant;
}

export function AppHeader({ className = "", variant = "application" }: AppHeaderProps) {
  return (
    <header className={`fixed top-0 z-50 w-full bg-surface dark:bg-surface-dim border-b border-outline-variant dark:border-outline flex flex-col transition-transform duration-300 ${className}`} id="top-nav">
      {/* Upper Tier */}
      <div className="h-[72px] flex items-center w-full px-margin-desktop mx-auto">
        <div className="flex justify-between items-center w-full gap-8">
          {/* Logo */}
          <Link href="/" className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed flex items-center gap-2 flex-shrink-0">
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
            <span>TomeSphere</span>
          </Link>
          
          {/* Middle Section (Search for Application, Empty for Marketing) */}
          <div className="flex-1 flex justify-center max-w-2xl mx-auto">
            {variant === "application" && (
              <div className="w-full relative flex items-center bg-surface-container-low dark:bg-tertiary-container border border-outline-variant rounded-full px-5 py-2.5 transition-all duration-300 focus-within:border-primary">
                <span className="material-symbols-outlined text-on-surface-variant mr-3">search</span>
                <input className="bg-transparent border-none focus:outline-none w-full text-body-md font-body-md placeholder:text-on-tertiary-container" placeholder="Search digital archives..." type="text" />
              </div>
            )}
            {variant === "marketing" && (
              <nav className="hidden md:flex items-center gap-8">
                <Link href="/about" className="font-label-md text-on-surface-variant hover:text-primary transition-colors">About</Link>
                <Link href="/pricing" className="font-label-md text-on-surface-variant hover:text-primary transition-colors">Pricing</Link>
              </nav>
            )}
            {variant === "reader" && (
              <div className="flex items-center text-on-surface-variant text-label-md font-label-md">
                <span>Reading Progress: 42%</span>
              </div>
            )}
          </div>

          {/* Right Utilities */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {variant === "application" ? (
              <>
                <button className="p-2 rounded-full hover:bg-surface-container-low dark:hover:bg-tertiary-container transition-all duration-200 text-on-surface-variant">
                  <span className="material-symbols-outlined">notifications</span>
                </button>
                <div className="h-8 w-px bg-outline-variant mx-2 hidden sm:block"></div>
                <Link href="/account" className="flex items-center gap-3 p-1 pl-1 pr-3 rounded-full border border-outline-variant hover:border-primary transition-all group">
                  <div className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">person</span>
                  </div>
                  <span className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors hidden sm:block">Account</span>
                </Link>
              </>
            ) : variant === "reader" ? (
              <>
                <button className="p-2 rounded-full hover:bg-surface-container-low text-on-surface-variant"><span className="material-symbols-outlined">format_size</span></button>
                <button className="p-2 rounded-full hover:bg-surface-container-low text-on-surface-variant"><span className="material-symbols-outlined">dark_mode</span></button>
                <button className="p-2 rounded-full hover:bg-surface-container-low text-on-surface-variant"><span className="material-symbols-outlined">bookmark_add</span></button>
              </>
            ) : (
              <div className="flex items-center gap-6 pl-4">
                <Link href="/login" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">Sign In</Link>
                <Link href="/register" className="bg-primary text-on-primary px-5 py-2.5 rounded-md font-label-md text-label-md hover:bg-primary-container hover:text-primary-fixed transition-colors shadow-sm">
                  Join TomeSphere
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Lower Tier (Only for Application variant) */}
      {variant === "application" && (
        <div className="h-[48px] border-t border-outline-variant/50 flex items-center w-full px-margin-desktop mx-auto">
          <nav className="flex items-center gap-10 h-full">
            <Link href="/discover" className="font-label-md text-label-md h-full flex items-center text-primary border-b-2 border-primary">Discover</Link>
            <Link href="/library" className="font-label-md text-label-md h-full flex items-center text-on-surface-variant hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary">Library</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
