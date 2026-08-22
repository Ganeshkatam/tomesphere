import { SupabaseClient } from "@supabase/supabase-js";
import { SupabaseNotesReadModel } from "../../infrastructure/read-models/SupabaseNotesReadModel";
import { SupabaseAnnotationsReadModel } from "../../infrastructure/read-models/SupabaseAnnotationsReadModel";
import { NotesPageFacade } from "./NotesPageFacade";
import { AnnotationsPageFacade } from "./AnnotationsPageFacade";

export function executeNotesPageFacade(supabase: SupabaseClient, userId: string, limit?: number, cursor?: string | null) {
  const readModel = new SupabaseNotesReadModel(supabase);
  const facade = new NotesPageFacade(readModel);
  return facade.execute(userId, limit, cursor);
}

export function executeAnnotationsPageFacade(supabase: SupabaseClient, userId: string, limit?: number, cursor?: string | null) {
  const readModel = new SupabaseAnnotationsReadModel(supabase);
  const facade = new AnnotationsPageFacade(readModel);
  return facade.execute(userId, limit, cursor);
}
