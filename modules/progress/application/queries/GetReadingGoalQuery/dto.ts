export interface GoalProgressDto {
  hasGoal: boolean;
  type: "pages" | "minutes" | "books";
  currentValue: number;
  targetValue: number;
  percentage: number;
}
