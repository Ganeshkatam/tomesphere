import { SupabaseClient } from "@supabase/supabase-js";
import { ExportUserDataQuery } from "./ExportUserDataQuery";
import { Database } from "@/modules/shared/core/types/database";

export class ExportUserDataHandler {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async execute(query: ExportUserDataQuery): Promise<any> {
    const userId = query.userId;

    const [
      profileResult,
      libraryResult,
      collectionsResult,
      bookmarksResult,
      highlightsResult,
      sessionsResult,
      positionsResult
    ] = await Promise.all([
      this.supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      this.supabase.from("library_books").select("*").eq("user_id", userId),
      this.supabase.from("shelves").select("*, shelf_items(*)").eq("user_id", userId),
      this.supabase.from("bookmarks").select("*").eq("user_id", userId),
      this.supabase.from("highlights").select("*").eq("user_id", userId),
      this.supabase.from("reader_sessions").select("*").eq("user_id", userId),
      this.supabase.from("reader_positions").select("*").eq("user_id", userId)
    ]);

    return {
      export_date: new Date().toISOString(),
      user_id: userId,
      profile: profileResult || {},
      library_books: libraryResult || [],
      collections: collectionsResult || [],
      bookmarks: bookmarksResult || [],
      highlights: highlightsResult || [],
      reading_sessions: sessionsResult || [],
      reading_positions: positionsResult || [],
    };
  }
}
