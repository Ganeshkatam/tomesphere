export interface DashboardMetricsDto {
  totalMinutes: number;
  formattedTotalTime: string;
  totalPages: number;
  booksCompleted: number;
  booksStarted: number;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  readingSpeedPPH: number; // pages per hour
}

export interface WeeklyActivityDayDto {
  day: string; // "Mon", "Tue", etc.
  date: string;
  minutes: number;
  pages: number;
  targetMinutes: number;
}

export interface ActiveReadingBookDto {
  bookId: string;
  title: string;
  author: string;
  coverUrl: string | null;
  currentPage: number;
  totalPages: number;
  percentage: number;
  readingTimeMinutes: number;
  lastReadAt: string;
  estMinutesRemaining: number;
}

export interface ReadingGoalDto {
  id: string;
  type:
    | "daily_minutes"
    | "annual_books"
    | "pages_monthly"
    | "books_per_year"
    | "books_per_month"
    | "pages_per_day"
    | "pages_per_week"
    | "custom";
  label: string;
  target: number;
  current: number;
  unit: string;
  percentage: number;
  status: "on_track" | "ahead" | "behind";
}

export interface MilestoneBadgeDto {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "streak" | "pages" | "time" | "archive";
  unlocked: boolean;
  unlockedAt: string | null;
  progressPercent: number;
}

export interface ReadingSessionLogDto {
  id: string;
  bookId: string;
  bookTitle: string;
  durationMinutes: number;
  pagesRead: number;
  endPage: number;
  timestamp: string;
}

export interface DashboardPageDto {
  user: {
    name: string;
    email: string;
    avatarUrl: string | null;
  };
  metrics: DashboardMetricsDto;
  weeklyActivity: WeeklyActivityDayDto[];
  activeBooks: ActiveReadingBookDto[];
  goals: ReadingGoalDto[];
  milestones: MilestoneBadgeDto[];
  recentSessions: ReadingSessionLogDto[];
  timeOfDayBreakdown: {
    morningPercent: number;
    afternoonPercent: number;
    eveningPercent: number;
    nightPercent: number;
  };
}
