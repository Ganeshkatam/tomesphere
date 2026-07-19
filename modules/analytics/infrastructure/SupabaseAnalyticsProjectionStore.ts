import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";

export interface AnalyticsProjectionStore {
  recordPagesRead(
    userId: string,
    bookId: string,
    pagesDelta: number,
    dateStr: string,
  ): Promise<void>;
  recordBookCompleted(
    userId: string,
    bookId: string,
    dateStr: string,
  ): Promise<void>;
  recordBookStarted(
    userId: string,
    bookId: string,
    dateStr: string,
  ): Promise<void>;
  updateBookRating(
    userId: string,
    bookId: string,
    rating: number,
  ): Promise<void>;
  recordBookLiked(userId: string, bookId: string): Promise<void>;
}

export class SupabaseAnalyticsProjectionStore implements AnalyticsProjectionStore {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  private async getBookGenre(bookId: string): Promise<string | null> {
    const { data } = await this.supabase
      .from("books")
      .select("book_genres(genres(name))")
      .eq("id", bookId)
      .single();
    return (data as any)?.book_genres?.[0]?.genres?.name || null;
  }

  async recordPagesRead(
    userId: string,
    bookId: string,
    pagesDelta: number,
    dateStr: string,
  ): Promise<void> {
    if (pagesDelta <= 0) return;

    const monthStr = dateStr.substring(0, 7);
    const genre = await this.getBookGenre(bookId);

    // Daily
    await this.supabase.rpc("increment_analytics_daily_pages" as any, {
      p_user_id: userId,
      p_date: dateStr,
      p_pages: pagesDelta,
    });

    // Monthly
    await this.supabase.rpc("increment_analytics_monthly_pages" as any, {
      p_user_id: userId,
      p_month: monthStr,
      p_pages: pagesDelta,
    });

    // Genre
    if (genre) {
      await this.supabase.rpc("increment_analytics_genre_pages" as any, {
        p_user_id: userId,
        p_genre: genre,
        p_pages: pagesDelta,
      });
    }

    // Book Stats
    await this.supabase.rpc("increment_analytics_book_pages" as any, {
      p_book_id: bookId,
      p_pages: pagesDelta,
    });
  }

  async recordBookCompleted(
    userId: string,
    bookId: string,
    dateStr: string,
  ): Promise<void> {
    const monthStr = dateStr.substring(0, 7);
    const genre = await this.getBookGenre(bookId);

    // Daily
    await this.supabase.rpc("increment_analytics_daily_completed" as any, {
      p_user_id: userId,
      p_date: dateStr,
    });

    // Monthly
    await this.supabase.rpc("increment_analytics_monthly_completed" as any, {
      p_user_id: userId,
      p_month: monthStr,
    });

    // Genre
    if (genre) {
      await this.supabase.rpc("increment_analytics_genre_completed" as any, {
        p_user_id: userId,
        p_genre: genre,
      });
    }

    // Book Stats
    await this.supabase.rpc("increment_analytics_book_completed" as any, {
      p_book_id: bookId,
    });
  }

  async recordBookStarted(
    userId: string,
    bookId: string,
    dateStr: string,
  ): Promise<void> {
    const genre = await this.getBookGenre(bookId);

    // Genre
    if (genre) {
      await this.supabase.rpc("increment_analytics_genre_started" as any, {
        p_user_id: userId,
        p_genre: genre,
      });
    }

    // Book Stats (Reads count)
    await this.supabase.rpc("increment_analytics_book_reads" as any, {
      p_book_id: bookId,
    });
  }

  async updateBookRating(
    userId: string,
    bookId: string,
    rating: number,
  ): Promise<void> {
    const genre = await this.getBookGenre(bookId);

    // Genre
    if (genre) {
      await this.supabase.rpc("increment_analytics_genre_rating" as any, {
        p_user_id: userId,
        p_genre: genre,
      });
    }

    await this.supabase.rpc("recalculate_analytics_book_rating" as any, {
      p_book_id: bookId,
    });
  }

  async recordBookLiked(userId: string, bookId: string): Promise<void> {
    const genre = await this.getBookGenre(bookId);

    if (genre) {
      await this.supabase.rpc("increment_analytics_genre_likes" as any, {
        p_user_id: userId,
        p_genre: genre,
      });
    }
  }
}
