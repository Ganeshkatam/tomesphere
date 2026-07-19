import Navbar from "@/modules/shared/navigation/components/Navbar";

export default function MissionPage() {
  return (
    <div className="min-h-screen bg-gradient-page overflow-x-hidden">
      <Navbar />
      <main className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="glass-strong p-8 sm:p-12 rounded-3xl border border-white/10">
          <h1 className="text-4xl font-display font-bold mb-6 text-white">
            Our Mission
          </h1>
          <div className="prose prose-invert prose-lg max-w-none text-slate-300">
            <p>
              At TomeSphere, our mission is to redefine how humanity interacts
              with literature.
            </p>
            <p>
              We believe that books hold the collective wisdom, imagination, and
              empathy of our species. By combining cutting-edge artificial
              intelligence with a passionate global community, we are building a
              sanctuary where every reader can find their next great adventure.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
