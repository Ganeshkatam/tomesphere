import { BookPageFacade } from "./BookPageFacade";
import { SupabaseBookRepository } from "../../infrastructure/SupabaseBookRepository";
import { createSupabaseServerClient } from "@/shared/core/database/server";

export async function getBookPageFacade() {
  const supabase = await createSupabaseServerClient();
  const repo = new SupabaseBookRepository(supabase);
  return new BookPageFacade(repo);
}
