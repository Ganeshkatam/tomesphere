import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";
import {
  GetPreferencesQuery,
  PreferencesReadModel,
} from "../../application/queries/GetPreferences";
import { PreferencesDto } from "../../application/dto/PreferencesPageDto";

export class SupabasePreferencesReadModel implements PreferencesReadModel {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getPreferences(query: GetPreferencesQuery): Promise<PreferencesDto> {
    const { data, error } = await this.supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", query.userId)
      .single();

    if (error || !data) {
      // Default preferences if none found
      return {
        appearance: {
          themeMode: "system",
          language: "en",
        },
        reader: {
          theme: "light",
          fontFamily: "Inter",
          fontSize: "16px",
          lineHeight: 1.6,
          pageMargins: 20,
          scrollMode: "scroll",
          dictionaryLanguage: "en",
          textAlignment: "left",
          hyphenation: false,
        },
        notifications: {
          emailAlerts: true,
          weeklyDigest: true,
          pushNotifications: true,
        },
      };
    }

    return {
      appearance: {
        themeMode: (data.theme as any) || "system",
        language: "en",
      },
      reader: {
        theme: (data.reader_theme as any) || "light",
        fontFamily: data.font_family || "Inter",
        fontSize: data.font_size?.toString() || "16px",
        lineHeight: data.line_height ?? 1.6,
        pageMargins: 20,
        scrollMode: "scroll",
        dictionaryLanguage: data.dictionary_language || "en",
        textAlignment: "left",
        hyphenation: false,
      },
      notifications: {
        emailAlerts: true,
        weeklyDigest: true,
        pushNotifications: true,
      },
    };
  }
}
