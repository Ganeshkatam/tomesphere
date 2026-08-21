import { SupabaseClient } from "@supabase/supabase-js";
import { DiscoveryReadModel } from "../../application/ports/read-models/DiscoveryReadModel";
import { DiscoveryOverviewDto } from "../../application/queries/GetDiscoveryOverview/read-model";
import { SearchResultDto } from "../../application/queries/SearchBooks/read-model";
import { BookSummaryDto } from "../../application/dto/BookSummaryDto";
import { BookSummaryMapper } from "../../application/mappers/BookSummaryMapper";
import { GetTrendingBooksQuery } from "../../application/queries/GetTrendingBooks/query";
import { TrendingBooksResponseDto } from "../../application/queries/GetTrendingBooks/response";

export class SupabaseDiscoveryReadModel implements DiscoveryReadModel {
  constructor(private readonly supabase: SupabaseClient) {}

  async getOverview(): Promise<DiscoveryOverviewDto> {
    const [
      featuredRes,
      newBooksRes,
      trendingRes,
      classicsRes,
      philosophyRes,
      scienceRes,
      historyRes,
      curatedRes,
      authorsRes,
      genresRes,
      subjectsRes,
    ] = await Promise.all([
      this.supabase
        .from("books")
        .select(
          "id, title, cover_url, languages(name), release_date, is_featured, book_authors(position, authors(id, name, slug)), book_genres(genres(id, name))",
        )
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(10),
      this.supabase
        .from("books")
        .select(
          "id, title, cover_url, languages(name), release_date, is_featured, book_authors(position, authors(id, name, slug)), book_genres(genres(id, name))",
        )
        .order("created_at", { ascending: false })
        .limit(16),
      this.supabase
        .from("trending_books_projection")
        .select(
          "books!inner(id, title, cover_url, languages(name), release_date, is_featured, book_authors(position, authors(id, name, slug)), book_genres(genres(id, name)))",
        )
        .order("daily_score", { ascending: false })
        .limit(16),
      this.supabase
        .from("books")
        .select(
          "id, title, cover_url, languages(name), release_date, is_featured, book_authors(position, authors(id, name, slug)), book_genres(genres(id, name))",
        )
        .order("title", { ascending: true })
        .limit(16),
      this.supabase
        .from("books")
        .select(
          "id, title, cover_url, languages(name), release_date, is_featured, book_authors(position, authors(id, name, slug)), book_genres(genres(id, name))",
        )
        .order("title", { ascending: false })
        .limit(16),
      this.supabase
        .from("books")
        .select(
          "id, title, cover_url, languages(name), release_date, is_featured, book_authors(position, authors(id, name, slug)), book_genres(genres(id, name))",
        )
        .order("release_date", { ascending: true, nullsFirst: false })
        .limit(16),
      this.supabase
        .from("books")
        .select(
          "id, title, cover_url, languages(name), release_date, is_featured, book_authors(position, authors(id, name, slug)), book_genres(genres(id, name))",
        )
        .order("id", { ascending: false })
        .limit(16),
      this.supabase
        .from("books")
        .select(
          "id, title, cover_url, languages(name), release_date, is_featured, book_authors(position, authors(id, name, slug)), book_genres(genres(id, name))",
        )
        .order("release_date", { ascending: false, nullsFirst: false })
        .limit(16),
      this.supabase.from("authors").select("name").limit(12),
      this.supabase.from("genres").select("name").limit(12),
      this.supabase.from("subjects").select("name").limit(12),
    ]);

    // Distinct Genres (max 12 for preview)
    const genres = (genresRes.data || []).map((g: any) => g.name);
    const authors = (authorsRes.data || []).map((a: any) => a.name);
    const subjects = (subjectsRes.data || []).map((s: any) => s.name);
    const languages = ["English"]; // Placeholder since we don't have a languages table yet

    const trendingBooksData = (trendingRes.data || []).map(
      (row: any) => row.books,
    );

    return {
      featuredBooks: (featuredRes.data || []).map(BookSummaryMapper.toDto),
      trendingBooks: trendingBooksData.map(BookSummaryMapper.toDto),
      newBooks: (newBooksRes.data || []).map(BookSummaryMapper.toDto),
      classicsBooks: (classicsRes.data || []).map(BookSummaryMapper.toDto),
      philosophyBooks: (philosophyRes.data || []).map(BookSummaryMapper.toDto),
      scienceBooks: (scienceRes.data || []).map(BookSummaryMapper.toDto),
      historyBooks: (historyRes.data || []).map(BookSummaryMapper.toDto),
      curatedBooks: (curatedRes.data || []).map(BookSummaryMapper.toDto),
      featuredCollections: [], // Placeholder for V1 until collections table exists
      genres,
      subjects,
      languages,
      authors,
    };
  }

