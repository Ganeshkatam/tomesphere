export interface ReadingCalendarDayDto {
  date: string; // YYYY-MM-DD
  active: boolean; // Did they read?
}

export interface ReadingCalendarDto {
  days: ReadingCalendarDayDto[]; // Last 7 days, ordered chronologically
}
