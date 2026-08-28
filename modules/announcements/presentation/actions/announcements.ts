"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/shared/core/database/server";
import { ServerActionResult } from "@/lib/actions/action-result";
import { requireAuth } from "@/modules/security/application/requireAuth";
import { SupabaseAnnouncementRepository } from "../../infrastructure/SupabaseAnnouncementRepository";
import { SupabaseAuthorizationRepository } from "@/modules/authorization/infrastructure/SupabaseAuthorizationRepository";
import { PermissionService } from "@/modules/authorization/application/PermissionService";
import { CreateAnnouncementHandler } from "../../application/commands/CreateAnnouncementCommand";
import { UpdateAnnouncementHandler } from "../../application/commands/UpdateAnnouncementCommand";
import { DeleteAnnouncementHandler } from "../../application/commands/DeleteAnnouncementCommand";

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
 * Server Action: Create an announcement (Authorized callers only)
 */
export async function createAnnouncementAction(
  rawInput: CreateAnnouncementInput
): Promise<ServerActionResult<{ id: string }>> {
  try {
    const user = await requireAuth();
    const validated = CreateAnnouncementInputSchema.parse(rawInput);

    const supabase = await createSupabaseServerClient();
    const announcementRepo = new SupabaseAnnouncementRepository(supabase as any);
    const authRepo = new SupabaseAuthorizationRepository(supabase);
    const permissionService = new PermissionService(authRepo);

    const handler = new CreateAnnouncementHandler(announcementRepo, permissionService);

    const id = await handler.execute({
      callerId: user.id,
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
 * Server Action: Update an announcement (Authorized callers only)
 */
export async function updateAnnouncementAction(
  rawInput: UpdateAnnouncementInput
): Promise<ServerActionResult<void>> {
  try {
    const user = await requireAuth();
    const validated = UpdateAnnouncementInputSchema.parse(rawInput);

    const supabase = await createSupabaseServerClient();
    const announcementRepo = new SupabaseAnnouncementRepository(supabase as any);
    const authRepo = new SupabaseAuthorizationRepository(supabase);
    const permissionService = new PermissionService(authRepo);

    const handler = new UpdateAnnouncementHandler(announcementRepo, permissionService);

    await handler.execute({
      callerId: user.id,
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
 * Server Action: Delete an announcement (Authorized callers only)
 */
export async function deleteAnnouncementAction(
  rawId: string
): Promise<ServerActionResult<void>> {
  try {
    const user = await requireAuth();
    const { id } = DeleteAnnouncementInputSchema.parse({ id: rawId });

    const supabase = await createSupabaseServerClient();
    const announcementRepo = new SupabaseAnnouncementRepository(supabase as any);
    const authRepo = new SupabaseAuthorizationRepository(supabase);
    const permissionService = new PermissionService(authRepo);

    const handler = new DeleteAnnouncementHandler(announcementRepo, permissionService);

    await handler.execute({
      callerId: user.id,
      id,
    });

    revalidatePath("/", "layout");

    return { success: true, data: undefined };
  } catch (error: any) {
    return {
      success: false,
      error: { message: error.message || "Failed to delete announcement" },
    };
  }
}
