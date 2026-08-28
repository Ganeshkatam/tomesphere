import { SupabaseReadingGoalRepository } from "./SupabaseReadingGoalRepository";
import { ReadingGoal } from "../../domain/entities/ReadingGoal";

describe("SupabaseReadingGoalRepository", () => {
  let mockSupabase: any;
  let repository: SupabaseReadingGoalRepository;

  beforeEach(() => {
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      upsert: jest.fn().mockResolvedValue({ error: null }),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      single: jest.fn(),
      maybeSingle: jest.fn(),
    };

    repository = new SupabaseReadingGoalRepository(mockSupabase);
  });

  it("should find goal by id and map to domain entity", async () => {
    mockSupabase.maybeSingle.mockResolvedValue({
      data: {
        id: "goal-1",
        user_id: "user-1",
        goal_type: "books_per_year",
        target_value: 12,
        current_value: 3,
        year: 2026,
        is_active: true,
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-02T00:00:00Z",
      },
      error: null,
    });

    const goal = await repository.findById("goal-1");
    expect(goal).not.toBeNull();
    expect(goal?.id).toBe("goal-1");
    expect(goal?.targetValue).toBe(12);
    expect(goal?.currentValue).toBe(3);
    expect(goal?.year).toBe(2026);
  });

  it("should return null when goal by id does not exist", async () => {
    mockSupabase.maybeSingle.mockResolvedValue({ data: null, error: null });

    const goal = await repository.findById("non-existent");
    expect(goal).toBeNull();
  });

  it("should list active goals for user", async () => {
    mockSupabase.order.mockResolvedValue({
      data: [
        {
          id: "goal-1",
          user_id: "user-1",
          goal_type: "books_per_year",
          target_value: 20,
          current_value: 5,
          year: 2026,
          is_active: true,
          created_at: "2026-01-01T00:00:00Z",
        },
        {
          id: "goal-2",
          user_id: "user-1",
          goal_type: "pages_per_day",
          target_value: 30,
          current_value: 15,
          is_active: true,
          created_at: "2026-01-01T00:00:00Z",
        },
      ],
      error: null,
    });

    const goals = await repository.listActiveByUserId("user-1");
    expect(goals).toHaveLength(2);
    expect(goals[0].goalType).toBe("books_per_year");
    expect(goals[1].goalType).toBe("pages_per_day");
  });

  it("should save goal with canonical table column names", async () => {
    const goal = ReadingGoal.create("goal-new-1", {
      userId: "user-1",
      goalType: "books_per_month",
      targetValue: 3,
      currentValue: 1,
      year: 2026,
      isActive: true,
    });

    await repository.save(goal);

    expect(mockSupabase.from).toHaveBeenCalledWith("reading_goals");
    expect(mockSupabase.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "goal-new-1",
        user_id: "user-1",
        goal_type: "books_per_month",
        target_value: 3,
        current_value: 1,
        year: 2026,
        is_active: true,
      }),
    );
  });

  it("should delete goal scoped by user id", async () => {
    mockSupabase.eq
      .mockReturnValueOnce(mockSupabase)
      .mockResolvedValueOnce({ error: null });

    await repository.delete("goal-1", "user-1");

    expect(mockSupabase.from).toHaveBeenCalledWith("reading_goals");
    expect(mockSupabase.delete).toHaveBeenCalled();
  });
});
