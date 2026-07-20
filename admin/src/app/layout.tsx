import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BookOpen } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TomeSphere Admin",
  description: "Administrative backoffice for TomeSphere",
};

const catalogLinks = [
  { href: "/books", label: "Books" },
  { href: "/authors", label: "Authors" },
  { href: "/genres", label: "Genres" },
  { href: "/subjects", label: "Subjects" },
  { href: "/languages", label: "Languages" },
  { href: "/collections", label: "Collections" },
  { href: "/featured_books", label: "Featured" },
  { href: "/announcements", label: "Announcements" },
];

const opsLinks = [
  { href: "/ops", label: "System Health" },
  { href: "/ops/jobs", label: "Job Monitor" },
  { href: "/ops/outbox", label: "Outbox Monitor" },
  { href: "/ops/projections", label: "Projections" },
  { href: "/ops/search", label: "Search Diagnostics" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
            <div className="p-4 border-b border-slate-800 flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              <span className="font-semibold text-lg">TS Admin</span>
            </div>
            <nav className="flex-1 p-4 overflow-y-auto">
              {/* Catalog */}
              <div className="mb-6">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-4">
                  Catalog
                </div>
                <ul className="space-y-1">
                  {catalogLinks.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="block px-4 py-2 rounded-md hover:bg-slate-800/50 text-slate-300 font-medium transition-colors text-sm"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Operations */}
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-4">
                  Operations
                </div>
                <ul className="space-y-1">
                  {opsLinks.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="block px-4 py-2 rounded-md hover:bg-slate-800/50 text-slate-300 font-medium transition-colors text-sm"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
