import Navbar from "@/shared/navigation/components/Navbar";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-page overflow-x-hidden">
      <Navbar />
      <main className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="glass-strong p-8 sm:p-12 rounded-3xl border border-white/10">
          <h1 className="text-4xl font-display font-bold mb-6 text-white">
            Terms of Service
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            Last Updated: {new Date().toLocaleDateString()}
          </p>
          <div className="prose prose-invert prose-lg max-w-none text-slate-300 space-y-6">
            <p>
              By accessing the TomeSphere application, you agree to be bound by
              these terms of service and all applicable laws and regulations.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8">
              1. User License
            </h2>
            <p>
              Permission is granted to temporarily download one copy of the
              materials (information or software) on TomeSphere for personal,
              non-commercial transitory viewing only.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8">
              2. User Accounts
            </h2>
            <p>
              When you create an account with us, you must provide accurate,
              complete, and current information. Failure to do so constitutes a
              breach of the Terms, which may result in immediate termination of
              your account on our Service.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
