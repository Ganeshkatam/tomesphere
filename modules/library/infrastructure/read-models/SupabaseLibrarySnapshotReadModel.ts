import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";
import { LibrarySnapshotReadModel } from "../../application/queries/GetLibrarySnapshotQuery";
import { LibrarySnapshotDto } from "../../application/queries/GetLibrarySnapshotQuery/dto";

export class SupabaseLibrarySnapshotReadModel implements LibrarySnapshotReadModel {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getLibrarySnapshot(userId: string): Promise<LibrarySnapshotDto | null> {
    // 1. Get counts using count aggregations
    const [wantToReadCountRes, currentlyReadingCountRes, finishedCountRes, recentBooksRes] = await Promise.all([
      this.supabase.from("library_books").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("status", "want_to_read"),
      this.supabase.from("library_books").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("status", "currently_reading"),
      this.supabase.from("library_books").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("status", "finished"),
      // 2. Get recent covers
      this.supabase.from("library_books").select("books(cover_url)").eq("user_id", userId).order("updated_at", { ascending: false }).limit(4)
    ]);

    const recentCovers: string[] = [];
    if (recentBooksRes.data) {
      for (const item of recentBooksRes.data) {
        const bookData = Array.isArray(item.books) ? item.books[0] : item.books;
        if (bookData?.cover_url) {
          recentCovers.push(bookData.cover_url);
        }
      }
    }

    return {
      wantToReadCount: wantToReadCountRes.count || 0,
      currentlyReadingCount: currentlyReadingCountRes.count || 0,
      finishedCount: finishedCountRes.count || 0,
      recentCovers
    };
  }
}
