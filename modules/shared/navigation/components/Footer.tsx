'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Check } from 'lucide-react';

const PRODUCT_LINKS = [
  { label: 'Explore Books', href: '/discover' },
  { label: 'Immersive Reader', href: '/read' },
  { label: 'My Library', href: '/library' },
  { label: 'Study Tools', href: '/exam-prep' },
  { label: 'Search', href: '/search' },
  { label: 'Knowledge Insights', href: '/dashboard' },
];

const SUPPORT_LINKS = [
  { label: 'Help & Support', href: '/support' },
  { label: 'Guidelines', href: '/guidelines' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Contact', href: '/contact' },
  { label: 'Sitemap', href: '/sitemap' },
];

const COMPANY_LINKS = [
  { label: 'About TomeSphere', href: '/about' },
  { label: 'Our Mission', href: '/mission' },
  { label: 'Careers', href: '/careers' },
  { label: 'Press & Media', href: '/press' },
];

const STATS = [
  { value: '5', label: 'Study Tools' },
  { value: '138', label: 'Subjects Covered' },
  { value: '3', label: 'Citation Formats' },
  { value: '∞', label: 'Knowledge to Gain' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  const shouldHideFooter = [
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/verify-password',
    '/login-phone',
    '/home',
    '/library',
    '/notes',
    '/citations',
    '/exam-prep',
    '/analytics',
    '/academic',
    '/dashboard',
    '/profile',
    '/profile-setup',
    '/read',
    '/books',
    '/search',
    '/discover'
  ].some(route => pathname === route || pathname?.startsWith(route + '/'));

  if (shouldHideFooter) return null;

  return (
    <footer className="relative overflow-hidden">
      {/* Top glow border */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

      {/* Background */}
      <div className="absolute inset-0 bg-[var(--surface-canvas)] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/4 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16">

        {/* ── Zone 1: Brand + Columns ── */}
        <div className="pt-20 pb-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12">

          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <span className="text-4xl group-hover:scale-105 transition-transform">📚</span>
              <div>
                <span className="text-xl font-display font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                  TomeSphere
                </span>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-0.5">
                  Built for Learners
                </p>
              </div>
            </Link>

            {/* Mission statement */}
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              The knowledge system built for curious minds. Read, annotate, retain, and grow — all in one distraction-free interface.
            </p>

            {/* Brand promises */}
            <ul className="space-y-2">
              {['Read smarter', 'Organise knowledge', 'Learn faster'].map(item => (
                <li key={item} className="flex items-center gap-2.5 text-slate-400 text-sm">
                  <span className="w-4 h-4 rounded-full bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                    <Check size={9} className="text-indigo-400" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            {/* Tagline badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/8 text-xs text-slate-500 w-fit">
              <BookOpen size={11} className="text-indigo-400" />
              Read • Learn • Remember
            </div>

                     <div className="flex items-center gap-3 pt-1">
              {/* X / Twitter */}
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[var(--surface-default)] border border-[var(--border-default)] hover:bg-[var(--surface-overlay)] hover:border-indigo-500/30 flex items-center justify-center text-slate-400 hover:text-slate-50 transition-all">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* GitHub */}
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[var(--surface-default)] border border-[var(--border-default)] hover:bg-[var(--surface-overlay)] hover:border-indigo-500/30 flex items-center justify-center text-slate-400 hover:text-slate-50 transition-all">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              {/* Instagram */}
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[var(--surface-default)] border border-[var(--border-default)] hover:bg-[var(--surface-overlay)] hover:border-indigo-500/30 flex items-center justify-center text-slate-400 hover:text-slate-50 transition-all">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em] mb-5">Product</p>
            <ul className="space-y-3">
              {PRODUCT_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href}
                    className="text-slate-400 hover:text-[var(--text-primary)] text-sm transition-colors duration-200 hover:translate-x-0.5 inline-block">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em] mb-5">Company</p>
            <ul className="space-y-3">
              {COMPANY_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href}
                    className="text-slate-400 hover:text-[var(--text-primary)] text-sm transition-colors duration-200 hover:translate-x-0.5 inline-block">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em] mb-5">Support</p>
            <ul className="space-y-3">
              {SUPPORT_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href}
                    className="text-slate-400 hover:text-[var(--text-primary)] text-sm transition-colors duration-200 hover:translate-x-0.5 inline-block">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Zone 2: Product Stats ── */}
        <div className="py-8 border-t border-[var(--border-subtle)]">
          <div className="glass-strong bg-slate-900/40 backdrop-blur-md rounded-2xl border border-[var(--border-default)] p-6 md:py-8 max-w-4xl mx-auto shadow-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
              {STATS.map(({ value, label }) => (
                <div key={label} className="flex flex-col items-center justify-center text-center">
                  <span className="text-2xl sm:text-3xl font-bold font-display leading-none mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-300 dark:to-purple-300 bg-clip-text text-transparent">
                    {value}
                  </span>
                  <span className="text-slate-400 uppercase tracking-widest text-[9px] font-semibold">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
 
        {/* ── Bottom Bar ── */}
        <div className="py-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>© {currentYear} TomeSphere. All rights reserved.</span>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-slate-50 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-50 transition-colors">Terms</Link>
            <Link href="/cookies" className="hover:text-slate-50 transition-colors">Cookies</Link>
            <Link href="/sitemap" className="hover:text-slate-50 transition-colors">Sitemap</Link>
          </div>
          <span className="text-slate-600">Read • Learn • Remember</span>
        </div>

      </div>

      {/* Scroll to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 z-50 w-10 h-10 bg-indigo-600/80 hover:bg-indigo-600 backdrop-blur-xl text-white rounded-full shadow-lg transition-all hover:scale-110 border border-white/10 flex items-center justify-center"
        aria-label="Scroll to top"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  );
}
