"use server";

import { z } from "zod";
import { ServerActionResult } from "@/lib/actions/action-result";
import { createSupabaseServerClient } from "@/shared/core/database/server";
import { SupabasePreferencesRepository } from "../../infrastructure/repositories/SupabasePreferencesRepository";
import { revalidatePath } from "next/cache";
import { UserId } from "@/shared/kernel/UserId";
import { PreferencesDto } from "../../application/dto/PreferencesPageDto";

const PreferencesUpdateSchema = z.object({
  appearance: z.object({
    themeMode: z.enum(["light", "dark", "system"]),
    language: z.enum(["en", "es", "fr", "de"]).catch("en"),
  }),
  reader: z.object({
    theme: z.enum(["light", "dark", "sepia"]),
    fontFamily: z.string().max(50),
    fontSize: z.string().max(20),
    lineHeight: z.number().min(0.5).max(5),
    pageMargins: z.number().min(0).max(100),
    scrollMode: z.enum(["scroll", "paginated"]),
    dictionaryLanguage: z.string().max(10),
    textAlignment: z.enum(["left", "justify"]),
    hyphenation: z.boolean(),
  }),
  notifications: z.object({
    emailAlerts: z.boolean(),
    weeklyDigest: z.boolean(),
    pushNotifications: z.boolean(),
  })
});

export async function updatePreferencesAction(
  data: PreferencesDto
): Promise<ServerActionResult<void>> {
  try {
    // 1. Strict Validation
    const validatedData = PreferencesUpdateSchema.parse(data);

    const supabase = await createSupabaseServerClient();
    
    // 2. Authenticated user authorization
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: { message: "Unauthorized. Please log in." } };
    }

    const userId = UserId.create(user.id);
    const preferencesRepo = new SupabasePreferencesRepository(supabase);
    
    let preferences = await preferencesRepo.findByUserId(userId);
    if (!preferences) {
      await preferencesRepo.setupInitialPreferences(userId);
      preferences = await preferencesRepo.findByUserId(userId);
      if (!preferences) throw new Error("Failed to initialize preferences.");
    }

    // 3. Update Domain Entity safely
    preferences.updateAppearance(validatedData.appearance);
    preferences.updateReader(validatedData.reader);
    preferences.updateNotifications(validatedData.notifications);

    // 4. Save to Repository
    await preferencesRepo.save(preferences);

    // 5. Revalidate cache
    revalidatePath("/me/account/preferences");
    revalidatePath("/", "layout");

    return { success: true, data: undefined };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, error: { message: "Invalid preference values provided." } };
    }
    return { success: false, error: { message: error.message || "Failed to update preferences." } };
  }
}

