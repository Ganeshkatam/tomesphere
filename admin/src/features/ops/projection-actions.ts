"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "../../lib/supabase-admin";

export async function enqueueSearchRebuildAction() {
  const supabase = createAdminClient();

  // Fetch all published book IDs and enqueue a rebuild job for each
  const { data: books, error: fetchError } = await supabase
    .from("books")
    .select("id")
    .eq("is_published", true);

  if (fetchError) throw new Error("Failed to fetch books: " + fetchError.message);

  for (const book of books || []) {
    const { error } = await supabase.from("job_queue").insert({
      job_type: "PROJECTION_REBUILD",
      payload: { entityId: book.id, projectionName: "discovery_search" },
      status: "pending",
      scheduled_at: new Date().toISOString(),
    });
    if (error) console.error("Failed to enqueue rebuild for", book.id, error.message);
  }

  revalidatePath("/ops/projections");
  return { success: true, count: books?.length || 0 };
}

export async function enqueueMvRefreshAction(rpcName: string) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("job_queue").insert({
    job_type: "MV_REFRESH",
    payload: { rpcName },
    status: "pending",
    scheduled_at: new Date().toISOString(),
  });

  if (error) throw new Error("Failed to enqueue MV refresh: " + error.message);
  revalidatePath("/ops/projections");
  return { success: true };
}
