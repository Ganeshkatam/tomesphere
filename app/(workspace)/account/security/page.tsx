import { createSupabaseServerClient } from "@/shared/core/database/server";
import { SecurityPageFacade } from "@/modules/account/security/application/facades/SecurityPageFacade";
import { SupabaseSecurityReadModel } from "@/modules/account/security/infrastructure/read-models/SupabaseSecurityReadModel";
import { SupabaseExportRequestRepository } from "@/modules/account/export/infrastructure/repositories/SupabaseExportRequestRepository";
import { SecurityScreen } from "@/modules/account/security/presentation/components/SecurityScreen";
import { redirect } from "next/navigation";

export default async function SecurityPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Setup Facade with dependencies
  const securityReadModel = new SupabaseSecurityReadModel(supabase);
  const exportRepo = new SupabaseExportRequestRepository(supabase);
  const facade = new SecurityPageFacade(securityReadModel, exportRepo);
  
  const dto = await facade.getSecurityPage(user.id);

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-xl font-extrabold text-slate-50 tracking-tight">Security & Data</h2>
        <p className="text-sm font-medium text-slate-400 mt-1">
          Manage your password, active sessions, and data ownership.
        </p>
      </div>
      <SecurityScreen dto={dto} userId={user.id} />
    </div>
  );
}
