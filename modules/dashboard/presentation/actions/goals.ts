"use server";

import { z } from "zod";
import { ServerActionResult } from "@/lib/actions/action-result";
import { createSupabaseServerClient } from "@/shared/core/database/server";
import { requireAuth } from "@/modules/security/application/requireAuth";
import { SupabaseReadingGoalRepository } from "@/modules/progress/infrastructure/repositories/SupabaseReadingGoalRepository";
import { ReadingGoal, ReadingGoalType } from "@/modules/progress/domain/entities/ReadingGoal";
import { revalidatePath } from "next/cache";

const GoalTypeEnum = z.enum([
  "books_per_year",
  "books_per_month",
  "pages_per_day",
  "pages_per_week",
  "daily_minutes",
  "custom",
]);

const SaveGoalSchema = z.object({
  goalId: z.string().optional(),
  goalType: GoalTypeEnum,
  targetValue: z.number().int().positive("Target must be a positive integer"),
  year: z.number().int().optional(),
});

export type SaveGoalInput = z.infer<typeof SaveGoalSchema>;

export interface ReadingGoalActionDto {
  id: string;
  goalType: ReadingGoalType;
  targetValue: number;
  currentValue: number;
  year?: number | null;
  isActive: boolean;
  progressPercentage: number;
  isAchieved: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function saveReadingGoalAction(
  input: SaveGoalInput,
): Promise<ServerActionResult<{ goalId: string }>> {
  try {
    const user = await requireAuth();
    const validated = SaveGoalSchema.parse(input);
    const supabase = await createSupabaseServerClient();
    const repository = new SupabaseReadingGoalRepository(supabase);

    const currentYear = validated.year || new Date().getFullYear();

    if (validated.goalId) {
      const existing = await repository.findById(validated.goalId);
      if (!existing || existing.userId !== user.id) {
        return { success: false, error: { message: "Reading goal not found" } };
      }

      existing.updateTarget(validated.targetValue);
      await repository.save(existing);

      revalidatePath("/me/dashboard");
      return { success: true, data: { goalId: existing.id } };
    }

    // Check if matching goal already exists for user
    const existingMatching = await repository.findByUserIdAndType(
      user.id,
      validated.goalType as ReadingGoalType,
      currentYear,
    );

    if (existingMatching) {
      existingMatching.updateTarget(validated.targetValue);
      await repository.save(existingMatching);

      revalidatePath("/me/dashboard");
      return { success: true, data: { goalId: existingMatching.id } };
    }

    // Create new goal aggregate
    const newGoal = ReadingGoal.create(crypto.randomUUID(), {
      userId: user.id,
      goalType: validated.goalType as ReadingGoalType,
      targetValue: validated.targetValue,
      currentValue: 0,
      year: currentYear,
      isActive: true,
    });

    await repository.save(newGoal);

    revalidatePath("/me/dashboard");
    return { success: true, data: { goalId: newGoal.id } };
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
    const user = await requireAuth();
    const supabase = await createSupabaseServerClient();
    const repository = new SupabaseReadingGoalRepository(supabase);

    await repository.delete(goalId, user.id);

    revalidatePath("/me/dashboard");
    return { success: true, data: undefined };
  } catch (err: any) {
    return { success: false, error: { message: err.message || "Failed to delete reading goal." } };
  }
}

export async function getReadingGoalsAction(): Promise<
  ServerActionResult<ReadingGoalActionDto[]>
> {
  try {
    const user = await requireAuth();
    const supabase = await createSupabaseServerClient();
    const repository = new SupabaseReadingGoalRepository(supabase);

    const goals = await repository.listActiveByUserId(user.id);
    const dtos: ReadingGoalActionDto[] = goals.map((g) => ({
      id: g.id,
      goalType: g.goalType,
      targetValue: g.targetValue,
      currentValue: g.currentValue,
      year: g.year,
      isActive: g.isActive,
      progressPercentage: g.calculateProgressPercentage(),
      isAchieved: g.isAchieved(),
      createdAt: g.createdAt.toISOString(),
      updatedAt: g.updatedAt.toISOString(),
    }));

    return { success: true, data: dtos };
  } catch (err: any) {
    return { success: false, error: { message: err.message || "Failed to fetch reading goals." } };
  }
}
