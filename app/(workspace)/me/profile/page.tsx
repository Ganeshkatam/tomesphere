import { executeProfilePageFacade } from "@/modules/user/profile/application/facades";
import { createSupabaseServerClient } from "@/shared/core/database/server";
import { redirect } from "next/navigation";
import PrivateProfileScreen from "@/modules/account/presentation/screens/PrivateProfileScreen";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const data = await executeProfilePageFacade(user.id);

  const stats = {
    booksRead: data.progress?.goals.yearlyBooksProgress || 0,
    badges: data.badges.sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime()),
  };

  return (
    <PrivateProfileScreen
      user={user}
      initialProfile={data.profile}
      stats={stats}
    />
  );
}
