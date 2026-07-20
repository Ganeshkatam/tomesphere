"use server";

import { revalidatePath } from "next/cache";
import {
  UpdateFeaturedBooksHandler,
  SupabaseFeaturedBookRepository,
  FeaturedBook,
} from "../../lib/domain/featured_books";
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
  return new SupabaseFeaturedBookRepository(supabase);
}

export async function updateFeaturedBooksAction(books: FeaturedBook[]) {
  const repository = await getRepository();
  const handler = new UpdateFeaturedBooksHandler(repository);

  await handler.execute({ books });

  revalidatePath("/featured_books");
  return;
}
