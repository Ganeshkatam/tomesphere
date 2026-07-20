
export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-page overflow-x-hidden">      <main className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="glass-strong p-8 sm:p-12 rounded-3xl border border-white/10">
          <h1 className="text-4xl font-display font-bold mb-6 text-white">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            Last Updated: {new Date().toLocaleDateString()}
          </p>
          <div className="prose prose-invert prose-lg max-w-none text-slate-300 space-y-6">
            <p>
              Your privacy is important to us. It is TomeSphere&apos;s policy to
              respect your privacy regarding any information we may collect from
              you across our website and application.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8">
              Information We Collect
            </h2>
            <p>
              We only ask for personal information when we truly need it to
              provide a service to you. We collect it by fair and lawful means,
              with your knowledge and consent. The information we collect
              includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Account information (email, name, profile picture)</li>
              <li>
                Reading history and preferences (to power curated
                recommendations)
              </li>
              <li>Reviews and community interactions</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mt-8">
              How We Use Information
            </h2>
            <p>
              We use the collected data to provide, maintain, and improve our
              services, including personalizing your reading recommendations and
              facilitating community interactions.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

