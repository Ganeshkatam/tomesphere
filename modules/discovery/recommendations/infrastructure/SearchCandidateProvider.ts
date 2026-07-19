import {
  CandidateProvider,
  CandidateIntent,
} from "../application/providers/CandidateProvider";
import { RecommendationCandidate } from "../domain/value-objects/RecommendationCandidate";
import { SearchRepository } from "../../search/domain/repositories/SearchRepository";
import { SearchQuery } from "../../search/domain/value-objects/SearchQuery";

export class SearchCandidateProvider implements CandidateProvider {
  constructor(private readonly searchRepository: SearchRepository) {}

  async retrieveCandidates(
    intent: CandidateIntent,
    limit: number,
  ): Promise<RecommendationCandidate[]> {
    let filters: any = {};
    let sort: any = "popularity";

    if (typeof intent === "object") {
      if (intent.type === "Category") filters.categories = [intent.categoryId];
      if (intent.type === "Author") filters.authors = [intent.authorId];
    } else if (intent === "RecentlyAdded") {
      sort = "newest";
    }

    const query = SearchQuery.create({
      text: "",
      filters,
      sort,
      pagination: { limit, offset: 0 },
    });

    const { documents } = await this.searchRepository.search(query);

    return documents.map((doc: any) => ({
      bookId: doc.bookId,
      title: doc.title,
      authors: doc.authors,
      categories: doc.categories,
      language: doc.language,
      popularity: doc.popularityScore,
      searchScore: 1.0,
    }));
  }
}
