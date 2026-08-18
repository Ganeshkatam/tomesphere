
export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-page overflow-x-hidden">      <main className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="glass-strong p-8 sm:p-12 rounded-3xl border border-[var(--border-default)]">
          <h1 className="text-4xl font-display font-bold mb-6 text-white">
            Contact Us
          </h1>
          <div className="prose prose-invert prose-lg max-w-none text-slate-300">
            <p>We&apos;d love to hear from you!</p>
            <p>
              Whether you have a question about features, pricing, or anything
              else, our team is ready to answer all your questions.
            </p>
            <ul className="mt-6 space-y-2">
              <li>
                <strong>General Support:</strong> support@tomesphere.app
              </li>
              <li>
                <strong>Partnerships:</strong> partners@tomesphere.app
              </li>
              <li>
                <strong>Feedback:</strong> feedback@tomesphere.app
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

