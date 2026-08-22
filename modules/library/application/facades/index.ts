import { createSupabaseServerClient } from "@/shared/core/database/server";
import { SupabaseLibraryReadModel } from "../../infrastructure/read-models/SupabaseLibraryReadModel";
import { SupabaseCollectionRepository } from "../../infrastructure/repositories/SupabaseCollectionRepository";
import { LibraryPageFacade } from "./LibraryPageFacade";
import { LibraryQueryParams } from "../ports/read-models/LibraryReadModel";
import { LibraryPageDto } from "../dto/response/LibraryPageDto";

export async function executeLibraryPageFacade(
  userId: string,
  params: LibraryQueryParams = { viewType: "overview", viewId: "overview" },
): Promise<LibraryPageDto> {
  const supabase = await createSupabaseServerClient();
  const readModel = new SupabaseLibraryReadModel(supabase);
  const collectionRepo = new SupabaseCollectionRepository(supabase);

  const facade = new LibraryPageFacade(readModel, collectionRepo);
  return facade.get(userId, params);
}

export async function executeShelvesPageFacade(
  userId: string,
): Promise<any> {
  const supabase = await createSupabaseServerClient();
  const readModel = new SupabaseLibraryReadModel(supabase);

  // Dynamic import or just use ShelvesPageFacade
  const { ShelvesPageFacade } = await import("./ShelvesPageFacade");
  const facade = new ShelvesPageFacade(readModel);
  return facade.get(userId);
}
