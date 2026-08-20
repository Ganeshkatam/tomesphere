import { createSupabaseServerClient } from "@/shared/core/database/server";
import { SecurityForm } from "@/modules/me/account/security/presentation/components/SecurityForm";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SecurityPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/sign-in");
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Security</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Manage your password and authentication methods.</p>
      
      <SecurityForm />
    </div>
  );
}
