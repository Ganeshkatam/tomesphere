import { AggregateRoot } from "@/shared/kernel/AggregateRoot";

export type ReadingGoalType =
  | "books_per_year"
  | "books_per_month"
  | "pages_per_day"
  | "pages_per_week"
  | "daily_minutes"
  | "custom";

export interface ReadingGoalProps {
  userId: string;
  goalType: ReadingGoalType;
  targetValue: number;
  currentValue: number;
  year?: number | null;
  isActive?: boolean;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class ReadingGoal extends AggregateRoot<ReadingGoalProps> {
  get userId(): string {
    return this.props.userId;
  }

  get goalType(): ReadingGoalType {
    return this.props.goalType;
  }

  get targetValue(): number {
    return this.props.targetValue;
  }

  get currentValue(): number {
    return this.props.currentValue;
  }

  get targetBooks(): number {
    return this.props.targetValue;
  }

  get booksRead(): number {
    return this.props.currentValue;
  }

  get year(): number | null | undefined {
    return this.props.year;
  }

  get isActive(): boolean {
    return this.props.isActive !== false;
  }

  get startDate(): string | null | undefined {
    return this.props.startDate;
  }

  get endDate(): string | null | undefined {
    return this.props.endDate;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  private constructor(id: string, props: ReadingGoalProps) {
    super(id, props);
  }

  static create(
    id: string,
    props: Omit<ReadingGoalProps, "createdAt" | "updatedAt"> & {
      createdAt?: Date;
      updatedAt?: Date;
    },
  ): ReadingGoal {
    if (props.targetValue <= 0) {
      throw new Error("Target value must be greater than zero");
    }

    return new ReadingGoal(id, {
      ...props,
      currentValue: Math.max(0, props.currentValue || 0),
      isActive: props.isActive !== undefined ? props.isActive : true,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    });
  }

  public updateTarget(targetValue: number): void {
    if (targetValue <= 0) {
      throw new Error("Target value must be greater than zero");
    }
    this.props.targetValue = targetValue;
    this.props.updatedAt = new Date();
  }

  public updateTargetBooks(targetBooks: number): void {
    this.updateTarget(targetBooks);
  }

  public updateBooksRead(booksRead: number): void {
    this.updateCurrentProgress(booksRead);
  }

  public updateCurrentProgress(currentValue: number): void {
    this.props.currentValue = Math.max(0, currentValue);
    this.props.updatedAt = new Date();
  }

  public deactivate(): void {
    this.props.isActive = false;
    this.props.updatedAt = new Date();
  }

  public calculateProgressPercentage(): number {
    if (this.props.targetValue <= 0) return 0;
    return Math.min(
      Math.round((this.props.currentValue / this.props.targetValue) * 100),
      100,
    );
  }

  public isAchieved(): boolean {
    return this.props.currentValue >= this.props.targetValue;
  }
}
