import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";
import { PreferencesRepository } from "../../domain/repositories/PreferencesRepository";
import { UserPreferences } from "../../domain/entities/UserPreferences";
import { UserId } from "@/shared/kernel/UserId";

export class SupabasePreferencesRepository implements PreferencesRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async findByUserId(userId: UserId): Promise<UserPreferences | null> {
    const { data, error } = await this.supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", userId.value)
      .single();

    if (error || !data) {
      return null;
    }

    return UserPreferences.fromPersistence(
      data.user_id, // using user_id as aggregate id for now since it's 1-1
      data.user_id,
      {
        themeMode: (data.theme as any) || "system",
        language: "en", // V1 default
      },
      {
        theme: (data.reader_theme as any) || "light",
        fontFamily: data.font_family || "Inter",
        fontSize: data.font_size?.toString() || "16px",
        lineHeight: data.line_height ?? 1.6,
        pageMargins: 20, // Not in schema anymore, default
        scrollMode: "scroll",
        dictionaryLanguage: data.dictionary_language || "en",
        textAlignment: "left",
        hyphenation: false,
      },
      {
        emailAlerts: true,
        weeklyDigest: true,
        pushNotifications: true,
      },
      data.updated_at ? new Date(data.updated_at) : new Date(),
    );
  }

  async save(preferences: UserPreferences): Promise<void> {
    const { error } = await this.supabase.from("user_preferences").upsert(
      {
        user_id: preferences.userId.value,
        theme: preferences.appearance.themeMode,
        reader_theme: preferences.reader.theme,
        font_family: preferences.reader.fontFamily,
        font_size: parseInt(preferences.reader.fontSize) || 16,
        line_height: preferences.reader.lineHeight,
        dictionary_language: preferences.reader.dictionaryLanguage,
        updated_at: preferences.updatedAt.toISOString(),
      },
      { onConflict: "user_id" },
    );

    if (error) {
      throw new Error(`Failed to save preferences: ${error.message}`);
    }
  }

  async setupInitialPreferences(userId: UserId): Promise<void> {
    const prefs = UserPreferences.create(userId.value, userId.value);
    await this.save(prefs);
  }
}
