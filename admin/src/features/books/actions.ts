"use server";

import { revalidatePath } from "next/cache";
import { CreateBookHandler, PublishBookHandler } from "../../lib/domain/books";
import { SupabaseBookRepository } from "../../lib/domain/infrastructure";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "../../../../shared/core/types/database"; // Shared DB types

// Helper to get authenticated repository instance
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

  return new SupabaseBookRepository(supabase);
}

export async function createBookAction(formData: FormData) {
  const repository = await getRepository();
  const handler = new CreateBookHandler(repository);

  // Example basic validation
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const isTextbook = formData.get("isTextbook") === "true";

  const authors = formData.getAll("authors") as string[];
  const genres = formData.getAll("genres") as string[];
  const subjects = formData.getAll("subjects") as string[];

  if (!id || !title) throw new Error("ID and Title are required");

  await handler.execute({
    id,
    title,
    description,
    authors: authors.length > 0 ? authors : ["Unknown Author"],
    genres,
    subjects,
    isTextbook,
  });

  revalidatePath("/books");
  return { success: true };
}

export async function publishBookAction(id: string) {
  const repository = await getRepository();
  const handler = new PublishBookHandler(repository);

  await handler.execute({ id });

  revalidatePath("/books");
  revalidatePath(`/books/${id}`);
  return { success: true };
}
