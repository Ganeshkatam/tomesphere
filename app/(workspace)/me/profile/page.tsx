import { createSupabaseServerClient } from "@/modules/shared/core/database/server";
import { getProfile } from "@/modules/user/profile/application/queries/GetProfile/handler";
import { SupabaseProfileRepository } from "@/modules/user/profile/infrastructure/repositories/SupabaseProfileRepository";
import { redirect } from "next/navigation";
import PrivateProfileScreen from "@/modules/me/presentation/screens/PrivateProfileScreen";
import { getProgressDashboard } from "@/modules/user/progress/presentation/actions/progress";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profileRepo = new SupabaseProfileRepository(supabase);
  const [profileDto, progressResult, { data: achievementsData }] = await Promise.all([
    getProfile(profileRepo, user.id).catch(() => null),
    getProgressDashboard(),
    supabase
      .from("user_achievements")
      .select("earned_at, achievements(id, name, description, badge_icon, points)")
      .eq("user_id", user.id),
  ]);

  const progress = progressResult.success ? progressResult.data : null;

  const badges = achievementsData
    ?.map((ua: any) => ({
      id: ua.achievements?.id,
      name: ua.achievements?.name,
      description: ua.achievements?.description,
      icon: ua.achievements?.badge_icon,
      points: ua.achievements?.points,
      earnedAt: ua.earned_at,
    }))
    .filter((b: any) => b.id)
    .sort((a: any, b: any) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime()) || [];

  const stats = {
    booksRead: progress?.goals.yearlyBooksProgress || 0,
    badges,
  };

  return (
    <PrivateProfileScreen
      user={user}
      initialProfile={profileDto}
      stats={stats}
    />
  );
}
