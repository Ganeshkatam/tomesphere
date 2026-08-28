import { SupabaseClient } from "@supabase/supabase-js";
import { DiscoveryReadModel } from "../../application/ports/read-models/DiscoveryReadModel";
import {
  DiscoveryOverviewDto,
  DiscoverySectionDto,
} from "../../application/queries/GetDiscoveryOverview/read-model";
import { SearchResultDto } from "../../application/queries/SearchBooks/read-model";
import { BookSummaryDto } from "../../application/dto/BookSummaryDto";
import { AuthorCardDto } from "../../application/dto/AuthorCardDto";
import { CollectionSummaryDto } from "../../application/dto/CollectionSummaryDto";
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
      collectionsRes,
      catalogRes,
      authorsRes,
      genresRes,
      subjectsRes,
    ] = await Promise.all([
      // 1. Curated Featured Books (from featured_books table joined with books)
      this.supabase
        .from("featured_books")
        .select(
          "position, books!inner(id, title, cover_url, languages(name), release_date, is_featured, book_authors(position, authors(id, name, slug)), book_genres(genres(id, name)))"
        )
        .order("position", { ascending: true })
        .limit(10),

      // 2. New Acquisitions / Recent Additions (ordered by release_date DESC)
      this.supabase
        .from("books")
        .select(
          "id, title, cover_url, languages(name), release_date, is_featured, book_authors(position, authors(id, name, slug)), book_genres(genres(id, name))",
        )
        .order("release_date", { ascending: false, nullsFirst: false })
        .limit(20),

      // 3. Trending Books (from trending_books_projection ordered by daily_score)
      this.supabase
        .from("trending_books_projection")
        .select(
          "daily_score, books!inner(id, title, cover_url, languages(name), release_date, is_featured, book_authors(position, authors(id, name, slug)), book_genres(genres(id, name)))",
        )
        .order("daily_score", { ascending: false })
        .limit(16),

      // 4. Featured Collections (from collections table)
      this.supabase
        .from("collections")
        .select("id, title, slug, description, cover_url, is_active, collection_books(count)")
        .eq("is_active", true)
        .order("created_at", { ascending: true })
        .limit(10),

      // 5. Full Catalog for canonical categorical discipline mapping
      this.supabase
        .from("books")
        .select(
          "id, title, cover_url, languages(name), release_date, is_featured, book_authors(position, authors(id, name, slug)), book_genres(genres(id, name))",
        )
        .order("title", { ascending: true }),

      // 6. Taxonomies & Top Authors
      this.supabase
        .from("authors")
        .select("id, name, slug, bio, avatar_url, book_authors(count)")
        .order("name", { ascending: true })
        .limit(20),
      this.supabase.from("genres").select("name").limit(20),
      this.supabase.from("subjects").select("name").limit(20),
    ]);

    // Distinct Genres, Authors, Subjects
    const genres = (genresRes.data || []).map((g: any) => g.name);
    const authors = (authorsRes.data || []).map((a: any) => a.name);
    const subjects = (subjectsRes.data || []).map((s: any) => s.name);
    const languages = ["English"];

    const topAuthors: AuthorCardDto[] = (authorsRes.data || [])
      .map((a: any) => ({
        id: a.id,
        name: a.name,
        slug: a.slug || a.id,
        imageUrl: a.avatar_url,
        bookCount: a.book_authors?.[0]?.count || 0,
      }))
      .filter((a) => a.bookCount > 0);

    const featuredBooksData =
      featuredRes.data && featuredRes.data.length > 0
        ? (featuredRes.data as any[]).map((r) => r.books)
        : [];

    const trendingBooksData =
      trendingRes.data && trendingRes.data.length > 0
        ? (trendingRes.data as any[]).map((row: any) => row.books)
        : [];

    const featuredCollections: CollectionSummaryDto[] = (collectionsRes.data || []).map((col: any) => ({
      id: col.id,
      title: col.title,
      slug: col.slug,
      description: col.description,
      bookCount: col.collection_books?.[0]?.count || 0,
    }));

    const allCatalog = (catalogRes.data || []).map(BookSummaryMapper.toDto);

    // Build generalized catalog-driven sections
    const sections: DiscoverySectionDto[] = [
      {
        id: "cybersecurity",
        title: "Cybersecurity & Offensive Defense",
        slug: "cybersecurity",
        description: "Deep technical treatises on application security, exploitation, and vulnerability discovery.",
        actionHref: "/search?genre=Cybersecurity",
        actionLabel: "Explore security",
        iconName: "Shield",
        iconBg: "bg-slate-900 border-slate-700 text-emerald-400",
        books: allCatalog.filter((b) =>
          b.genres.some((g) => g.name.toLowerCase() === "cybersecurity")
        ),
      },
      {
        id: "programming",
        title: "Software Engineering & Programming",
        slug: "programming",
        description: "Foundations of computing, software systems, algorithms, and practical programming languages.",
        actionHref: "/search?genre=Programming",
        actionLabel: "View programming",
        iconName: "Code2",
        iconBg: "bg-blue-50 dark:bg-blue-950/60 border-blue-200/60 dark:border-blue-800/60 text-blue-600 dark:text-blue-400",
        books: allCatalog.filter((b) =>
          b.genres.some((g) => g.name.toLowerCase() === "programming") &&
          !b.genres.some((g) => g.name.toLowerCase() === "cybersecurity")
        ),
      },
      {
        id: "mathematics",
        title: "Vedic Mathematics & Speed Calculation",
        slug: "mathematics",
        description: "Ancient mental arithmetic methods, speed calculation techniques, and applied mathematical systems.",
        actionHref: "/search?genre=Mathematics",
        actionLabel: "Explore math",
        iconName: "Compass",
        iconBg: "bg-amber-50 dark:bg-amber-950/60 border-amber-200/60 dark:border-amber-800/60 text-amber-600 dark:text-amber-400",
        books: allCatalog.filter((b) =>
          b.genres.some((g) => ["mathematics", "vedic mathematics"].includes(g.name.toLowerCase()))
        ),
      },
      {
        id: "yoga",
        title: "Yoga, Asanas & Holistic Health",
        slug: "yoga",
        description: "Classical postures, breathing practices, and physical wellness disciplines.",
        actionHref: "/search?genre=Yoga",
        actionLabel: "View yoga guides",
        iconName: "HeartHandshake",
        iconBg: "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/60 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400",
        books: allCatalog.filter((b) =>
          b.genres.some((g) => g.name.toLowerCase() === "yoga")
        ),
      },
      {
        id: "philosophy",
        title: "Philosophy & Transformative Wisdom",
        slug: "philosophy",
        description: "Essential works on purpose, mindfulness, stoicism, and the human condition.",
        actionHref: "/search?genre=Philosophy",
        actionLabel: "Explore philosophy",
        iconName: "Brain",
        iconBg: "bg-purple-50 dark:bg-purple-950/60 border-purple-200/60 dark:border-purple-800/60 text-purple-600 dark:text-purple-400",
        books: allCatalog.filter((b) =>
          b.genres.some((g) => ["spirituality", "fiction", "novels"].includes(g.name.toLowerCase())) &&
          !b.genres.some((g) => g.name.toLowerCase() === "biography")
        ),
      },
      {
        id: "biography",
        title: "Biographies & Inspiring Memoirs",
        slug: "biography",
        description: "Lived journeys of visionaries, leaders, and remarkable historical figures.",
        actionHref: "/search?genre=Biography",
        actionLabel: "View memoirs",
        iconName: "Landmark",
        iconBg: "bg-orange-50 dark:bg-orange-950/60 border-orange-200/60 dark:border-orange-800/60 text-orange-600 dark:text-orange-400",
        books: allCatalog.filter((b) =>
          b.genres.some((g) => g.name.toLowerCase() === "biography")
        ),
      },
      {
        id: "art",
        title: "Visual Arts & Design Anatomy",
        slug: "art",
        description: "Classical drawing fundamentals, aesthetic principles, and proportion studies.",
        actionHref: "/search?genre=Art",
        actionLabel: "Explore art books",
        iconName: "Palette",
        iconBg: "bg-pink-50 dark:bg-pink-950/60 border-pink-200/60 dark:border-pink-800/60 text-pink-600 dark:text-pink-400",
        books: allCatalog.filter((b) =>
          b.genres.some((g) => ["art", "drawing"].includes(g.name.toLowerCase()))
        ),
      },
    ].filter((s) => s.books.length > 0);

    return {
      featuredBooks: featuredBooksData.map(BookSummaryMapper.toDto),
      trendingBooks: trendingBooksData.map(BookSummaryMapper.toDto),
      newBooks: (newBooksRes.data || []).map(BookSummaryMapper.toDto),
      sections,
      featuredCollections,
      topAuthors,
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
    const scoreCol = periodScoreMap[query.period] || "daily_score";
    const rankCol = periodRankMap[query.period] || "daily_rank";

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
      .from("featured_books")
      .select(
        "position, books!inner(id, title, cover_url, languages(name), release_date, is_featured, book_authors(position, authors(id, name, slug)), book_genres(genres(id, name)))"
      )
      .order("position", { ascending: true })
      .limit(limit);

    const items = (data || []).map((r: any) => BookSummaryMapper.toDto(r.books));
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
      .order("release_date", { ascending: false, nullsFirst: false })
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
    const limit = query.limit || 12;
    const { data, count } = await this.supabase
      .from("collections")
      .select("id, title, slug, description, cover_url, is_active, collection_books(count)", {
        count: "exact",
      })
      .eq("is_active", true)
      .order("created_at", { ascending: true })
      .limit(limit);

    const items = (data || []).map((col: any) => ({
      id: col.id,
      title: col.title,
      slug: col.slug,
      description: col.description,
      coverUrl: col.cover_url,
      bookCount: col.collection_books?.[0]?.count || 0,
    }));

    return {
      items,
      total: count || items.length,
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
