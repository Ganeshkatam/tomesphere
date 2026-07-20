"use server";

import { revalidatePath } from "next/cache";
import {
  CreateCollectionHandler,
  UpdateCollectionHandler,
  UpdateCollectionBooksHandler,
  DeleteCollectionHandler,
  SupabaseCollectionRepository,
} from "../../lib/domain/collections";
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

  return new SupabaseCollectionRepository(supabase);
}

export async function createCollectionAction(formData: FormData) {
  const repository = await getRepository();
  const handler = new CreateCollectionHandler(repository);

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const cover_url = formData.get("cover_url") as string;
  const is_active = formData.get("is_active") === "on";

  if (!title || !slug) throw new Error("Title and Slug are required");

  await handler.execute({
    title,
    slug,
    description: description || null,
    cover_url: cover_url || null,
    is_active,
  });

  revalidatePath("/collections");
  return;
}

export async function updateCollectionAction(formData: FormData) {
  const repository = await getRepository();
  const handler = new UpdateCollectionHandler(repository);

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const cover_url = formData.get("cover_url") as string;
  const is_active = formData.get("is_active") === "on";

  if (!id) throw new Error("ID is required");

  await handler.execute({
    id,
    title: title || undefined,
    slug: slug || undefined,
    description: description || null,
    cover_url: cover_url || null,
    is_active,
  });

  revalidatePath("/collections");
  revalidatePath(`/collections/${id}`);
  return;
}

export async function updateCollectionBooksAction(
  collectionId: string,
  bookIds: string[],
) {
  const repository = await getRepository();
  const handler = new UpdateCollectionBooksHandler(repository);

  await handler.execute({ collectionId, bookIds });

  revalidatePath("/collections");
  revalidatePath(`/collections/${collectionId}`);
  return;
}

export async function deleteCollectionAction(id: string) {
  const repository = await getRepository();
  const handler = new DeleteCollectionHandler(repository);

  await handler.execute({ id });

  revalidatePath("/collections");
  return;
}
