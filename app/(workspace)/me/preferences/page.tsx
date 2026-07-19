import { createSupabaseServerClient } from "@/shared/core/database/server";
import { getProfile } from "@/modules/user/profile/application/queries/GetProfile/handler";
import { SupabaseProfileRepository } from "@/modules/user/profile/infrastructure/repositories/SupabaseProfileRepository";
import { redirect } from "next/navigation";
import PreferencesScreen from "@/modules/account/presentation/screens/PreferencesScreen";

export const dynamic = "force-dynamic";

export default async function PreferencesPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profileRepo = new SupabaseProfileRepository(supabase);
  const profileDto = await getProfile(profileRepo, user.id).catch(() => null);

  return <PreferencesScreen initialProfile={profileDto} />;
}
