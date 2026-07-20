const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'modules', 'discovery', 'infrastructure', 'read-models', 'SupabaseDiscoveryReadModel.ts');
let content = fs.readFileSync(filePath, 'utf8');

const newMethods = `
  async getFeaturedBooks(query: import("../../application/queries/GetFeaturedBooks/query").GetFeaturedBooksQuery): Promise<import("../../application/queries/GetFeaturedBooks/response").GetFeaturedBooksResponseDto> {
    const overview = await this.getOverview();
    return {
      items: overview.featuredBooks || [],
      total: (overview.featuredBooks || []).length,
      page: query.page,
      hasMore: false,
    };
  }

  async getNewArrivals(query: import("../../application/queries/GetNewArrivals/query").GetNewArrivalsQuery): Promise<import("../../application/queries/GetNewArrivals/response").GetNewArrivalsResponseDto> {
    const overview = await this.getOverview();
    return {
      items: overview.newBooks || [],
      total: (overview.newBooks || []).length,
      page: query.page,
      hasMore: false,
    };
  }

  async getCollections(query: import("../../application/queries/GetCollections/query").GetCollectionsQuery): Promise<import("../../application/queries/GetCollections/response").GetCollectionsResponseDto> {
    const overview = await this.getOverview();
    return {
      items: overview.featuredCollections || [],
      total: (overview.featuredCollections || []).length,
      page: query.page,
      hasMore: false,
    };
  }

  async getGenres(query: import("../../application/queries/GetGenres/query").GetGenresQuery): Promise<import("../../application/queries/GetGenres/response").GetGenresResponseDto> {
    const overview = await this.getOverview();
    return {
      items: overview.genres || [],
      total: (overview.genres || []).length,
      page: query.page,
      hasMore: false,
    };
  }

  async getAuthors(query: import("../../application/queries/GetAuthors/query").GetAuthorsQuery): Promise<import("../../application/queries/GetAuthors/response").GetAuthorsResponseDto> {
    const overview = await this.getOverview();
    return {
      items: overview.authors || [],
      total: (overview.authors || []).length,
      page: query.page,
      hasMore: false,
    };
  }

  async getLanguages(query: import("../../application/queries/GetLanguages/query").GetLanguagesQuery): Promise<import("../../application/queries/GetLanguages/response").GetLanguagesResponseDto> {
    const overview = await this.getOverview();
    return {
      items: overview.languages || [],
      total: (overview.languages || []).length,
      page: query.page,
      hasMore: false,
    };
  }

  async getSubjects(query: import("../../application/queries/GetSubjects/query").GetSubjectsQuery): Promise<import("../../application/queries/GetSubjects/response").GetSubjectsResponseDto> {
    const overview = await this.getOverview();
    return {
      items: overview.subjects || [],
      total: (overview.subjects || []).length,
      page: query.page,
      hasMore: false,
    };
  }
`;

if (!content.includes('getFeaturedBooks')) {
  // Insert before the last closing brace
  const lastBraceIndex = content.lastIndexOf('}');
  content = content.substring(0, lastBraceIndex) + newMethods + '\n}\n';
  fs.writeFileSync(filePath, content);
  console.log("Updated SupabaseDiscoveryReadModel successfully.");
} else {
  console.log("SupabaseDiscoveryReadModel already updated.");
}
