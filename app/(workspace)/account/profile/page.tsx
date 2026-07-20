import { createSupabaseServerClient } from "@/shared/core/database/server";
import { SupabaseProfileRepository } from "@/modules/user/profile/infrastructure/repositories/SupabaseProfileRepository";
import { getProfile } from "@/modules/user/profile/application/queries/GetProfile/handler";
import { ProfileEditForm } from "@/modules/user/profile/presentation/components/ProfileEditForm";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const repo = new SupabaseProfileRepository(supabase);
  const profileDto = await getProfile(repo, user.id);

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-xl font-extrabold text-slate-50 tracking-tight">Public Profile</h2>
        <p className="text-sm font-medium text-slate-400 mt-1">
          This information will be displayed publicly across the platform.
        </p>
      </div>
      <ProfileEditForm profile={profileDto} userEmail={user.email ?? ""} />
    </div>
  );
}
