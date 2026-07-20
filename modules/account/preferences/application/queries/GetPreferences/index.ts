import { PreferencesDto } from "../../dto/PreferencesPageDto";

export interface GetPreferencesQuery {
  userId: string;
}

export interface PreferencesReadModel {
  getPreferences(query: GetPreferencesQuery): Promise<PreferencesDto>;
}
