"use server";

import { createSupabaseServerClient } from "@/shared/core/database/server";
import { ServerActionResult } from "@/lib/actions/action-result";
import { Notification } from "../../domain/Notification";
import { SupabaseNotificationRepository } from "../../infrastructure/SupabaseNotificationRepository";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/modules/security/application/requireAuth";

async function getRepository() {
  const supabase = await createSupabaseServerClient();
  return new SupabaseNotificationRepository(supabase);
}

export async function getUnreadNotifications(): Promise<ServerActionResult<Notification[]>> {
  try {
    const user = await requireAuth();
    const repository = await getRepository();
    const data = await repository.listUnreadForUser(user.id);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: { message: error.message } };
  }
}

export async function getNotifications(page: number = 1, pageSize: number = 20): Promise<ServerActionResult<{ notifications: Notification[], total: number }>> {
  try {
    const user = await requireAuth();
    const repository = await getRepository();

    const offset = (page - 1) * pageSize;
    const notifications = await repository.listForUser(user.id, pageSize, offset);
    const total = await repository.getUnreadCount(user.id);

    return {
      success: true,
      data: { notifications, total },
    };
  } catch (error: any) {
    return { success: false, error: { message: error.message } };
  }
}

export async function markAsRead(notificationId: string): Promise<ServerActionResult<void>> {
  try {
    const user = await requireAuth();
    const repository = await getRepository();
    await repository.markAsRead(notificationId, user.id);
    revalidatePath("/", "layout");
    return { success: true, data: undefined };
  } catch (error: any) {
    return { success: false, error: { message: error.message } };
  }
}

export async function markAllAsRead(): Promise<ServerActionResult<void>> {
  try {
    const user = await requireAuth();
    const repository = await getRepository();
    await repository.markAllAsRead(user.id);
    revalidatePath("/", "layout");
    return { success: true, data: undefined };
  } catch (error: any) {
    return { success: false, error: { message: error.message } };
  }
}
