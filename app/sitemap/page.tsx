import Link from "next/link";

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-[var(--surface-canvas)] overflow-x-hidden">
      <main className="pt-8 pb-16 sm:pt-10 sm:pb-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-[var(--surface-default)] p-8 sm:p-12 rounded-3xl border border-[var(--border-default)] shadow-sm">
          <h1 className="text-4xl font-display font-bold mb-8 text-[var(--text-primary)]">
            Sitemap
          </h1>

          <div className="grid sm:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Core Pages</h2>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/discover"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                  >
                    Explore Books
                  </Link>
                </li>
                <li>
                  <Link
                    href="/me/mylibrary"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                  >
                    My Library
                  </Link>
                </li>
                <li>
                  <Link
                    href="/discover/featured"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                  >
                    Featured Books
                  </Link>
                </li>
                <li>
                  <Link
                    href="/discover/trending"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                  >
                    Trending Books
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                Company & Legal
              </h2>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/about"
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookies"
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline"
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
