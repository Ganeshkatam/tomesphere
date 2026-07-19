export interface DashboardOverviewDto {
  readonly currentReading: any[];
  readonly recentBooks: any[];
  readonly progress: {
    readonly booksRead: number;
    readonly totalBooksGoal: number | null;
  };
  readonly streak: {
    readonly current: number;
    readonly best: number;
  };
  readonly librarySummary: {
    readonly totalBooks: number;
    readonly currentlyReadingCount: number;
    readonly wantToReadCount: number;
  };
  readonly collectionsSummary: {
    readonly totalCollections: number;
  };
}
