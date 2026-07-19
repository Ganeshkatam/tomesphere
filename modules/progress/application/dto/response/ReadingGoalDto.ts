export interface ReadingGoalDto {
  id: string;
  year: number;
  targetBooks: number;
  booksRead: number;
  progressPercentage: number;
  isCompleted: boolean;
}
