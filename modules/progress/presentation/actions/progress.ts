"use server";

import { createSupabaseServerClient } from "@/shared/core/database/server";
import { SupabaseProgressRepository } from "../../infrastructure/repositories/SupabaseProgressRepository";
import { SupabaseIdentityProvider } from "@/shared/infrastructure/identity/SupabaseIdentityProvider";
import {
  ApplyReadingActivity,
  ApplyReadingActivityRequest,
} from "../../application/commands/ApplyReadingActivity/handler";
import {
  GetProgressDashboard,
  GetProgressDashboardOutput,
} from "../../application/queries/GetProgressDashboard/handler";
import { z } from "zod";
import { ServerActionResult } from "@/lib/actions/action-result";

const ApplyReadingActivitySchema = z.object({
  minutes: z.number().min(1),
  pages: z.number().min(0),
  completedBooks: z.number().min(0).optional(),
  date: z.string().optional(), // ISO date string
});

export async function applyReadingActivity(
  input: z.infer<typeof ApplyReadingActivitySchema>,
): Promise<ServerActionResult<void>> {
  try {
    const validated = ApplyReadingActivitySchema.parse(input);
    const supabase = await createSupabaseServerClient();
    const identityProvider = new SupabaseIdentityProvider(supabase);
    const user = await identityProvider.currentUser();

    if (!user) {
      throw new Error("Unauthorized" );
    }

    const repository = new SupabaseProgressRepository(supabase);
    const useCase = new ApplyReadingActivity(repository);

    const request: ApplyReadingActivityRequest = {
      userId: user.id,
      minutes: validated.minutes,
      pages: validated.pages,
      completedBooks: validated.completedBooks,
      date: validated.date ? new Date(validated.date) : new Date(),
    };

    await useCase.execute(request);
    
    return { success: true, data: undefined };
  } catch (error: any) {
    return { success: false, error: { message: error.message || "Unknown error" } };
  }
}

export async function getProgressDashboard(): Promise<ServerActionResult<GetProgressDashboardOutput | null>> {
  try {
    const supabase = await createSupabaseServerClient();
    const identityProvider = new SupabaseIdentityProvider(supabase);
    const user = await identityProvider.currentUser();

    if (!user) {
      return { success: true, data: null };
    }

    const repository = new SupabaseProgressRepository(supabase);
    const useCase = new GetProgressDashboard(repository);

    const data = await useCase.execute(user.id);
    return { success: true, data };
  } catch (error: any) {
    console.error("Failed to get progress dashboard:", error);
    return { success: false, error: { message: error.message || "Failed to fetch progress dashboard" } };
  }
}
