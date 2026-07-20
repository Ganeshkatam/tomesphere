"use server";

import { createSupabaseServerClient } from "@/shared/core/database/server";
import { changePasswordSchema, ChangePasswordInput } from "@/modules/account/security/application/validators/changePasswordSchema";
import { requestExportSchema, RequestExportInput } from "@/modules/account/export/application/validators/requestExportSchema";
import { deleteAccountSchema, DeleteAccountInput } from "@/modules/account/deletion/application/validators/deleteAccountSchema";
import { ChangePasswordHandler } from "@/modules/account/security/application/commands/ChangePassword/handler";
import { SignOutEverywhereHandler } from "@/modules/account/security/application/commands/SignOutEverywhere/handler";
import { RequestExportHandler } from "@/modules/account/export/application/commands/RequestExport/handler";
import { DeleteAccountHandler } from "@/modules/account/deletion/application/commands/DeleteAccount/handler";
import { SupabaseSecurityRepository } from "@/modules/account/security/infrastructure/repositories/SupabaseSecurityRepository";
import { SupabaseExportRequestRepository } from "@/modules/account/export/infrastructure/repositories/SupabaseExportRequestRepository";
import { SupabaseAccountDeletionRepository } from "@/modules/account/deletion/infrastructure/repositories/SupabaseAccountDeletionRepository";
import { revalidatePath } from "next/cache";

export async function changePasswordAction(data: ChangePasswordInput) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const validated = changePasswordSchema.parse(data);
    const repo = new SupabaseSecurityRepository(supabase);
    const handler = new ChangePasswordHandler(repo);

    await handler.execute({ newPassword: validated.newPassword });
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function signOutEverywhereAction() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const repo = new SupabaseSecurityRepository(supabase);
    const handler = new SignOutEverywhereHandler(repo);

    await handler.execute({ userId: user.id });
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function requestExportAction(data: RequestExportInput) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.id !== data.userId) throw new Error("Unauthorized");

    const validated = requestExportSchema.parse(data);
    const repo = new SupabaseExportRequestRepository(supabase);
    const handler = new RequestExportHandler(repo, supabase);

    await handler.execute({ userId: validated.userId });
    
    revalidatePath("/account/security");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteAccountAction(data: DeleteAccountInput) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.id !== data.userId) throw new Error("Unauthorized");

    const validated = deleteAccountSchema.parse(data);
    const repo = new SupabaseAccountDeletionRepository(supabase);
    const handler = new DeleteAccountHandler(repo, supabase);

    await handler.execute({ 
      userId: validated.userId,
      confirmationText: validated.confirmationText
    });
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
