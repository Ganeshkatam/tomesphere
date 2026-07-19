import Navbar from "@/shared/navigation/components/Navbar";

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-gradient-page overflow-x-hidden">
      <Navbar />
      <main className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="glass-strong p-8 sm:p-12 rounded-3xl border border-white/10">
          <h1 className="text-4xl font-display font-bold mb-6 text-white">
            TomeSphere Guidelines
          </h1>
          <div className="prose prose-invert prose-lg max-w-none text-slate-300">
            <p>
              TomeSphere is a safe, welcoming space for learning and study
              alongside other readers.
            </p>
            <h3 className="text-2xl font-bold text-white mt-8 mb-4">
              1. Be Respectful
            </h3>
            <p>
              Harassment, hate speech, and bullying are strictly prohibited.
              Treat all members with kindness, even if you disagree on a book
              review.
            </p>
            <h3 className="text-2xl font-bold text-white mt-8 mb-4">
              2. No Spoilers Without Tags
            </h3>
            <p>
              Always use spoiler tags when discussing crucial plot points.
              Don&apos;t ruin the magic for others.
            </p>
            <h3 className="text-2xl font-bold text-white mt-8 mb-4">
              3. Keep it Relevant
            </h3>
            <p>
              Focus discussions on literature, reading experiences, and related
              topics. Spam and self-promotion outside designated areas will be
              removed.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
