"use server";

import { createSupabaseServerClient } from "@/shared/core/database/server";
import { getCurrentUser } from "@/modules/authentication/presentation/actions/auth";

import { ServerActionResult } from "@/lib/actions/action-result";

export async function markNotificationAsRead(id: string): Promise<ServerActionResult<void>> {
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id);
    if (error) return { success: false, error: { message: error.message } };
    return { success: true, data: undefined };
  } catch (err: any) {
    return { success: false, error: { message: err.message || "Unknown error" } };
  }
}

export async function markAllNotificationsAsRead(): Promise<ServerActionResult<void>> {
  try {
    const supabase = await createSupabaseServerClient();
    const res = await getCurrentUser();
    if (!true || !res) return { success: false, error: { message: "Unauthorized" } };
    const { error } = await supabase.from("notifications").update({ read: true }).eq("user_id", res.id);
    if (error) return { success: false, error: { message: error.message } };
    return { success: true, data: undefined };
  } catch (err: any) {
    return { success: false, error: { message: err.message || "Unknown error" } };
  }
}

export async function deleteNotificationAction(id: string): Promise<ServerActionResult<void>> {
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("notifications").delete().eq("id", id);
    if (error) return { success: false, error: { message: error.message } };
    return { success: true, data: undefined };
  } catch (err: any) {
    return { success: false, error: { message: err.message || "Unknown error" } };
  }
}
