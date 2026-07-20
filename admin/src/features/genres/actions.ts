"use server";

import { revalidatePath } from "next/cache";
import {
  CreateGenreHandler,
  UpdateGenreHandler,
  DeleteGenreHandler,
  SupabaseGenreRepository,
} from "../../lib/domain/genres";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "../../../../shared/core/types/database";

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

  return new SupabaseGenreRepository(supabase);
}

export async function createGenreAction(formData: FormData) {
  const repository = await getRepository();
  const handler = new CreateGenreHandler(repository);

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const icon = formData.get("icon") as string;

  if (!name || !slug) throw new Error("Name and Slug are required");

  await handler.execute({
    name,
    slug,
    description: description || undefined,
    icon: icon || undefined,
  });

  revalidatePath("/genres");
  return;
}

export async function updateGenreAction(formData: FormData) {
  const repository = await getRepository();
  const handler = new UpdateGenreHandler(repository);

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const icon = formData.get("icon") as string;

  if (!id) throw new Error("ID is required");

  await handler.execute({
    id,
    name: name || undefined,
    slug: slug || undefined,
    description: description || undefined,
    icon: icon || undefined,
  });

  revalidatePath("/genres");
  revalidatePath(`/genres/${id}`);
  return;
}

export async function deleteGenreAction(id: string) {
  const repository = await getRepository();
  const handler = new DeleteGenreHandler(repository);

  await handler.execute({ id });

  revalidatePath("/genres");
  return;
}
