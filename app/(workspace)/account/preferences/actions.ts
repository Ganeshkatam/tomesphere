"use server";

import { createSupabaseServerClient } from "@/shared/core/database/server";
import { updatePreferencesSchema, UpdatePreferencesInput } from "@/modules/account/preferences/application/validators/updatePreferencesSchema";
import { UpdatePreferencesHandler } from "@/modules/account/preferences/application/commands/UpdatePreferences/handler";
import { SupabasePreferencesRepository } from "@/modules/account/preferences/infrastructure/repositories/SupabasePreferencesRepository";
import { revalidatePath } from "next/cache";

export async function updatePreferencesAction(data: UpdatePreferencesInput) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    // 1. Zod Validation
    const validatedData = updatePreferencesSchema.parse(data);

    // 2. Command & Handler
    const repository = new SupabasePreferencesRepository(supabase);
    const handler = new UpdatePreferencesHandler(repository);

    await handler.execute({
      userId: user.id,
      appearance: validatedData.appearance as any,
      reader: validatedData.reader as any,
      notifications: validatedData.notifications as any,
    });

    revalidatePath("/account/preferences");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
