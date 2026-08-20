import { createSupabaseServerClient } from "@/shared/core/database/server";
import { SupabaseNotificationPreferencesRepository } from "@/modules/me/account/notifications/infrastructure/repositories/SupabaseNotificationPreferencesRepository";
import {
  NotificationsForm,
  NotificationPreferencesDto,
} from "@/modules/me/account/notifications/presentation/components/NotificationsForm";
import { redirect } from "next/navigation";
import { UserId } from "@/shared/kernel/UserId";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/sign-in");
  }

  const repo = new SupabaseNotificationPreferencesRepository(supabase);
  const userId = UserId.create(user.id);
  const preferences = await repo.findByUserId(userId);

  const initialDto: NotificationPreferencesDto = {
    readingRemindersEnabled: preferences?.readingRemindersEnabled ?? false,
    recommendationsEnabled: preferences?.recommendationsEnabled ?? false,
    weeklyDigestEnabled: preferences?.weeklyDigestEnabled ?? false,
    systemAnnouncementsEnabled: preferences?.systemAnnouncementsEnabled ?? false,
  };

  return (
    <div>
      <NotificationsForm initialValues={initialDto} />
    </div>
  );
}
