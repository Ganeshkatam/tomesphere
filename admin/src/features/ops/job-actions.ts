"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "../../lib/supabase-admin";

export async function retryJobAction(jobId: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("job_queue")
    .update({ status: "pending", last_error: null })
    .eq("id", jobId);
  if (error) throw new Error("Failed to retry job: " + error.message);
  revalidatePath("/ops/jobs");
  return { success: true };
}

export async function cancelJobAction(jobId: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("job_queue")
    .update({ status: "cancelled" as any })
    .eq("id", jobId);
  if (error) throw new Error("Failed to cancel job: " + error.message);
  revalidatePath("/ops/jobs");
  return { success: true };
}
