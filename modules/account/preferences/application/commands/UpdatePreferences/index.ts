import {
  AppearancePreferences,
  NotificationPreferences,
  ReaderPreferences,
} from "../../../domain/entities/UserPreferences";

export interface UpdatePreferencesCommand {
  userId: string;
  appearance?: Partial<AppearancePreferences>;
  reader?: Partial<ReaderPreferences>;
  notifications?: Partial<NotificationPreferences>;
}
