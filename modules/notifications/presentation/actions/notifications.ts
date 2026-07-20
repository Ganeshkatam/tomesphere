"use server";

import { createSupabaseServerClient } from "@/shared/core/database/server";
import { ServerActionResult } from "@/lib/actions/action-result";
import { Notification } from "../../domain/Notification";
import { revalidatePath } from "next/cache";

export async function getUnreadNotifications(): Promise<ServerActionResult<Notification[]>> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: user, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user.user) throw new Error("Unauthorized");

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.user.id)
      .is("read_at", null)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return {
      success: true,
      data: data.map((n) => ({
        id: n.id,
        userId: n.user_id,
        eventName: n.event_name,
        aggregateId: n.aggregate_id,
        aggregateType: n.aggregate_type,
        type: n.type,
        title: n.title,
        body: n.body,
        metadata: n.metadata,
        readAt: n.read_at,
        createdAt: n.created_at,
      })),
    };
  } catch (error: any) {
    return { success: false, error: { message: error.message } };
  }
}

export async function getNotifications(page: number = 1, pageSize: number = 20): Promise<ServerActionResult<{ notifications: Notification[], total: number }>> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: user, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user.user) throw new Error("Unauthorized");

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from("notifications")
      .select("*", { count: "exact" })
      .eq("user_id", user.user.id)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      success: true,
      data: {
        total: count || 0,
        notifications: (data || []).map((n) => ({
          id: n.id,
          userId: n.user_id,
          eventName: n.event_name,
          aggregateId: n.aggregate_id,
          aggregateType: n.aggregate_type,
          type: n.type,
          title: n.title,
          body: n.body,
          metadata: n.metadata,
          readAt: n.read_at,
          createdAt: n.created_at,
        })),
      },
    };
  } catch (error: any) {
    return { success: false, error: { message: error.message } };
  }
}

export async function markAsRead(notificationId: string): Promise<ServerActionResult<void>> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: user, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user.user) throw new Error("Unauthorized");

    const { error } = await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("id", notificationId)
      .eq("user_id", user.user.id);

    if (error) throw error;
    
    revalidatePath("/", "layout"); // Revalidate where the bell is displayed

    return { success: true, data: undefined };
  } catch (error: any) {
    return { success: false, error: { message: error.message } };
  }
}

export async function markAllAsRead(): Promise<ServerActionResult<void>> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: user, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user.user) throw new Error("Unauthorized");

    const { error } = await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("user_id", user.user.id)
      .is("read_at", null);

    if (error) throw error;
    
    revalidatePath("/", "layout");

    return { success: true, data: undefined };
  } catch (error: any) {
    return { success: false, error: { message: error.message } };
  }
}
