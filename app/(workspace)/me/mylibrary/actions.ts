"use server";

import { createSupabaseServerClient } from "@/shared/core/database/server";
import { SupabaseIdentityProvider } from "@/shared/infrastructure/identity/SupabaseIdentityProvider";
import { SupabaseLibraryReadModel } from "@/modules/library/infrastructure/read-models/SupabaseLibraryReadModel";
import { SupabaseCollectionRepository } from "@/modules/library/infrastructure/repositories/SupabaseCollectionRepository";
import { LibraryPageFacade } from "@/modules/library/application/facades/LibraryPageFacade";
import { LibraryQueryParams } from "@/modules/library/application/ports/read-models/LibraryReadModel";
import { LibraryPageDto } from "@/modules/library/application/dto/response/LibraryPageDto";

export async function getLibraryPageAction(params: LibraryQueryParams): Promise<LibraryPageDto> {
  const supabase = await createSupabaseServerClient();
  const identityProvider = new SupabaseIdentityProvider(supabase);
  const user = await identityProvider.currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const readModel = new SupabaseLibraryReadModel(supabase);
  const collectionRepo = new SupabaseCollectionRepository(supabase);
  const facade = new LibraryPageFacade(readModel, collectionRepo);

  return facade.get(user.id, params);
}
