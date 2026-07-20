"use server";

import { revalidatePath } from "next/cache";
import {
  CreateLanguageHandler,
  UpdateLanguageHandler,
  DeleteLanguageHandler,
  SupabaseLanguageRepository,
} from "../../lib/domain/languages";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/shared/core/types/database";

async function getRepository() {
  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    },
  );

  return new SupabaseLanguageRepository(supabase);
}

export async function createLanguageAction(formData: FormData) {
  const repository = await getRepository();
  const handler = new CreateLanguageHandler(repository);

  const code = formData.get("code") as string;
  const name = formData.get("name") as string;
  const native_name = formData.get("native_name") as string;
  const is_active = formData.get("is_active") === "on";

  if (!code || !name || !native_name)
    throw new Error("Code, Name, and Native Name are required");

  await handler.execute({
    code,
    name,
    native_name,
    is_active,
  });

  revalidatePath("/languages");
  return;
}

export async function updateLanguageAction(formData: FormData) {
  const repository = await getRepository();
  const handler = new UpdateLanguageHandler(repository);

  const id = formData.get("id") as string;
  const code = formData.get("code") as string;
  const name = formData.get("name") as string;
  const native_name = formData.get("native_name") as string;
  const is_active = formData.get("is_active") === "on";

  if (!id) throw new Error("ID is required");

  await handler.execute({
    id,
    code: code || undefined,
    name: name || undefined,
    native_name: native_name || undefined,
    is_active,
  });

  revalidatePath("/languages");
  revalidatePath(`/languages/${id}`);
  return;
}

export async function deleteLanguageAction(id: string) {
  const repository = await getRepository();
  const handler = new DeleteLanguageHandler(repository);

  await handler.execute({ id });

  revalidatePath("/languages");
  return;
}
