"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/shared/core/database/server";
import { ServerActionResult } from "@/lib/actions/action-result";

const UpdateAnnotationSchema = z.object({
  id: z.string().uuid("Invalid annotation ID"),
  bodyMarkdown: z.string().max(10000, "Annotation text cannot exceed 10,000 characters"),
});

const DeleteAnnotationSchema = z.object({
  id: z.string().uuid("Invalid annotation ID"),
});

export async function updateAnnotationAction(
  rawInput: { id: string; bodyMarkdown: string }
): Promise<ServerActionResult<{ id: string; bodyMarkdown: string; updatedAt: string }>> {
  try {
    const input = UpdateAnnotationSchema.parse(rawInput);
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: { message: "Unauthorized. Please sign in." } };
    }

    const { data, error } = await supabase
      .from("annotations")
      .update({
        body_markdown: input.bodyMarkdown,
        updated_at: new Date().toISOString(),
      })
      .eq("id", input.id)
      .eq("user_id", user.id)
      .select("id, body_markdown, updated_at")
      .single();

    if (error || !data) {
      return {
        success: false,
        error: { message: error?.message || "Failed to update annotation" },
      };
    }

    revalidatePath("/me/annotations");
    revalidatePath("/me/notes");

    return {
      success: true,
      data: {
        id: data.id,
        bodyMarkdown: data.body_markdown,
        updatedAt: data.updated_at,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: { message: error.message || "Failed to update annotation" },
    };
  }
}

export async function deleteAnnotationAction(
  rawId: string
): Promise<ServerActionResult<{ id: string }>> {
  try {
    const { id } = DeleteAnnotationSchema.parse({ id: rawId });
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: { message: "Unauthorized. Please sign in." } };
    }

    const { error } = await supabase
      .from("annotations")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return {
        success: false,
        error: { message: error.message || "Failed to delete annotation" },
      };
    }

    revalidatePath("/me/annotations");
    revalidatePath("/me/notes");

    return {
      success: true,
      data: { id },
    };
  } catch (error: any) {
    return {
      success: false,
      error: { message: error.message || "Failed to delete annotation" },
    };
  }
}
