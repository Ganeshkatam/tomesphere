import { SupabaseClient } from "@supabase/supabase-js";
import { PlatformStatisticsReadModel } from "../../application/ports/read-models/PlatformStatisticsReadModel";
import { PlatformStatisticsDto } from "../../application/queries/GetPlatformStatistics/read-model";

export class SupabasePlatformStatisticsReadModel implements PlatformStatisticsReadModel {
  constructor(private readonly supabase: SupabaseClient) {}

  async getStatistics(): Promise<PlatformStatisticsDto> {
    const [booksRes, authorsRes, genresRes] = await Promise.all([
      this.supabase.from("books").select("*", { count: "exact", head: true }),
      this.supabase.from("books").select("author"),
      this.supabase.from("books").select("genre"),
    ]);

    const booksCount = booksRes.count || 0;

    const authorsSet = new Set<string>();
    (authorsRes.data || []).forEach((b: any) => {
      if (b.author) authorsSet.add(b.author);
    });
    const authorsCount = authorsSet.size;

    const genresSet = new Set<string>();
    (genresRes.data || []).forEach((b: any) => {
      if (b.genre) genresSet.add(b.genre);
    });
    const genresCount = genresSet.size;

    return {
      booksCount,
      authorsCount,
      genresCount,
    };
  }
}
