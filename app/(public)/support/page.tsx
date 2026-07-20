import { createSupabaseServerClient } from "@/shared/core/database/server";
import { Mail, MessageCircle, HelpCircle } from "lucide-react";
import { GetFaqsQueryHandler } from "@/modules/support/application/queries/GetFaqs/handler";
import { SupabaseSupportReadModel } from "@/modules/support/infrastructure/read-models/SupabaseSupportReadModel";

export const revalidate = 3600; // Cache for 1 hour

export default async function SupportPage() {
  const supabase = await createSupabaseServerClient();
  const repo = new SupabaseSupportReadModel(supabase);
  const handler = new GetFaqsQueryHandler(repo);

  // Fetch FAQs from database
  const faqs = await handler.execute();

  // Group FAQs by category
  const groupedFaqs =
    faqs?.reduce((acc: any, faq: any) => {
      const category = faq.category || "General";
      if (!acc[category]) acc[category] = [];
      acc[category].push(faq);
      return acc;
    }, {}) || {};

  return (
    <div className="min-h-screen bg-gradient-page overflow-x-hidden">
      <main className="pt-32 pb-20 max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-4 bg-indigo-500/10 rounded-2xl mb-6 ring-1 ring-indigo-500/20">
            <HelpCircle className="w-10 h-10 text-indigo-400" />
          </div>
          <h1 className="text-5xl font-display font-bold mb-6 text-white tracking-tight">
            How can we help?
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Search our knowledge base or browse categories below to find exactly
            what you&apos;re looking for.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* FAQ Section */}
          <div className="lg:col-span-2 space-y-12">
            {Object.entries(groupedFaqs).map(
              ([category, items]: [string, any]) => (
                <div key={category} className="space-y-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <span className="w-8 h-px bg-indigo-500/50"></span>
                    {category}
                  </h2>
                  <div className="space-y-4">
                    {items.map((faq: any) => (
                      <details
                        key={faq.id}
                        className="group glass-card rounded-2xl border border-white/5 overflow-hidden transition-all duration-300 hover:border-indigo-500/30 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)] open:border-indigo-500/30 open:shadow-[0_0_20px_rgba(99,102,241,0.1)]"
                      >
                        <summary className="flex items-center justify-between p-6 cursor-pointer select-none">
                          <h3 className="text-lg font-medium text-slate-200 group-hover:text-white transition-colors pr-6">
                            {faq.question}
                          </h3>
                          <div className="relative w-6 h-6 flex-shrink-0 flex items-center justify-center">
                            <div className="absolute w-4 h-0.5 bg-indigo-400 rounded-full transition-transform duration-300 group-open:rotate-180" />
                            <div className="absolute w-0.5 h-4 bg-indigo-400 rounded-full transition-transform duration-300 group-open:-rotate-90" />
                          </div>
                        </summary>
                        <div className="px-6 pb-6 pt-2 text-slate-400 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                          {faq.answer}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              ),
            )}

            {(!faqs || faqs.length === 0) && (
              <div className="text-center py-12 glass-strong rounded-3xl border border-white/5">
                <p className="text-slate-400">
                  No FAQs available at the moment.
                </p>
              </div>
            )}
          </div>

          {/* Contact Sidebar */}
          <div className="space-y-6">
            <div className="glass-strong rounded-3xl p-8 border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

              <h3 className="text-xl font-bold text-white mb-4">
                Still need help?
              </h3>
              <p className="text-slate-400 mb-8">
                Can&apos;t find the answer you&apos;re looking for? Our support
                team is here to help.
              </p>

              <div className="space-y-4">
                <a
                  href="mailto:support@tomesphere.app"
                  className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all group"
                >
                  <Mail className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                  Email Support
                </a>
                <button className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-medium transition-all shadow-lg shadow-indigo-500/25 group">
                  <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Live Chat
                </button>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-8 border border-white/5">
              <h3 className="text-lg font-medium text-white mb-2">
                Response Time
              </h3>
              <p className="text-sm text-slate-400">
                We typically reply within{" "}
                <span className="text-indigo-400 font-medium">24 hours</span>{" "}
                during business days.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}

