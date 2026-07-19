import { UserId } from "@/shared/kernel/UserId";

export interface SetupProfileCommand {
  readonly userId: string;
  readonly name: string;
  readonly favoriteGenres: string[];
  readonly readingGoal: any; // Using any or specific interface depending on schema
}
