"use server";

import { revalidatePath } from "next/cache";
import {
  CreateAuthorHandler,
  UpdateAuthorHandler,
  DeleteAuthorHandler,
  SupabaseAuthorRepository,
} from "../../lib/domain/authors";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "../../../../shared/core/types/database";

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

  return new SupabaseAuthorRepository(supabase);
}

export async function createAuthorAction(formData: FormData) {
  const repository = await getRepository();
  const handler = new CreateAuthorHandler(repository);

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const bio = formData.get("bio") as string;
  const avatar_url = formData.get("avatar_url") as string;

  if (!name || !slug) throw new Error("Name and Slug are required");

  await handler.execute({
    name,
    slug,
    bio: bio || undefined,
    avatar_url: avatar_url || undefined,
  });

  revalidatePath("/authors");
  return;
}

export async function updateAuthorAction(formData: FormData) {
  const repository = await getRepository();
  const handler = new UpdateAuthorHandler(repository);

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const bio = formData.get("bio") as string;
  const avatar_url = formData.get("avatar_url") as string;

  if (!id) throw new Error("ID is required");

  await handler.execute({
    id,
    name: name || undefined,
    slug: slug || undefined,
    bio: bio || undefined,
    avatar_url: avatar_url || undefined,
  });

  revalidatePath("/authors");
  revalidatePath(`/authors/${id}`);
  return;
}

export async function deleteAuthorAction(id: string) {
  const repository = await getRepository();
  const handler = new DeleteAuthorHandler(repository);

  await handler.execute({ id });

  revalidatePath("/authors");
  return;
}
