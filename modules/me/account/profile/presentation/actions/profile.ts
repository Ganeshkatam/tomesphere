"use server";

import { z } from "zod";
import { ServerActionResult } from "@/lib/actions/action-result";
import { createSupabaseServerClient } from "@/shared/core/database/server";
import { SupabaseProfileRepository } from "../../infrastructure/repositories/SupabaseProfileRepository";
import { revalidatePath } from "next/cache";
import { UserId } from "@/shared/kernel/UserId";

const ProfileUpdateSchema = z.object({
  displayName: z.string().min(1, "Display name is required").max(50, "Display name cannot exceed 50 characters"),
  bio: z.string().max(160, "Bio cannot exceed 160 characters").nullable(),
  location: z.string().max(100, "Location cannot exceed 100 characters").nullable(),
});

export type ProfileUpdateData = z.infer<typeof ProfileUpdateSchema>;

export async function updateProfileAction(
  data: ProfileUpdateData
): Promise<ServerActionResult<void>> {
  try {
    const validatedData = ProfileUpdateSchema.parse(data);

    const supabase = await createSupabaseServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: { message: "Unauthorized. Please log in." } };
    }

    const profileRepo = new SupabaseProfileRepository(supabase);
    const userId = UserId.create(user.id);
    const profile = await profileRepo.findById(userId);
    
    if (!profile) {
      return { success: false, error: { message: "Profile not found." } };
    }

    profile.displayName = validatedData.displayName;
    profile.bio = validatedData.bio;
    profile.location = validatedData.location;

    await profileRepo.save(profile);

    revalidatePath("/me/account/profile");
    revalidatePath("/", "layout");

    return { success: true, data: undefined };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, error: { message: "Invalid profile data provided." } };
    }
    return { success: false, error: { message: error.message || "Failed to update profile." } };
  }
}

const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

import { uploadFileToStorage } from "@/modules/storage/presentation/actions/storage";

export async function uploadAvatarAction(
  formData: FormData
): Promise<ServerActionResult<{ avatarUrl: string }>> {
  try {
    const supabase = await createSupabaseServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: { message: "Unauthorized. Please log in." } };
    }

    const file = (formData.get("avatar") || formData.get("file")) as File | null;
    if (!file) {
      return { success: false, error: { message: "No file provided." } };
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return { success: false, error: { message: "Only JPEG, PNG, and WebP images are allowed." } };
    }

    if (file.size > MAX_AVATAR_SIZE) {
      return { success: false, error: { message: "Image must be smaller than 2MB." } };
    }

    const storageFormData = new FormData();
    storageFormData.append("file", file);

    const storageResult = await uploadFileToStorage("avatars", storageFormData);
    if (!storageResult.success) {
      return {
        success: false,
        error: { message: storageResult.error.message || "Failed to upload avatar." },
      };
    }

    const avatarUrl = storageResult.data.url;

    // Update profile record
    const profileRepo = new SupabaseProfileRepository(supabase);
    const userId = UserId.create(user.id);
    const profile = await profileRepo.findById(userId);

    if (profile) {
      profile.avatarUrl = avatarUrl;
      await profileRepo.save(profile);
    }

    revalidatePath("/me/account/profile");
    revalidatePath("/", "layout");

    return { success: true, data: { avatarUrl } };
  } catch (error: any) {
    return { success: false, error: { message: error.message || "Failed to upload avatar." } };
  }
}

export async function removeAvatarAction(): Promise<ServerActionResult<void>> {
  try {
    const supabase = await createSupabaseServerClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: { message: "Unauthorized. Please log in." } };
    }

    // Remove from storage (best-effort, ignore errors if file doesn't exist)
    await supabase.storage
      .from("avatars")
      .remove([`${user.id}/avatar.jpg`, `${user.id}/avatar.png`, `${user.id}/avatar.webp`]);

    // Clear avatar_url in profile
    const profileRepo = new SupabaseProfileRepository(supabase);
    const userId = UserId.create(user.id);
    const profile = await profileRepo.findById(userId);

    if (profile) {
      profile.avatarUrl = null;
      await profileRepo.save(profile);
    }

    revalidatePath("/me/account/profile");
    revalidatePath("/", "layout");

    return { success: true, data: undefined };
  } catch (error: any) {
    return { success: false, error: { message: error.message || "Failed to remove avatar." } };
  }
}

