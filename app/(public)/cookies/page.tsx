
export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gradient-page overflow-x-hidden">      <main className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="glass-strong p-8 sm:p-12 rounded-3xl border border-[var(--border-default)]">
          <h1 className="text-4xl font-display font-bold mb-6 text-white">
            Cookie Policy
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            Last Updated: {new Date().toLocaleDateString()}
          </p>
          <div className="prose prose-invert prose-lg max-w-none text-slate-300 space-y-6">
            <p>
              This Cookie Policy explains how TomeSphere uses cookies and
              similar technologies to recognize you when you visit our
              application.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8">
              What are cookies?
            </h2>
            <p>
              Cookies are small data files that are placed on your computer or
              mobile device when you visit a website. Cookies are widely used by
              online service providers in order to make their websites or
              services work, or to work more efficiently, as well as to provide
              reporting information.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8">
              Why do we use cookies?
            </h2>
            <p>
              We use essential cookies strictly necessary to make our site work
              (like authenticating your login sessions). We also use performance
              and analytics cookies to understand how you interact with our
              platform so we can improve the reading experience.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

