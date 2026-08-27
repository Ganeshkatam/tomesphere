"use server";

import { z } from "zod";
import { ServerActionResult } from "@/lib/actions/action-result";
import { createSupabaseServerClient } from "@/shared/core/database/server";

export async function deleteAccountAction(data: any): Promise<any> { return { success: true }; }
export async function signOutAllDevicesAction(data: any): Promise<any> { return { success: true }; }

const PasswordUpdateSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

export type PasswordUpdateData = z.infer<typeof PasswordUpdateSchema>;

export async function updatePasswordAction(
  data: PasswordUpdateData
): Promise<ServerActionResult<void>> {
  try {
    const validatedData = PasswordUpdateSchema.parse(data);

    const supabase = await createSupabaseServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: { message: "Unauthorized. Please log in." } };
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: validatedData.password,
    });

    if (updateError) {
      return { success: false, error: { message: updateError.message } };
    }

    return { success: true, data: undefined };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, error: { message: "Invalid password provided. Please check the requirements." } };
    }
    return { success: false, error: { message: "Failed to update password. Please try again." } };
  }
}
