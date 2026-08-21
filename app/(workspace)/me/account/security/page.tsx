import { createSupabaseServerClient } from "@/shared/core/database/server";
import { SecurityScreen } from "@/modules/me/account/security/presentation/components/SecurityScreen";
import { SecurityPageDto } from "@/modules/me/account/security/application/dto/SecurityPageDto";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SecurityPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/sign-in");
  }

  const { data: latestExport } = await supabase
    .from("export_requests")
    .select("status, download_url, requested_at")
    .eq("user_id", user.id)
    .order("requested_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const dto: SecurityPageDto = {
    password: {
      hasPassword: true,
      lastPasswordChange: null,
    },
    exportData: latestExport
      ? {
          status: latestExport.status,
          downloadUrl: latestExport.download_url,
          requestedAt: latestExport.requested_at,
        }
      : null,
    deletion: {
      canDelete: true,
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
          Security & Access
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage your password, active sessions, GDPR data exports, and account deletion.
        </p>
      </div>

      <SecurityScreen dto={dto} userId={user.id} />
    </div>
  );
}

