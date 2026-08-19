/**
 * V1 Export Payload Specification
 *
 * Defines the complete shape of a user's data export.
 * This is the contract for what gets included in the exported JSON file.
 */
export interface ExportPayload {
  readonly export_date: string;
  readonly user_id: string;
  readonly profile: {
    readonly display_name: string;
    readonly biography: string;
    readonly avatar_url: string;
    readonly location: string;
  };
  readonly preferences: {
    readonly appearance: {
      readonly themeMode: string;
      readonly language: string;
    };
    readonly reader: {
      readonly theme: string;
      readonly fontFamily: string;
      readonly fontSize: string;
      readonly lineHeight: number;
      readonly pageMargins: number;
      readonly scrollMode: string;
      readonly dictionaryLanguage: string;
      readonly textAlignment: string;
      readonly hyphenation: boolean;
    };
    readonly notifications: {
      readonly emailAlerts: boolean;
      readonly weeklyDigest: boolean;
      readonly pushNotifications: boolean;
    };
  };
  readonly library_books: ReadonlyArray<Record<string, unknown>>;
  readonly collections: ReadonlyArray<Record<string, unknown>>;
  readonly bookmarks: ReadonlyArray<Record<string, unknown>>;
  readonly highlights: ReadonlyArray<Record<string, unknown>>;
  readonly annotations: ReadonlyArray<Record<string, unknown>>;
  readonly reading_sessions: ReadonlyArray<Record<string, unknown>>;
  readonly reading_progress: ReadonlyArray<Record<string, unknown>>;
  readonly downloads: ReadonlyArray<Record<string, unknown>>;
  readonly statistics: Record<string, unknown>;
  readonly reading_goal_history: ReadonlyArray<Record<string, unknown>>;
  readonly reading_streak_history: ReadonlyArray<Record<string, unknown>>;
}
