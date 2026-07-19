import { SearchBooksQuery } from "./query";
import { SearchResponseReadModel } from "./read-model";
import { SearchRepository } from "../../../domain/repositories/SearchRepository";
import { SearchQuery } from "../../../domain/value-objects/SearchQuery";
import {
  RankingPolicy,
  RankableDocument,
} from "../../../domain/policies/RankingPolicy";
import { BookSearchDocument } from "../../../infrastructure/models/BookSearchDocument";

export class SearchBooksHandler {
  constructor(
    private readonly searchRepository: SearchRepository,
    private readonly rankingPolicy: RankingPolicy,
  ) {}

  async execute(
    query: SearchBooksQuery,
  ): Promise<SearchResponseReadModel> {
    try {
      const searchQuery = SearchQuery.create(query.request);

      // Infrastructure executes the raw search
      const { documents, totalCount } =
        await this.searchRepository.search(searchQuery);

      // Domain policy scores the results
      const rankableDocs: RankableDocument[] = documents.map((doc) => ({
        title: doc.title,
        description: doc.description,
        authors: doc.authors,
        matchScore: 1.0, // This would normally come from DB score
        popularityScore: doc.popularityScore,
        publishDate: doc.publicationYear
          ? new Date(doc.publicationYear, 0)
          : undefined,
        _raw: doc as BookSearchDocument, // hidden reference if needed
      }));

      // Calculate normalized scores
      const scoredDocs = rankableDocs.map((doc) => ({
        doc,
        score: this.rankingPolicy.calculateScore(searchQuery, doc),
      }));

      // Sort if sorting by relevance
      if (searchQuery.sort === "relevance") {
        scoredDocs.sort((a, b) => b.score - a.score);
      }

      // Map back to ReadModel for Presentation
      const results = scoredDocs.map((r) => {
        const doc = (r.doc as any)._raw as BookSearchDocument;
        return {
          bookId: doc.bookId,
          title: doc.title,
          subtitle: doc.subtitle,
          authors: doc.authors,
          categories: doc.categories,
          language: doc.language,
          descriptionSnippet:
            doc.description?.substring(0, 150) +
            (doc.description && doc.description.length > 150 ? "..." : ""),
          score: r.score,
        };
      });

      return {
        results,
        totalCount,
        hasMore:
          totalCount >
          searchQuery.pagination.offset + searchQuery.pagination.limit,
      };
    } catch (error) {
      throw new Error(error instanceof Error
            ? error.message
            : "Unknown error performing search",
      );
    }
  }
}
