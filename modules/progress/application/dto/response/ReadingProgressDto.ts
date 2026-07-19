import { ReadingGoalDto } from "./ReadingGoalDto";
import { StreakDataDto } from "./StreakDataDto";

export interface ReadingProgressDto {
  goal: ReadingGoalDto | null;
  streak: StreakDataDto;
}
