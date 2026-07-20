import { createSupabaseServerClient } from "@/shared/core/database/server";
import { SupabasePreferencesReadModel } from "@/modules/account/preferences/infrastructure/read-models/SupabasePreferencesReadModel";
import { PreferencesForm } from "@/modules/account/preferences/presentation/components/PreferencesForm";
import { redirect } from "next/navigation";

export default async function PreferencesPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Use CQRS read model to get the DTO
  const readModel = new SupabasePreferencesReadModel(supabase);
  const dto = await readModel.getPreferences({ userId: user.id });

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-xl font-extrabold text-slate-50 tracking-tight">Preferences</h2>
        <p className="text-sm font-medium text-slate-400 mt-1">
          Customize your experience across the TomeSphere platform.
        </p>
      </div>
      <PreferencesForm preferences={dto} />
    </div>
  );
}
