"use server";

import { revalidatePath } from "next/cache";
import {
  CreateAnnouncementHandler,
  UpdateAnnouncementHandler,
  DeleteAnnouncementHandler,
  SupabaseAnnouncementRepository,
} from "../../lib/domain/announcements";
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

  return new SupabaseAnnouncementRepository(supabase);
}

export async function createAnnouncementAction(formData: FormData) {
  const repository = await getRepository();
  const handler = new CreateAnnouncementHandler(repository);

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const type = formData.get("type") as string;
  const link_url = formData.get("link_url") as string;
  const link_text = formData.get("link_text") as string;
  const starts_at = formData.get("starts_at") as string;
  const ends_at = formData.get("ends_at") as string;
  const is_active = formData.get("is_active") === "on";
  const is_dismissible = formData.get("is_dismissible") === "on";

  if (!title || !content || !type)
    throw new Error("Title, Content, and Type are required");

  await handler.execute({
    title,
    content,
    type,
    link_url: link_url || null,
    link_text: link_text || null,
    is_active,
    is_dismissible,
    starts_at: starts_at ? new Date(starts_at).toISOString() : null,
    ends_at: ends_at ? new Date(ends_at).toISOString() : null,
  });

  revalidatePath("/announcements");
  return;
}

export async function updateAnnouncementAction(formData: FormData) {
  const repository = await getRepository();
  const handler = new UpdateAnnouncementHandler(repository);

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const type = formData.get("type") as string;
  const link_url = formData.get("link_url") as string;
  const link_text = formData.get("link_text") as string;
  const starts_at = formData.get("starts_at") as string;
  const ends_at = formData.get("ends_at") as string;
  const is_active = formData.get("is_active") === "on";
  const is_dismissible = formData.get("is_dismissible") === "on";

  if (!id) throw new Error("ID is required");

  await handler.execute({
    id,
    title: title || undefined,
    content: content || undefined,
    type: type || undefined,
    link_url: link_url || null,
    link_text: link_text || null,
    is_active,
    is_dismissible,
    starts_at: starts_at ? new Date(starts_at).toISOString() : null,
    ends_at: ends_at ? new Date(ends_at).toISOString() : null,
  });

  revalidatePath("/announcements");
  revalidatePath(`/announcements/${id}`);
  return;
}

export async function deleteAnnouncementAction(id: string) {
  const repository = await getRepository();
  const handler = new DeleteAnnouncementHandler(repository);

  await handler.execute({ id });

  revalidatePath("/announcements");
  return;
}
