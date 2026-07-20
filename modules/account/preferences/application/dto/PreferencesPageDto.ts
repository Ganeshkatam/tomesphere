export interface PreferencesDto {
  appearance: {
    themeMode: "light" | "dark" | "system";
    language: string;
  };
  reader: {
    theme: "light" | "dark" | "sepia";
    fontFamily: string;
    fontSize: string;
    lineHeight: number;
    pageMargins: number;
    scrollMode: "scroll" | "paginated";
    dictionaryLanguage: string;
    textAlignment: "left" | "justify";
    hyphenation: boolean;
  };
  notifications: {
    emailAlerts: boolean;
    weeklyDigest: boolean;
    pushNotifications: boolean;
  };
}

export interface PreferencesPageDto {
  preferences: PreferencesDto;
}
