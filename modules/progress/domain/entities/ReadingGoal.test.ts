import { ReadingGoal } from "./ReadingGoal";

describe("ReadingGoal Domain Entity", () => {
  it("should create a valid ReadingGoal entity", () => {
    const goal = ReadingGoal.create("goal-1", {
      userId: "user-1",
      goalType: "books_per_year",
      targetValue: 24,
      currentValue: 6,
      year: 2026,
      isActive: true,
    });

    expect(goal.id).toBe("goal-1");
    expect(goal.userId).toBe("user-1");
    expect(goal.goalType).toBe("books_per_year");
    expect(goal.targetValue).toBe(24);
    expect(goal.currentValue).toBe(6);
    expect(goal.calculateProgressPercentage()).toBe(25);
    expect(goal.isAchieved()).toBe(false);
  });

  it("should enforce positive target value invariant", () => {
    expect(() => {
      ReadingGoal.create("goal-1", {
        userId: "user-1",
        goalType: "pages_per_day",
        targetValue: 0,
        currentValue: 0,
      });
    }).toThrow("Target value must be greater than zero");

    expect(() => {
      ReadingGoal.create("goal-1", {
        userId: "user-1",
        goalType: "pages_per_day",
        targetValue: -5,
        currentValue: 0,
      });
    }).toThrow("Target value must be greater than zero");
  });

  it("should update target and recalculate progress percentage cleanly", () => {
    const goal = ReadingGoal.create("goal-1", {
      userId: "user-1",
      goalType: "books_per_year",
      targetValue: 10,
      currentValue: 5,
    });

    expect(goal.calculateProgressPercentage()).toBe(50);

    goal.updateTarget(20);
    expect(goal.targetValue).toBe(20);
    expect(goal.calculateProgressPercentage()).toBe(25);
  });

  it("should correctly detect when goal is achieved and clamp progress percentage to 100", () => {
    const goal = ReadingGoal.create("goal-1", {
      userId: "user-1",
      goalType: "books_per_month",
      targetValue: 4,
      currentValue: 4,
    });

    expect(goal.isAchieved()).toBe(true);
    expect(goal.calculateProgressPercentage()).toBe(100);

    goal.updateCurrentProgress(6);
    expect(goal.isAchieved()).toBe(true);
    expect(goal.calculateProgressPercentage()).toBe(100);
  });

  it("should support deactivating the goal", () => {
    const goal = ReadingGoal.create("goal-1", {
      userId: "user-1",
      goalType: "pages_per_week",
      targetValue: 200,
      currentValue: 50,
      isActive: true,
    });

    expect(goal.isActive).toBe(true);
    goal.deactivate();
    expect(goal.isActive).toBe(false);
  });
});