  async searchBooks(
    query: string,
    genre: string,
    page: number,
    pageSize: number,
    sort: string,
  ): Promise<SearchResultDto> {
    const safePage = Math.max(1, Math.floor(page));
    const safePageSize = Math.max(1, Math.min(pageSize, 100));

    const { data: searchResult, error: rpcError } = await this.supabase.rpc(
      "execute_book_search_v1",
      {
        p_query: query || "",
        p_genres: genre && genre !== "all" ? [genre] : [],
        p_page: safePage,
        p_page_size: safePageSize,
        p_include_unavailable: false,
        p_languages: [],
        p_publication_years: [],
        p_sort: sort || "relevance",
        p_subjects: [],
      },
    );

    if (rpcError || !searchResult || searchResult.length === 0) {
      return {
        books: [],
        totalCount: 0,
        page: safePage,
        pageSize: safePageSize,
      };
    }

    const matchingIds = searchResult.map((r: any) => r.book_id);
    const totalCount =
      searchResult.length > 0 ? Number(searchResult[0].total_count) : 0;

    let dbQuery = this.supabase
      .from("books")
      .select(
        "id, title, cover_url, languages(name), release_date, is_featured, book_authors(position, authors(id, name, slug)), book_genres(genres(id, name))",
      )
      .in("id", matchingIds);

    if (sort === "newest") {
      dbQuery = dbQuery.order("created_at", { ascending: false });
    } else {
      dbQuery = dbQuery.order("title", { ascending: true });
    }

    const { data } = await dbQuery;

    return {
      books: (data || []).map(BookSummaryMapper.toDto),
      totalCount,
      page: safePage,
      pageSize: safePageSize,
    };
  }

  async getSearchSuggestions(query: string): Promise<Partial<BookSummaryDto>[]> {
    if (!query || query.length < 2) return [];

    const { data } = await this.supabase
      .from("books")
      .select(
        "id, title, book_authors(position, authors(id, name, slug)), book_genres(genres(name))",
      )
      .ilike("title", `%${query}%`)
      .limit(5);

    return (data || []).map((b: any) => ({
      id: b.id,
      title: b.title,
      authors:
        b.book_authors?.map((ba: any) => ba.authors).filter(Boolean) || [],
      genres: b.book_genres?.map((bg: any) => bg.genres).filter(Boolean) || [],
    }));
  }

  async getTrendingBooks(
    query: GetTrendingBooksQuery,
  ): Promise<TrendingBooksResponseDto> {
    const periodScoreMap = {
      daily: "daily_score",
      weekly: "weekly_score",
      monthly: "monthly_score",
      "all-time": "all_time_score",
    };
    const periodRankMap = {
      daily: "daily_rank",
      weekly: "weekly_rank",
      monthly: "monthly_rank",
      "all-time": "all_time_rank",
    };
    const scoreCol = periodScoreMap[query.period];
    const rankCol = periodRankMap[query.period];

    let dbQuery = this.supabase
      .from("trending_books_projection")
      .select(
        `
        ${scoreCol},
        ${rankCol},
        books!inner (
          id, title, cover_url, languages(name), is_featured, release_date,
          book_authors(position, authors(id, name, slug)), book_genres(genres(id, name))
        )
      `,
        { count: "exact" },
      )
      .order(scoreCol, { ascending: false });

    const start = (query.page - 1) * query.limit;
    const end = start + query.limit - 1;
    dbQuery = dbQuery.range(start, end);

    const { data, count, error } = await dbQuery;

    if (error) {
      console.error("Error fetching trending books:", error);
    }

    const books = (data || []).map((row: any) => ({
      ...BookSummaryMapper.toDto(row.books),
      trendingScore: row[scoreCol],
      rank: row[rankCol],
    }));

    return {
      books,
      period: query.period,
      page: query.page,
      pageSize: query.limit,
      totalCount: count || 0,
      hasNext: count ? start + query.limit < count : false,
      updatedAt: new Date().toISOString(),
    };
  }

