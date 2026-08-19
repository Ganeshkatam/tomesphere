/**
 * Port owned by Account, consumed by Reader.
 * Reader depends on this interface (not on Account internals).
 * Account provides the implementation via PreferencesRepository.
 *
 * Dependency flow:
 *   Reader → ReaderPreferencesPort ← Account (implements)
 */

export interface ReaderPreferencesDefaults {
  readonly theme: "light" | "dark" | "sepia";
  readonly fontFamily: string;
  readonly fontSize: string;
  readonly lineHeight: number;
  readonly pageMargins: number;
  readonly scrollMode: "scroll" | "paginated";
  readonly dictionaryLanguage: string;
  readonly textAlignment: "left" | "justify";
  readonly hyphenation: boolean;
}

export interface ReaderPreferencesPort {
  getReaderDefaults(userId: string): Promise<ReaderPreferencesDefaults>;
}
