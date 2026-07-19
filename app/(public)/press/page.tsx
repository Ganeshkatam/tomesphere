import Navbar from "@/modules/shared/navigation/components/Navbar";

export default function PressPage() {
  return (
    <div className="min-h-screen bg-gradient-page overflow-x-hidden">
      <Navbar />
      <main className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="glass-strong p-8 sm:p-12 rounded-3xl border border-white/10">
          <h1 className="text-4xl font-display font-bold mb-6 text-white">
            Press & Media
          </h1>
          <div className="prose prose-invert prose-lg max-w-none text-slate-300">
            <p>Welcome to the TomeSphere press room.</p>
            <p>
              For press inquiries, media kits, or interview requests, please
              reach out to our communications team.
            </p>
            <p>Email: press@tomesphere.app</p>
          </div>
        </div>
      </main>
    </div>
  );
}
