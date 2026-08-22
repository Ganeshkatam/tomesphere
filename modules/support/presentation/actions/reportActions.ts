"use server";

import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/shared/core/database/server";
import { SubmitReportCommand, SubmitReportDto } from "../../application/commands/SubmitReportCommand";
import { SupabasePlatformReportRepository } from "../../infrastructure/repositories/SupabasePlatformReportRepository";

// Simple in-memory rate limiter for V1
// Keys: IP address or User ID, Values: Array of submission timestamps
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_SUBMISSIONS_PER_WINDOW = 5;

function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const submissions = rateLimitMap.get(identifier) || [];
  
  // Filter out timestamps outside the window
  const recentSubmissions = submissions.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);
  
  if (recentSubmissions.length >= MAX_SUBMISSIONS_PER_WINDOW) {
    return true;
  }
  
  recentSubmissions.push(now);
  rateLimitMap.set(identifier, recentSubmissions);
  return false;
}

export async function submitReportAction(formData: FormData) {
  try {
    const supabase = await createSupabaseServerClient();
    
    // 1. Authenticate user if possible
    const { data: { user } } = await supabase.auth.getUser();
    
    // 2. Identify caller for rate limiting
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    const rateLimitId = user ? user.id : ip;
    
    if (isRateLimited(rateLimitId)) {
      return { success: false, error: "Too many submissions. Please try again later." };
    }

    // 3. Extract DTO fields from form
    const dto: SubmitReportDto = {
      type: formData.get("type") as string,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      email: formData.get("email") as string | null,
      userId: user ? user.id : null, // Server-derived, not client-supplied
    };

    // 4. Instantiate Repository & Command
    const repository = new SupabasePlatformReportRepository(supabase);
    const command = new SubmitReportCommand(repository);

    // 5. Execute Command
    const result = await command.execute(dto);
    
    return result;
  } catch (error: any) {
    console.error("[submitReportAction] Unexpected error:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
