import { createSupabaseServerClient } from "@/shared/core/database/server";
import { SecurityScreen } from "@/modules/me/account/security/presentation/components/SecurityScreen";
import { SecurityPageDto } from "@/modules/me/account/security/application/dto/SecurityPageDto";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security & Authentication",
};

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

  const dto: SecurityPageDto = {
    password: {
      hasPassword: true,
      lastPasswordChange: null,
    },
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
          Manage your password, active sessions, and account credentials.
        </p>
      </div>

      <SecurityScreen dto={dto} userId={user.id} />
    </div>
  );
}
