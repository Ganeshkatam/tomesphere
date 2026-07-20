"use server";

import { revalidatePath } from "next/cache";
import {
  UploadBookFileHandler,
  DeleteBookFileHandler,
  SupabaseBookFileRepository,
} from "../../lib/domain/books";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/shared/core/types/database";

async function getFileRepository() {
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

  return new SupabaseBookFileRepository(supabase);
}

export async function uploadBookFileAction(formData: FormData) {
  const repository = await getFileRepository();
  const handler = new UploadBookFileHandler(repository);

  const bookId = formData.get("bookId") as string;
  const format = formData.get("format") as string;
  const storagePath = formData.get("storagePath") as string;
  const mimeType = formData.get("mimeType") as string;
  const checksum = formData.get("checksum") as string;
  const size = formData.get("size")
    ? parseInt(formData.get("size") as string, 10)
    : null;
  const isPrimary = formData.get("isPrimary") === "true";

  if (!bookId || !format || !storagePath || !mimeType) {
    throw new Error("Missing required file metadata");
  }

  await handler.execute({
    bookId,
    format,
    storagePath,
    mimeType,
    checksum: checksum || null,
    size,
    isPrimary,
  });

  revalidatePath(`/books/${bookId}`);
  return { success: true };
}

export async function deleteBookFileAction(id: string, bookId: string) {
  const repository = await getFileRepository();
  const handler = new DeleteBookFileHandler(repository);

  await handler.execute({ id });

  revalidatePath(`/books/${bookId}`);
  return { success: true };
}