  async getFeaturedBooks(
    query: import("../../application/queries/GetFeaturedBooks/query").GetFeaturedBooksQuery,
  ): Promise<
    import("../../application/queries/GetFeaturedBooks/response").GetFeaturedBooksResponseDto
  > {
    const limit = query.limit || 6;
    const { data } = await this.supabase
      .from("books")
      .select(
        "id, title, cover_url, languages(name), release_date, is_featured, book_authors(position, authors(id, name, slug)), book_genres(genres(id, name))",
      )
      .eq("is_featured", true)
      .limit(limit);

    const items = (data || []).map(BookSummaryMapper.toDto);
    return {
      items,
      total: items.length,
      page: query.page,
      hasMore: false,
    };
  }

  async getNewArrivals(
    query: import("../../application/queries/GetNewArrivals/query").GetNewArrivalsQuery,
  ): Promise<
    import("../../application/queries/GetNewArrivals/response").GetNewArrivalsResponseDto
  > {
    const limit = query.limit || 6;
    const { data } = await this.supabase
      .from("books")
      .select(
        "id, title, cover_url, languages(name), release_date, is_featured, book_authors(position, authors(id, name, slug)), book_genres(genres(id, name))",
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    const items = (data || []).map(BookSummaryMapper.toDto);
    return {
      items,
      total: items.length,
      page: query.page,
      hasMore: false,
    };
  }

  async getCollections(
    query: import("../../application/queries/GetCollections/query").GetCollectionsQuery,
  ): Promise<
    import("../../application/queries/GetCollections/response").GetCollectionsResponseDto
  > {
    return {
      items: [],
      total: 0,
      page: query.page,
      hasMore: false,
    };
  }

  async getGenres(
    query: import("../../application/queries/GetGenres/query").GetGenresQuery,
  ): Promise<
    import("../../application/queries/GetGenres/response").GetGenresResponseDto
  > {
    const limit = query.limit || 12;
    const { data } = await this.supabase.from("genres").select("name").limit(limit);
    const items = (data || []).map((g: any) => g.name);
    return {
      items,
      total: items.length,
      page: query.page,
      hasMore: false,
    };
  }

  async getAuthors(
    query: import("../../application/queries/GetAuthors/query").GetAuthorsQuery,
  ): Promise<{ items: import("../../application/dto/AuthorCardDto").AuthorCardDto[], total: number, page: number, hasMore: boolean }> {
    const page = query.page || 1;
    const limit = query.limit || 24;
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data, count } = await this.supabase
      .from("authors")
      .select("id, slug, name, avatar_url, book_authors(count)", { count: "exact" })
      .range(start, end);

    const items = (data || []).map((row: any) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      imageUrl: row.avatar_url || null,
      bookCount: row.book_authors?.[0]?.count ?? row.book_authors?.length ?? 0,
    }));

    return {
      items,
      total: count || 0,
      page,
      hasMore: (count || 0) > end + 1,
    };
  }

  async getLanguages(
    query: import("../../application/queries/GetLanguages/query").GetLanguagesQuery,
  ): Promise<
    import("../../application/queries/GetLanguages/response").GetLanguagesResponseDto
  > {
    const items = ["English"];
    return {
      items,
      total: items.length,
      page: query.page,
      hasMore: false,
    };
  }

  async getSubjects(
    query: import("../../application/queries/GetSubjects/query").GetSubjectsQuery,
  ): Promise<
    import("../../application/queries/GetSubjects/response").GetSubjectsResponseDto
  > {
    const limit = query.limit || 12;
    const { data } = await this.supabase.from("subjects").select("name").limit(limit);
    const items = (data || []).map((s: any) => s.name);
    return {
      items,
      total: items.length,
      page: query.page,
      hasMore: false,
    };
  }
}
