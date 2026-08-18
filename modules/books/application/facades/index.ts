import { BookPageFacade } from "./BookPageFacade";
import { SupabaseBookRepository } from "../../infrastructure/SupabaseBookRepository";
import { createSupabaseServerClient } from "@/shared/core/database/server";

export async function getBookPageFacade() {
  return new BookPageFacade();
}
