import { ValueObject } from "@/shared/kernel/ValueObject";
import { ReadingActivity } from "./ReadingActivity";

interface ReadingGoalProps {
  dailyMinutesTarget: number;
  yearlyBooksTarget: number;
  dailyMinutesProgress: number;
  yearlyBooksProgress: number;
  lastUpdatedDate: string; // ISO date string without time (YYYY-MM-DD)
}

export class ReadingGoal extends ValueObject<ReadingGoalProps> {
  get dailyMinutesTarget(): number {
    return this.props.dailyMinutesTarget;
  }
  get yearlyBooksTarget(): number {
    return this.props.yearlyBooksTarget;
  }
  get dailyMinutesProgress(): number {
    return this.props.dailyMinutesProgress;
  }
  get yearlyBooksProgress(): number {
    return this.props.yearlyBooksProgress;
  }
  get lastUpdatedDate(): string {
    return this.props.lastUpdatedDate;
  }

  private constructor(props: ReadingGoalProps) {
    super(props);
  }

  static create(
    dailyMinutesTarget: number,
    yearlyBooksTarget: number,
    dailyMinutesProgress: number = 0,
    yearlyBooksProgress: number = 0,
    lastUpdatedDate: string = new Date().toISOString().split("T")[0],
  ): ReadingGoal {
    return new ReadingGoal({
      dailyMinutesTarget,
      yearlyBooksTarget,
      dailyMinutesProgress,
      yearlyBooksProgress,
      lastUpdatedDate,
    });
  }

  isDailyGoalCompleted(): boolean {
    return this.props.dailyMinutesProgress >= this.props.dailyMinutesTarget;
  }

  applyProgress(activity: ReadingActivity): {
    newGoal: ReadingGoal;
    justCompletedDaily: boolean;
  } {
    const activityDateStr = activity.date.toISOString().split("T")[0];
    let newDailyProgress = this.props.dailyMinutesProgress;

    // Reset daily progress if it's a new day
    if (activityDateStr !== this.props.lastUpdatedDate) {
      newDailyProgress = 0;
    }

    const wasCompleted = newDailyProgress >= this.props.dailyMinutesTarget;
    newDailyProgress += activity.minutes;
    const isCompletedNow = newDailyProgress >= this.props.dailyMinutesTarget;

    const justCompletedDaily = !wasCompleted && isCompletedNow;

    const newGoal = new ReadingGoal({
      ...this.props,
      dailyMinutesProgress: newDailyProgress,
      yearlyBooksProgress:
        this.props.yearlyBooksProgress + activity.completedBooks,
      lastUpdatedDate: activityDateStr,
    });

    return { newGoal, justCompletedDaily };
  }
}
