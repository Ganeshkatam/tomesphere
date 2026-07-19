"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BookOpen, Check, LayoutGrid } from "lucide-react";
import { useState } from "react";

const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Mission", href: "/mission" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

const SUPPORT_LINKS = [
  { label: "Help Center", href: "/support" },
  { label: "Guidelines", href: "/guidelines" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookies", href: "/cookies" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  const shouldHideFooter = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/verify-password",
    "/login-phone",
    "/home",
    "/library",
    "/notes",
    "/citations",
    "/exam-prep",
    "/academic",
    "/profile",
    "/profile-setup",
    "/read",
    "/books",
    "/discover/search",
    "/discover",
    "/me",
  ].some((route) => pathname === route || pathname?.startsWith(route + "/"));

  if (shouldHideFooter) return null;

  return (
    <>
      <footer className="relative overflow-hidden">
        {/* Top glow border */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

        {/* Background */}
        <div className="absolute inset-0 bg-[var(--surface-canvas)] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/4 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative w-full max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16">
          {/* ── Zone 1: Brand + Columns ── */}
          <div className="pt-20 pb-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Column */}
            <div className="flex flex-col gap-6 lg:col-span-2">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 group w-fit">
                <span className="group-hover:scale-105 transition-transform">
                  <Image src="/logo.png" alt="TomeSphere" width={48} height={48} priority />
                </span>
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
                Discover, read, organize, and understand books through a focused reading experience designed for students and lifelong learners.
              </p>

              {/* Brand promises */}
              <ul className="space-y-2">
                {["Distraction-free reading", "Personal library", "Reading insights"].map(
                  (item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-slate-400 text-sm"
                    >
                      <span className="w-4 h-4 rounded-full bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                        <Check
                          size={9}
                          className="text-indigo-400"
                          strokeWidth={3}
                        />
                      </span>
                      {item}
                    </li>
                  ),
                )}
              </ul>

              {/* Tagline badge and Features Button */}
              <div className="flex items-center gap-4 mt-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/8 text-xs text-slate-500 w-fit">
                  <BookOpen size={11} className="text-indigo-400" />
                  Read • Learn • Remember
                </div>
              </div>
            </div>

            {/* Company Column */}
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em] mb-5">
                Company
              </p>
              <ul className="space-y-3">
                {COMPANY_LINKS.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-slate-400 hover:text-[var(--text-primary)] text-sm transition-colors duration-200 hover:translate-x-0.5 inline-block"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em] mb-5">
                Support
              </p>
              <ul className="space-y-3">
                {SUPPORT_LINKS.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-slate-400 hover:text-[var(--text-primary)] text-sm transition-colors duration-200 hover:translate-x-0.5 inline-block"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>


          {/* ── Bottom Bar ── */}
          <div className="py-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <span>© {currentYear} TomeSphere</span>
            <div className="flex items-center gap-5">
              <Link
                href="/privacy"
                className="hover:text-slate-50 transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="hover:text-slate-50 transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/cookies"
                className="hover:text-slate-50 transition-colors"
              >
                Cookies
              </Link>
              <Link
                href="/sitemap"
                className="hover:text-slate-50 transition-colors"
              >
                Sitemap
              </Link>
            </div>
            <span className="text-slate-600">Read • Learn • Remember</span>
          </div>
        </div>

        {/* Scroll to top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 w-10 h-10 bg-indigo-600/80 hover:bg-indigo-600 backdrop-blur-xl text-white rounded-full shadow-lg transition-all hover:scale-110 border border-white/10 flex items-center justify-center"
          aria-label="Scroll to top"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      </footer>
    </>
  );
}
