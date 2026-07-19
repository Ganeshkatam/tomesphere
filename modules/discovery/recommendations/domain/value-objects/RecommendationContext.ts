// Type aliases to make the context explicit
export type AuthorId = string;
export type CategoryId = string;
export type BookId = string;
export type LanguageCode = string;

import { UserInteractionFact } from "./UserInteractionFact";
import { BookFeature } from "./BookFeature";

export interface RecommendationContextProps {
  favoriteAuthors?: AuthorId[];
  favoriteCategories?: CategoryId[];
  completedBookIds?: BookId[];
  currentlyReadingBookIds?: BookId[];
  wishlistBookIds?: BookId[];
  preferredLanguages?: LanguageCode[];
  excludedBookIds?: BookId[]; // Books the user already owns or explicitly dismissed
  readingPace?: "fast" | "average" | "slow";
  interactions?: UserInteractionFact[];
  bookFeatures?: BookFeature[];
}

export class RecommendationContext {
  public readonly favoriteAuthors: AuthorId[];
  public readonly favoriteCategories: CategoryId[];
  public readonly completedBookIds: BookId[];
  public readonly currentlyReadingBookIds: BookId[];
  public readonly wishlistBookIds: BookId[];
  public readonly preferredLanguages: LanguageCode[];
  public readonly excludedBookIds: BookId[];
  public readonly readingPace: "fast" | "average" | "slow";
  public readonly interactions: UserInteractionFact[];
  public readonly bookFeatures: BookFeature[];

  constructor(props: RecommendationContextProps) {
    this.favoriteAuthors = props.favoriteAuthors || [];
    this.favoriteCategories = props.favoriteCategories || [];
    this.completedBookIds = props.completedBookIds || [];
    this.currentlyReadingBookIds = props.currentlyReadingBookIds || [];
    this.wishlistBookIds = props.wishlistBookIds || [];
    this.preferredLanguages = props.preferredLanguages || [];
    this.readingPace = props.readingPace || "average";
    this.interactions = props.interactions || [];
    this.bookFeatures = props.bookFeatures || [];

    // Auto-exclude books the user is already interacting with
    this.excludedBookIds = Array.from(
      new Set([
        ...(props.excludedBookIds || []),
        ...this.completedBookIds,
        ...this.currentlyReadingBookIds,
        ...this.wishlistBookIds,
      ]),
    );
  }
}
