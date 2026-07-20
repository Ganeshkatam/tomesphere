import React from "react";

export function AppHeader({ className = "", isLoggedIn = false }: { className?: string; isLoggedIn?: boolean }) {
  return (
    <header className={`fixed top-0 z-50 w-full bg-surface dark:bg-surface-dim border-b border-outline-variant dark:border-outline flex flex-col transition-transform duration-300 ${className}`} id="top-nav">
      {/* Upper Tier */}
      <div className="h-[72px] flex items-center w-full px-margin-desktop mx-auto">
        <div className="flex justify-between items-center w-full gap-8">
          {/* Logo */}
          <a className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed flex items-center gap-2 flex-shrink-0" href="#">
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
            <span>TomeSphere</span>
          </a>
          {/* Global Search (Focal Point) */}
          <div className="flex-1 max-w-2xl">
            <div className="relative flex items-center bg-surface-container-low dark:bg-tertiary-container border border-outline-variant rounded-full px-5 py-2.5 transition-all duration-300 search-focus-effect focus-within:border-primary">
              <span className="material-symbols-outlined text-on-surface-variant mr-3">search</span>
              <input className="bg-transparent border-none focus:outline-none w-full text-body-md font-body-md placeholder:text-on-tertiary-container" placeholder="Search digital archives, manuscripts, or researchers..." type="text" />
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded border border-outline-variant text-[10px] font-medium text-on-surface-variant bg-surface">
                <span className="material-symbols-outlined text-[12px] leading-none">search</span>
              </kbd>
            </div>
          </div>
          {/* Right Utilities */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {isLoggedIn ? (
              <>
                <button className="p-2 rounded-full hover:bg-surface-container-low dark:hover:bg-tertiary-container transition-all duration-200 text-on-surface-variant">
                  <span className="material-symbols-outlined">notifications</span>
                </button>
                <div className="h-8 w-px bg-outline-variant mx-2 hidden sm:block"></div>
                <button className="flex items-center gap-3 p-1 pl-1 pr-3 rounded-full border border-outline-variant hover:border-primary transition-all group">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant">
                    <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuABEn9pS6MT7oissUxl3d4jGTCYcJTDX5tqfbiWMmHcUL_oKgE4-e7InM1xLZTaFjbQyanYjta4Mx2CwEQ4Nt675sqNc8Q9bPFhi2KaYVUD2BbM62ZGoB5bYVcoUuxT_ccTJd5P2HM_WbMbMPDyBKuxUO4m1ZXyV9ykzL_zl_2RNxv2QgJJn82k63VybRHqivDzdntGhJ_FP-4NMncVQN8wvg7JotI4tOjUgZ5-eJ1DKa9RV7YivHHOPipjXM-Zi4KqlA5H8NenUrU" alt="Profile" />
                  </div>
                  <span className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors hidden sm:block">My Profile</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-6 pl-4">
                <a href="#" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">Sign In</a>
                <button className="bg-primary text-on-primary px-5 py-2.5 rounded-md font-label-md text-label-md hover:bg-primary-container hover:text-primary-fixed transition-colors shadow-sm">
                  Join TomeSphere
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Lower Tier */}
      <div className="h-[48px] border-t border-outline-variant/50 flex items-center w-full px-margin-desktop mx-auto">
        <nav className="flex items-center gap-10 h-full">
          <a className="font-label-md text-label-md h-full flex items-center text-primary border-b-2 border-primary" href="#">Discover</a>
          <a className="font-label-md text-label-md h-full flex items-center text-on-surface-variant hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary" href="#">Library</a>
        </nav>
      </div>
    </header>
  );
}
