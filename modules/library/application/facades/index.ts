import { createSupabaseServerClient } from "@/shared/core/database/server";
import { SupabaseLibraryRepository } from "../../infrastructure/SupabaseLibraryRepository";
import { SupabaseBookRepository } from "../../../books/infrastructure/SupabaseBookRepository";
import { LibraryPageFacade } from "./LibraryPageFacade";

export async function executeLibraryPageFacade(userId: string) {
  const supabase = await createSupabaseServerClient();
  const libraryRepo = new SupabaseLibraryRepository(supabase);
  const bookRepo = new SupabaseBookRepository(supabase);
  
  const facade = new LibraryPageFacade(libraryRepo, bookRepo);
  return facade.get(userId);
}
