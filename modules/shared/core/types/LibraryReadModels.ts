/**
 * Shared read-model interfaces for Library data that are consumed across domains.
 * The canonical mapper lives inside the Library domain; these are pure data shapes.
 */

export interface LibraryEntryOutput {
  readonly userId: string;
  readonly bookId: string;
  readonly state: string;
  readonly progress: number;
  readonly startedAt?: string;
  readonly finishedAt?: string;
  readonly lastOpenedAt?: string;
  readonly isFavorite: boolean;
}

export interface BookOutput {
  readonly id: string;
  readonly title: string;
  readonly author: string;
  readonly coverUrl?: string;
  readonly description?: string;
  readonly genre?: string;
  readonly isTextbook?: boolean;
  readonly academicSubject?: string;
  readonly publishedDate?: string;
  readonly pageCount?: number;
  readonly averageRating?: number;
  readonly totalRatings?: number;
}

/** Composite output combining catalog book and library state */
export interface CurrentlyReadingOutput {
  readonly book: BookOutput;
  readonly library: LibraryEntryOutput;
}
