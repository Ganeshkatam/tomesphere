import { createSupabaseServerClient } from "@/shared/core/database/server";
import { getProfile } from "@/modules/user/profile/application/queries/GetProfile/handler";
import { SupabaseProfileRepository } from "@/modules/user/profile/infrastructure/repositories/SupabaseProfileRepository";
import { SupabaseNotificationReadModel } from "@/modules/user/profile/infrastructure/read-models/SupabaseNotificationReadModel";
import { GetUnreadNotificationCountQueryHandler } from "@/modules/user/profile/application/queries/GetUnreadNotificationCountQuery/handler";
import { redirect } from "next/navigation";
import { TodayLayoutShell } from "@/modules/account/presentation/components/TodayLayoutShell";

import { getProgressDashboard } from "@/modules/progress/presentation/actions/progress";

export const dynamic = "force-dynamic";

export default async function MeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profileRepo = new SupabaseProfileRepository(supabase);

  const [profileDto, progressResult] = await Promise.all([
    getProfile(profileRepo, user.id).catch(() => null),
    getProgressDashboard(),
  ]);

  const progress = progressResult.success ? progressResult.data : null;

  // Get unread notifications count
  const notificationQueryHandler = new GetUnreadNotificationCountQueryHandler(
    new SupabaseNotificationReadModel(supabase)
  );
  const unreadCount = await notificationQueryHandler.execute({ userId: user.id });

  const name = profileDto?.displayName || user.email?.split("@")[0] || "Reader";
  const avatarUrl = profileDto?.avatarUrl || null;
  const createdAt = user.created_at
    ? new Date(user.created_at).getFullYear()
    : 2025;
  const streak = progress?.streak.currentDays || 0;
  const booksRead = progress?.goals.yearlyBooksProgress || 0;

  const userSummary = {
    name,
    avatarUrl,
    memberSince: createdAt,
    streak,
    booksRead,
    unreadCount: unreadCount || 0,
  };

  return (
    <TodayLayoutShell userSummary={userSummary}>{children}</TodayLayoutShell>
  );
}
