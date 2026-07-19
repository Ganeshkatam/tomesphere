import { SupabaseClient } from "@supabase/supabase-js";
import { DashboardReadModel } from "../../application/ports/read-models/DashboardReadModel";
import { DashboardOverviewDto } from "../../application/queries/GetDashboardOverview/read-model";

export class SupabaseDashboardReadModel implements DashboardReadModel {
  constructor(private supabase: SupabaseClient) {}

  async getDashboardOverview(userId: string): Promise<DashboardOverviewDto> {
    // We execute several queries in parallel to build the read model for the dashboard.
    // 1. Current Reading & Recent Books (from library_items and books)
    const libraryQuery = this.supabase
      .from("library_items")
      .select(`
        id,
        status,
        progress_percentage,
        updated_at,
        book_id,
        books (
          id,
          title,
          author,
          cover_url
        )
      `)
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    // 2. Reading Goal (from reading_goals)
    const currentYear = new Date().getFullYear();
    const goalsQuery = this.supabase
      .from("reading_goals")
      .select("target_books")
      .eq("user_id", userId)
      .eq("year", currentYear)
      .single();

    // 3. Streak (from user_progress)
    const streakQuery = this.supabase
      .from("user_progress")
      .select("current_streak, longest_streak")
      .eq("user_id", userId)
      .single();

    // 4. Collections count
    const collectionsQuery = this.supabase
      .from("collections")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);

    const [libraryRes, goalsRes, streakRes, collectionsRes] = await Promise.all([
      libraryQuery,
      goalsQuery,
      streakQuery,
      collectionsQuery,
    ]);

    const libraryItems = libraryRes.data || [];
    
    const currentlyReading = libraryItems
      .filter((item: any) => item.status === "reading")
      .slice(0, 3);
      
    const recentBooks = libraryItems
      .filter((item: any) => item.status === "finished")
      .slice(0, 5);
      
    const totalBooks = libraryItems.length;
    const readingCount = libraryItems.filter((i: any) => i.status === "reading").length;
    const wantCount = libraryItems.filter((i: any) => i.status === "want_to_read").length;
    const finishedCount = libraryItems.filter((i: any) => i.status === "finished").length;

    return {
      currentReading: currentlyReading.map((item: any) => ({
        ...item.books,
        progress: item.progress_percentage
      })),
      recentBooks: recentBooks.map((item: any) => item.books),
      progress: {
        booksRead: finishedCount,
        totalBooksGoal: goalsRes.data?.target_books || null,
      },
      streak: {
        current: streakRes.data?.current_streak || 0,
        best: streakRes.data?.longest_streak || 0,
      },
      librarySummary: {
        totalBooks,
        currentlyReadingCount: readingCount,
        wantToReadCount: wantCount,
      },
      collectionsSummary: {
        totalCollections: collectionsRes.count || 0,
      },
    };
  }
}
