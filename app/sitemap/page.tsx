import Link from "next/link";

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-gradient-page overflow-x-hidden">      <main className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="glass-strong p-8 sm:p-12 rounded-3xl border border-[var(--border-default)]">
          <h1 className="text-4xl font-display font-bold mb-8 text-white">
            Sitemap
          </h1>

          <div className="grid sm:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Core Pages</h2>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/"
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    Home / Landing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/discover"
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    Explore Books
                  </Link>
                </li>
                <li>
                  <Link
                    href="/library"
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    My Library
                  </Link>
                </li>
                <li>
                  <Link
                    href="/community"
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    Community Hub
                  </Link>
                </li>
                <li>
                  <Link
                    href="/academic"
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    Student Resources
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Company & Legal
              </h2>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/about"
                    className="text-slate-300 hover:text-white"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-slate-300 hover:text-white"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-slate-300 hover:text-white"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-slate-300 hover:text-white"
                  >
                    Terms of Service
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

