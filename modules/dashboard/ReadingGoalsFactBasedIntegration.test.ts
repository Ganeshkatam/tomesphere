jest.mock("server-only", () => ({}), { virtual: true });

import { GetDashboardAnalyticsHandler } from "./application/queries/GetDashboardAnalytics/handler";

describe("Reading Goals Fact-Based Vertical Integration", () => {
  const userId = "test-user-scholar";

  let dbGoals: any[];
  let dbSessions: any[];
  let dbLibraryBooks: any[];
  let dbUserStats: any;
  let mockSupabase: any;

  beforeEach(() => {
    dbGoals = [];
    dbSessions = [];
    dbLibraryBooks = [];
    dbUserStats = null;

    mockSupabase = {
      from: (table: string) => {
        const createChain = (filters: Record<string, any> = {}) => {
          const chain: any = {
            select: () => createChain(filters),
            eq: (col: string, val: any) => createChain({ ...filters, [col]: val }),
            order: () => chain,
            limit: () => chain,
            maybeSingle: () => {
              if (table === "user_statistics") {
                return Promise.resolve({
                  data: dbUserStats?.user_id === filters["user_id"] ? dbUserStats : null,
                  error: null,
                });
              }
              return Promise.resolve({ data: null, error: null });
            },
            single: () => {
              if (table === "user_statistics") {
                return Promise.resolve({
                  data: dbUserStats?.user_id === filters["user_id"] ? dbUserStats : null,
                  error: null,
                });
              }
              return Promise.resolve({ data: null, error: null });
            },
            then: (resolve: (val: any) => void) => {
              let data: any[] = [];
              if (table === "reading_goals") {
                data = dbGoals.filter(
                  (g) =>
                    (!filters["user_id"] || g.user_id === filters["user_id"]) &&
                    (filters["is_active"] === undefined || g.is_active === filters["is_active"]),
                );
              } else if (table === "reading_sessions") {
                data = dbSessions.filter(
                  (s) => !filters["user_id"] || s.user_id === filters["user_id"],
                );
              } else if (table === "library_books") {
                data = dbLibraryBooks.filter(
                  (lb) => !filters["user_id"] || lb.user_id === filters["user_id"],
                );
              }
              return resolve({ data, error: null });
            },
          };
          return chain;
        };

        return createChain();
      },
    };
  });

  it("Step 1: Default fallbacks apply cleanly when no explicit reading goals exist", async () => {
    const handler = new GetDashboardAnalyticsHandler(mockSupabase);
    const dashboardData = await handler.execute(userId);

    expect(dashboardData.goals).toBeDefined();
    expect(dashboardData.goals.length).toBeGreaterThanOrEqual(1);

    const annualGoal = dashboardData.goals.find((g) => g.type === "annual_books");
    expect(annualGoal).toBeDefined();
    expect(annualGoal?.current).toBe(0);
    expect(annualGoal?.percentage).toBe(0);
  });

  it("Step 2: Fact-Based Derivation - 3 finished books in library & sessions dynamically progress the annual goal", async () => {
    // 1. User sets an active annual goal
    dbGoals.push({
      id: "goal-2026-annual",
      user_id: userId,
      goal_type: "books_per_year",
      target_value: 12,
      current_value: 0,
      year: 2026,
      is_active: true,
    });

    // 2. User has 3 completed books in library
    dbLibraryBooks.push(
      { user_id: userId, book_id: "book-1", status: "finished" },
      { user_id: userId, book_id: "book-2", status: "finished" },
      { user_id: userId, book_id: "book-3", status: "finished" },
      { user_id: userId, book_id: "book-4", status: "currently_reading" },
    );

    // 3. User has recorded sessions
    dbSessions.push(
      { user_id: userId, book_id: "book-1", percentage: 100, reading_time_minutes: 120, pages: 200 },
      { user_id: userId, book_id: "book-2", percentage: 100, reading_time_minutes: 180, pages: 300 },
      { user_id: userId, book_id: "book-3", percentage: 100, reading_time_minutes: 150, pages: 250 },
      { user_id: userId, book_id: "book-4", percentage: 40, reading_time_minutes: 45, pages: 80 },
    );

    dbUserStats = {
      user_id: userId,
      books_completed: 3,
      books_started: 4,
      minutes_read: 495,
      pages_read: 830,
      current_streak: 5,
    };

    const handler = new GetDashboardAnalyticsHandler(mockSupabase);
    const dashboardData = await handler.execute(userId);

    const annualGoal = dashboardData.goals.find((g) => g.type === "books_per_year");
    expect(annualGoal).toBeDefined();
    expect(annualGoal?.target).toBe(12);
    expect(annualGoal?.current).toBe(3); // Derived from facts (books completed)
    expect(annualGoal?.percentage).toBe(25); // 3 / 12 = 25%
  });

  it("Step 3: Daily Minutes & Pages goals derive from actual weekly session activity", async () => {
    const today = new Date().toISOString();

    // 1. User sets a daily minutes goal (target: 45 mins)
    dbGoals.push({
      id: "goal-daily-min",
      user_id: userId,
      goal_type: "daily_minutes",
      target_value: 45,
      current_value: 0,
      is_active: true,
    });

    // 2. User logged 45 minutes of reading today
    dbSessions.push({
      user_id: userId,
      book_id: "book-99",
      percentage: 30,
      reading_time_minutes: 45,
      pages: 35,
      last_read_at: today,
    });

    dbUserStats = {
      user_id: userId,
      minutes_read: 45,
      pages_read: 35,
      last_read_date: today.slice(0, 10),
    };

    const handler = new GetDashboardAnalyticsHandler(mockSupabase);
    const dashboardData = await handler.execute(userId);

    const dailyGoal = dashboardData.goals.find((g) => g.type === "daily_minutes");
    expect(dailyGoal).toBeDefined();
    expect(dailyGoal?.target).toBe(45);
    expect(dailyGoal?.current).toBe(45);
    expect(dailyGoal?.percentage).toBe(100);
    expect(dailyGoal?.status).toBe("ahead");
  });
});
