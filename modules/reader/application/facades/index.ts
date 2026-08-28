import { createSupabaseServerClient } from "@/shared/core/database/server";
import { SupabaseIdentityProvider } from "@/shared/infrastructure/identity/SupabaseIdentityProvider";
import { SupabaseBookRepository } from "@/modules/books/infrastructure/SupabaseBookRepository";
import { ReaderFacade } from "./ReaderFacade";

export async function executeReaderFacade(bookId: string) {
  const supabase = await createSupabaseServerClient();
  const identityProvider = new SupabaseIdentityProvider(supabase);
  const bookRepository = new SupabaseBookRepository(supabase);

  const facade = new ReaderFacade(identityProvider, bookRepository, supabase);
  return facade.getReaderPage(bookId);
}
