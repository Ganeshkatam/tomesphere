"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "../../lib/supabase-admin";

export async function retryOutboxEventAction(eventId: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("outbox_events")
    .update({ status: "pending", last_error: null })
    .eq("id", eventId);
  if (error) throw new Error("Failed to retry outbox event: " + error.message);
  revalidatePath("/ops/outbox");
  return { success: true };
}
