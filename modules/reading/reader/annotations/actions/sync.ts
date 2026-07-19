"use server";

import { createSupabaseServerClient } from "@/modules/shared/core/database/server";
import { getCurrentUser } from "@/modules/authentication/actions/auth";

import { ServerActionResult } from "@/lib/actions/action-result";

export async function fetchAnnotations(bookId: string): Promise<ServerActionResult<any[]>> {
  try {
    const supabase = await createSupabaseServerClient();
    const user = await getCurrentUser();
    if (!user) return { success: false, error: { message: "Unauthorized" } };
    
    const { data, error } = await supabase
      .from("annotations")
      .select("*")
      .eq("book_id", bookId)
      .eq("user_id", user.id);
      
    if (error) return { success: false, error: { message: error.message } };
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: { message: error.message || "Unknown error" } };
  }
}

export async function pushAnnotationChanges(changes: { creates: any[], updates: any[], deletes: string[] }): Promise<ServerActionResult<void>> {
  try {
    const supabase = await createSupabaseServerClient();
    const user = await getCurrentUser();
    if (!user) return { success: false, error: { message: "Unauthorized" } };
    
    // Creates
    for (const item of changes.creates) {
      await supabase.from("annotations").insert({ ...item, user_id: user.id });
    }
    
    // Updates
    for (const item of changes.updates) {
      await supabase.from("annotations").update(item).eq("id", item.id).eq("user_id", user.id);
    }
    
    // Deletes
    for (const id of changes.deletes) {
      await supabase.from("annotations").delete().eq("id", id).eq("user_id", user.id);
    }
    
    return { success: true, data: undefined };
  } catch (error: any) {
    return { success: false, error: { message: error.message || "Unknown error" } };
  }
}
