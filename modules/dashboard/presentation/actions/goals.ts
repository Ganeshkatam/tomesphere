"use server";

import { z } from "zod";
import { ServerActionResult } from "@/lib/actions/action-result";
import { createSupabaseServerClient } from "@/shared/core/database/server";
import { revalidatePath } from "next/cache";

const SaveGoalSchema = z.object({
  goalId: z.string().optional(),
  goalType: z.enum([
    "books_per_year",
    "books_per_month",
    "pages_per_day",
    "pages_per_week",
    "custom",
  ]),
  targetValue: z.number().int().positive("Target must be a positive integer"),
  year: z.number().int().optional(),
});

export type SaveGoalInput = z.infer<typeof SaveGoalSchema>;

export async function saveReadingGoalAction(
  input: SaveGoalInput,
): Promise<ServerActionResult<{ goalId: string }>> {
  try {
    const validated = SaveGoalSchema.parse(input);
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: { message: "Unauthorized. Please log in." } };
    }

    const currentYear = validated.year || new Date().getFullYear();

    if (validated.goalId) {
      // Update existing goal
      const { error: updateError } = await supabase
        .from("reading_goals")
        .update({
          target_value: validated.targetValue,
          goal_type: validated.goalType,
          updated_at: new Date().toISOString(),
        })
        .eq("id", validated.goalId)
        .eq("user_id", user.id);

      if (updateError) {
        return { success: false, error: { message: updateError.message } };
      }

      revalidatePath("/me/dashboard");
      return { success: true, data: { goalId: validated.goalId } };
    }

    // Check if matching active goal already exists
    const { data: existing } = await supabase
      .from("reading_goals")
      .select("id")
      .eq("user_id", user.id)
      .eq("goal_type", validated.goalType)
      .eq("year", currentYear)
      .maybeSingle();

    if (existing) {
      const { error: updateError } = await supabase
        .from("reading_goals")
        .update({
          target_value: validated.targetValue,
          is_active: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);

      if (updateError) {
        return { success: false, error: { message: updateError.message } };
      }

      revalidatePath("/me/dashboard");
      return { success: true, data: { goalId: existing.id } };
    }

    // Insert new goal
    const { data: inserted, error: insertError } = await supabase
      .from("reading_goals")
      .insert({
        user_id: user.id,
        goal_type: validated.goalType,
        target_value: validated.targetValue,
        current_value: 0,
        year: currentYear,
        is_active: true,
      })
      .select("id")
      .single();

    if (insertError) {
      return { success: false, error: { message: insertError.message } };
    }

    revalidatePath("/me/dashboard");
    return { success: true, data: { goalId: inserted.id } };
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return { success: false, error: { message: err.issues?.[0]?.message || "Invalid input." } };
    }
    return { success: false, error: { message: err.message || "Failed to save reading goal." } };
  }
}

export async function deleteReadingGoalAction(
  goalId: string,
): Promise<ServerActionResult<void>> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: { message: "Unauthorized. Please log in." } };
    }

    const { error } = await supabase
      .from("reading_goals")
      .delete()
      .eq("id", goalId)
      .eq("user_id", user.id);

    if (error) {
      return { success: false, error: { message: error.message } };
    }

    revalidatePath("/me/dashboard");
    return { success: true, data: undefined };
  } catch (err: any) {
    return { success: false, error: { message: err.message || "Failed to delete reading goal." } };
  }
}
