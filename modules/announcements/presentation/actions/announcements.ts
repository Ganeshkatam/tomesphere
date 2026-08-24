"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/shared/core/database/server";
import { ServerActionResult } from "@/lib/actions/action-result";
import { SupabaseAnnouncementRepository } from "../../infrastructure/SupabaseAnnouncementRepository";
import { CreateAnnouncementHandler } from "../../application/commands/CreateAnnouncementCommand";
import { UpdateAnnouncementHandler } from "../../application/commands/UpdateAnnouncementCommand";
import { DeleteAnnouncementHandler } from "../../application/commands/DeleteAnnouncementCommand";
import type { SupabaseClient } from "@supabase/supabase-js";

// Input Schemas
const CreateAnnouncementInputSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  content: z.string().min(1, "Content is required"),
  type: z.enum(["info", "warning", "feature", "maintenance", "success", "error"]).default("info"),
  linkUrl: z.string().url().optional().nullable(),
  linkText: z.string().max(50).optional().nullable(),
  isDismissible: z.boolean().default(true),
  isActive: z.boolean().default(true),
  startsAt: z.string().datetime().optional().nullable(),
  endsAt: z.string().datetime().optional().nullable(),
});

const UpdateAnnouncementInputSchema = z.object({
  id: z.string().uuid("Invalid announcement ID"),
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
  type: z.enum(["info", "warning", "feature", "maintenance", "success", "error"]).optional(),
  linkUrl: z.string().url().optional().nullable(),
  linkText: z.string().max(50).optional().nullable(),
  isDismissible: z.boolean().optional(),
  isActive: z.boolean().optional(),
  startsAt: z.string().datetime().optional().nullable(),
  endsAt: z.string().datetime().optional().nullable(),
});

const DeleteAnnouncementInputSchema = z.object({
  id: z.string().uuid("Invalid announcement ID"),
});

export type CreateAnnouncementInput = z.infer<typeof CreateAnnouncementInputSchema>;
export type UpdateAnnouncementInput = z.infer<typeof UpdateAnnouncementInputSchema>;

/**
 * Authorization Guard: Verifies authentication & elevated administrator role.
 */
async function authorizeAdmin(supabase: SupabaseClient): Promise<string> {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Authentication required.");
  }

  // Check granular permission RPC or app/user metadata
  const { data: hasPerm } = await supabase.rpc("has_permission", {
    p_user_id: user.id,
    p_permission: "ManageUsers",
  });

  const isAdmin =
    hasPerm === true ||
    user.app_metadata?.role === "admin" ||
    user.user_metadata?.role === "admin";

  if (!isAdmin) {
    throw new Error("Unauthorized: Administrator permissions required.");
  }

  return user.id;
}

/**
 * Server Action: Create an announcement (Admin only)
 */
export async function createAnnouncementAction(
  rawInput: CreateAnnouncementInput
): Promise<ServerActionResult<{ id: string }>> {
  try {
    const supabase = await createSupabaseServerClient();
    await authorizeAdmin(supabase);

    const validated = CreateAnnouncementInputSchema.parse(rawInput);

    const repository = new SupabaseAnnouncementRepository(supabase as any);
    const handler = new CreateAnnouncementHandler(repository);

    const id = await handler.execute({
      title: validated.title,
      content: validated.content,
      type: validated.type,
      link_url: validated.linkUrl,
      link_text: validated.linkText,
      is_dismissible: validated.isDismissible,
      is_active: validated.isActive,
      starts_at: validated.startsAt || new Date().toISOString(),
      ends_at: validated.endsAt || null,
    });

    revalidatePath("/", "layout");

    return { success: true, data: { id } };
  } catch (error: any) {
    return {
      success: false,
      error: { message: error.message || "Failed to create announcement" },
    };
  }
}

/**
 * Server Action: Update an announcement (Admin only)
 */
export async function updateAnnouncementAction(
  rawInput: UpdateAnnouncementInput
): Promise<ServerActionResult<void>> {
  try {
    const supabase = await createSupabaseServerClient();
    await authorizeAdmin(supabase);

    const validated = UpdateAnnouncementInputSchema.parse(rawInput);

    const repository = new SupabaseAnnouncementRepository(supabase as any);
    const handler = new UpdateAnnouncementHandler(repository);

    await handler.execute({
      id: validated.id,
      title: validated.title,
      content: validated.content,
      type: validated.type,
      link_url: validated.linkUrl,
      link_text: validated.linkText,
      is_dismissible: validated.isDismissible,
      is_active: validated.isActive,
      starts_at: validated.startsAt,
      ends_at: validated.endsAt,
    });

    revalidatePath("/", "layout");

    return { success: true, data: undefined };
  } catch (error: any) {
    return {
      success: false,
      error: { message: error.message || "Failed to update announcement" },
    };
  }
}

/**
 * Server Action: Delete an announcement (Admin only)
 */
export async function deleteAnnouncementAction(
  rawId: string
): Promise<ServerActionResult<void>> {
  try {
    const supabase = await createSupabaseServerClient();
    await authorizeAdmin(supabase);

    const { id } = DeleteAnnouncementInputSchema.parse({ id: rawId });

    const repository = new SupabaseAnnouncementRepository(supabase as any);
    const handler = new DeleteAnnouncementHandler(repository);

    await handler.execute({ id });

    revalidatePath("/", "layout");

    return { success: true, data: undefined };
  } catch (error: any) {
    return {
      success: false,
      error: { message: error.message || "Failed to delete announcement" },
    };
  }
}
