"use server";
import { SupabaseIdentityProvider } from "@/shared/infrastructure/identity/SupabaseIdentityProvider";
import { createSupabaseServerClient } from "@/shared/core/database/server";

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
      return {
        success: false,
        error: { message: `Upload failed: ${uploadError.message}` },
      };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(fileName);

    // Record user permission grant in database
    if (file.type && (file.type.startsWith("image/") || bucket === "avatars" || bucket === "user-images" || bucket === "shelves")) {
      try {
        await supabase.from("user_permissions").insert({
          user_id: user.id,
          permission_type: "photo_upload",
          granted: true,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type || "image/jpeg",
          resource_url: publicUrl,
        });
      } catch (logErr) {
        console.warn("Could not log user permission to database:", logErr);
      }
    }

    return { success: true, data: { url: publicUrl } };
  } catch (error: unknown) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Upload failed",
      },
    };
  }
}

export async function deleteFileFromStorage(
  bucket: string,
  fileUrlOrPath: string,
): Promise<ServerActionResult<void>> {
  try {
    const supabase = await createSupabaseServerClient();
    const identityProvider = new SupabaseIdentityProvider(supabase);
    const user = await identityProvider.currentUser();

    if (!user) {
      return { success: false, error: { message: "Not authenticated" } };
    }

    if (!fileUrlOrPath) {
      return { success: true, data: undefined };
    }

    // Extract storage object path from public URL if full URL is passed
    let storagePath = fileUrlOrPath;
    const bucketMarker = `/${bucket}/`;
    const markerIndex = fileUrlOrPath.indexOf(bucketMarker);
    if (markerIndex !== -1) {
      storagePath = fileUrlOrPath.substring(markerIndex + bucketMarker.length);
    } else if (fileUrlOrPath.startsWith("http://") || fileUrlOrPath.startsWith("https://")) {
      try {
        const urlObj = new URL(fileUrlOrPath);
        const parts = urlObj.pathname.split(`/${bucket}/`);
        if (parts.length > 1) {
          storagePath = parts[1];
        }
      } catch {
        // Fallback to substring
      }
    }

    storagePath = decodeURIComponent(storagePath);

    // Strip query parameters if any exist
    if (storagePath.includes("?")) {
      storagePath = storagePath.split("?")[0];
    }

    const { error: deleteError } = await supabase.storage
      .from(bucket)
      .remove([storagePath]);

    if (deleteError) {
      return {
        success: false,
        error: { message: `Delete failed: ${deleteError.message}` },
      };
    }

    return { success: true, data: undefined };
  } catch (error: unknown) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Delete failed",
      },
    };
  }
}

export async function checkUserPermissionAction(
  permissionType: string = "photo_upload"
): Promise<ServerActionResult<{ granted: boolean }>> {
  try {
    const supabase = await createSupabaseServerClient();
    const identityProvider = new SupabaseIdentityProvider(supabase);
    const user = await identityProvider.currentUser();

    if (!user) {
      return { success: false, error: { message: "Not authenticated" } };
    }

    const { data, error } = await supabase
      .from("user_permissions")
      .select("id, granted")
      .eq("user_id", user.id)
      .eq("permission_type", permissionType)
      .eq("granted", true)
      .limit(1)
      .maybeSingle();

    if (error) {
      return { success: false, error: { message: error.message } };
    }

    return { success: true, data: { granted: !!data } };
  } catch (error: unknown) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Failed to check permission",
      },
    };
  }
}

export async function grantUserPermissionAction(
  permissionType: string = "photo_upload"
): Promise<ServerActionResult<{ granted: boolean }>> {
  try {
    const supabase = await createSupabaseServerClient();
    const identityProvider = new SupabaseIdentityProvider(supabase);
    const user = await identityProvider.currentUser();

    if (!user) {
      return { success: false, error: { message: "Not authenticated" } };
    }

    const { error } = await supabase.from("user_permissions").insert({
      user_id: user.id,
      permission_type: permissionType,
      granted: true,
    });

    if (error) {
      return { success: false, error: { message: error.message } };
    }

    return { success: true, data: { granted: true } };
  } catch (error: unknown) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Failed to grant permission",
      },
    };
  }
}
