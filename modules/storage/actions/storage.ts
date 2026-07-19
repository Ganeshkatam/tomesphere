"use server";
import { SupabaseIdentityProvider } from "@/modules/shared/infrastructure/identity/SupabaseIdentityProvider";
import { createSupabaseServerClient } from "@/modules/shared/core/database/server";

import { ServerActionResult } from "@/lib/actions/action-result";

export async function uploadFileToStorage(
  bucket: string,
  formData: FormData,
): Promise<ServerActionResult<{ url: string }>> {
  try {
    const supabase = await createSupabaseServerClient();
    const identityProvider = new SupabaseIdentityProvider(supabase);
    const user = await identityProvider.currentUser();

    if (!user) {
      return { success: false, error: { message: "Not authenticated" } };
    }

    const file = formData.get("file") as File;
    if (!file || file.size === 0) {
      return { success: false, error: { message: "No file provided" } };
    }

    // Sanitize filename
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "bin";
    const baseName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9 _-]/g, "")
      .replace(/\s+/g, "_")
      .toLowerCase()
      .substring(0, 50);

    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const fileName = `${baseName}_${timestamp}_${randomStr}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      return { success: false, error: { message: `Upload failed: ${uploadError.message}` } };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(fileName);

    return { success: true, data: { url: publicUrl } };
  } catch (error: unknown) {
    return { success: false, error: { message: error instanceof Error ? error.message : "Upload failed" } };
  }
}
