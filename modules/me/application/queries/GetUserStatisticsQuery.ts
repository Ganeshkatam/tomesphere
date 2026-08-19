export interface UserStatisticsDto {
  booksCompleted: number;
  pagesRead: number;
  secondsRead: number;
  minutesRead: number; // calculated field for convenience
  currentStreak: number;
  longestStreak: number;
}

export interface GetUserStatisticsQuery {
  execute(userId: string): Promise<UserStatisticsDto | null>;
}
