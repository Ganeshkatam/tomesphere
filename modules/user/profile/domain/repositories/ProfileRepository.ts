import { UserProfile } from "../entities/UserProfile";
import { UserId } from "@/modules/core/domain/UserId";

export interface ProfileRepository {
  findByUserId(userId: UserId): Promise<UserProfile | null>;
  save(profile: UserProfile): Promise<void>;
  setupInitialProfile(
    userId: UserId,
    name: string,
    favoriteGenres: string[],
    readingGoal: any
  ): Promise<void>;
}
