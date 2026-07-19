import Navbar from "@/shared/navigation/components/Navbar";

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gradient-page overflow-x-hidden">
      <Navbar />
      <main className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="glass-strong p-8 sm:p-12 rounded-3xl border border-white/10">
          <h1 className="text-4xl font-display font-bold mb-6 text-white">
            Careers
          </h1>
          <div className="prose prose-invert prose-lg max-w-none text-slate-300">
            <p>Join us in building the future of reading.</p>
            <p>
              We are a remote-first team of engineers, designers, and book
              lovers. We are always looking for passionate individuals to help
              us scale TomeSphere to millions of readers worldwide.
            </p>
            <p className="mt-8 text-indigo-400 font-medium">
              There are currently no open positions, but check back soon!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
