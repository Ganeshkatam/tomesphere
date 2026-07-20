"use server";

import { createSupabaseServerClient } from "@/shared/core/database/server";
import { updateProfileSchema, UpdateProfileInput } from "@/modules/user/profile/application/validators/updateProfileSchema";
import { updateProfile } from "@/modules/user/profile/application/commands/UpdateProfile/handler";
import { SupabaseProfileRepository } from "@/modules/user/profile/infrastructure/repositories/SupabaseProfileRepository";
import { emitOutboxEvent } from "@/shared/core/infrastructure/outbox/outbox";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(data: UpdateProfileInput) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    // 1. Zod Validation
    const validatedData = updateProfileSchema.parse(data);

    // 2. Command & Handler
    const repository = new SupabaseProfileRepository(supabase);
    const result = await updateProfile(repository, {
      userId: user.id,
      displayName: validatedData.displayName,
      biography: validatedData.biography,
      location: validatedData.location,
      avatarUrl: validatedData.avatarUrl,
    });

    // 3. Emit Domain Events
    for (const event of result.events) {
      await emitOutboxEvent(
        supabase,
        event.eventName as any,
        (event as any).payload,
        (event as any).aggregateType,
        event.aggregateId,
      );
    }

    revalidatePath("/account/profile");
    return { success: true, data: result.output };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
