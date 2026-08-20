import { createSupabaseServerClient } from "@/shared/core/database/server";
import { SupabasePreferencesRepository } from "@/modules/me/account/preferences/infrastructure/repositories/SupabasePreferencesRepository";
import { PreferencesForm } from "@/modules/me/account/preferences/presentation/components/PreferencesForm";
import { UserId } from "@/shared/kernel/UserId";
import { redirect } from "next/navigation";
import { PreferencesDto } from "@/modules/me/account/preferences/application/dto/PreferencesPageDto";

export const dynamic = "force-dynamic";

export default async function PreferencesPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/sign-in");
  }

  const userId = UserId.create(user.id);
  const preferencesRepo = new SupabasePreferencesRepository(supabase);
  
  let preferences = await preferencesRepo.findByUserId(userId);
  if (!preferences) {
    await preferencesRepo.setupInitialPreferences(userId);
    preferences = await preferencesRepo.findByUserId(userId);
  }

  const preferencesDto: PreferencesDto = {
    appearance: {
      themeMode: preferences!.appearance.themeMode,
      language: preferences!.appearance.language,
    },
    reader: {
      theme: preferences!.reader.theme,
      fontFamily: preferences!.reader.fontFamily,
      fontSize: preferences!.reader.fontSize,
      lineHeight: preferences!.reader.lineHeight,
      pageMargins: preferences!.reader.pageMargins,
      scrollMode: preferences!.reader.scrollMode,
      dictionaryLanguage: preferences!.reader.dictionaryLanguage,
      textAlignment: preferences!.reader.textAlignment,
      hyphenation: preferences!.reader.hyphenation,
    },
    notifications: {
      emailAlerts: preferences!.notifications.emailAlerts,
      weeklyDigest: preferences!.notifications.weeklyDigest,
      pushNotifications: preferences!.notifications.pushNotifications,
    },
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">App Preferences</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Customize your reading experience and notifications.</p>
      
      <PreferencesForm preferences={preferencesDto} />
    </div>
  );
}
