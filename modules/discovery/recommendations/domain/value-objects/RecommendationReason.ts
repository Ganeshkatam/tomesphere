import { AuthorId, CategoryId, BookId } from "./RecommendationContext";

export type RecommendationReason =
  | { type: "favorite-author"; authorId: AuthorId; authorName?: string }
  | { type: "favorite-category"; categoryId: CategoryId; categoryName?: string }
  | { type: "similar-book"; sourceBookId: BookId; sourceBookTitle?: string }
  | { type: "trending" }
  | { type: "new-release" }
  | { type: "highly-rated" }
  | { type: "signal-affinity" };
