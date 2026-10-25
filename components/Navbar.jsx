'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Sun, Moon, Menu, X, Layers } from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/updates', label: 'Updates' },
  { href: '/offers', label: 'Offers' },
  { href: '/about', label: 'About' },
  { href: '/guestbook', label: 'Guestbook' },
  { href: '/contact', label: 'Contact' }
];

export default function Navbar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState('dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const activeTheme = localStorage.getItem('site-theme') || document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(activeTheme);
    document.documentElement.setAttribute('data-theme', activeTheme);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('site-theme', nextTheme);
  };

  return (
    <>
      <header className="site-header">
        <div className="brand-wrapper">
          <Link href="/" className="brand-monogram" aria-label="TomeSphere Homepage">
            <Image
              src="/assets/tomesphere-logo-mark.png"
              alt="TomeSphere Logo"
              width={24}
              height={24}
              className="brand-monogram-img"
              priority
            />
          </Link>
          <div>
            <Link href="/" className="brand-name">
              TomeSphere
            </Link>
          </div>
        </div>

        <nav className="nav-desktop" aria-label="Main Navigation">
          {NAV_LINKS.map(link => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="nav-actions">
          <button
            type="button"
            className="btn-icon-round"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <button
            type="button"
            className="btn-icon-round btn-menu-mobile"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="mobile-nav-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div id="mobile-navigation" className="mobile-nav-drawer" role="dialog" aria-modal="true" aria-label="Mobile navigation" onClick={e => e.stopPropagation()}>
            <div className="mobile-nav-header">
              <div>
                <span className="brand-name">TomeSphere</span>
                <div className="brand-tag">Independent digital studio · tomesphere.in</div>
              </div>
              <button
                type="button"
                className="btn-icon-round"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>
            <nav className="mobile-nav-links">
              {NAV_LINKS.map(link => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mobile-nav-footer">
              <button
                type="button"
                className="mobile-theme-toggle-btn"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                <span>{theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
