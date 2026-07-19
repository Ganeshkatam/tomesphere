import { createSupabaseServerClient } from "@/modules/shared/core/database/server";
import { redirect } from "next/navigation";
import MFASetup from "@/modules/authentication/components/MFASetup";

export const dynamic = "force-dynamic";

export default async function SecurityPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[var(--surface-default)] border border-[var(--border-default)] shadow-sm space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-slate-50">Security Settings</h2>
        <p className="text-sm text-slate-400 mt-1">
          Configure Multi-Factor Authentication and protect your credentials.
        </p>
      </div>

      <div className="pt-4 border-t border-[var(--border-subtle)]">
        <MFASetup />
      </div>
    </div>
  );
}
