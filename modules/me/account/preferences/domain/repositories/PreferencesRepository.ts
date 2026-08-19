import { UserId } from "@/shared/kernel/UserId";
import { UserPreferences } from "../entities/UserPreferences";

export interface PreferencesRepository {
  findByUserId(userId: UserId): Promise<UserPreferences | null>;
  save(preferences: UserPreferences): Promise<void>;
  setupInitialPreferences(userId: UserId): Promise<void>;
}
