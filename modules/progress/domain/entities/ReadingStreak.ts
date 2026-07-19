import { AggregateRoot } from "@/shared/kernel/AggregateRoot";

export interface ReadingStreakProps {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date | null;
  totalDaysActive: number;
  updatedAt: Date;
}

export class ReadingStreak extends AggregateRoot<ReadingStreakProps> {
  get userId(): string { return this.props.userId; }
  get currentStreak(): number { return this.props.currentStreak; }
  get longestStreak(): number { return this.props.longestStreak; }
  get lastActivityDate(): Date | null { return this.props.lastActivityDate; }
  get totalDaysActive(): number { return this.props.totalDaysActive; }
  get updatedAt(): Date { return this.props.updatedAt; }

  private constructor(id: string, props: ReadingStreakProps) {
    super(id, props);
  }

  static create(id: string, props: Omit<ReadingStreakProps, "updatedAt"> & { updatedAt?: Date }): ReadingStreak {
    return new ReadingStreak(id, {
      ...props,
      updatedAt: props.updatedAt || new Date(),
    });
  }

  public recordActivity(date: Date): void {
    // Normalize to midnight to compare dates safely
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (!this.props.lastActivityDate) {
      this.props.currentStreak = 1;
      this.props.longestStreak = Math.max(this.props.longestStreak, 1);
      this.props.totalDaysActive += 1;
      this.props.lastActivityDate = normalizedDate;
      this.props.updatedAt = new Date();
      return;
    }

    const lastDate = new Date(
      this.props.lastActivityDate.getFullYear(),
      this.props.lastActivityDate.getMonth(),
      this.props.lastActivityDate.getDate()
    );
    
    const diffTime = Math.abs(normalizedDate.getTime() - lastDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Already recorded today, do nothing
      return;
    }

    if (diffDays === 1) {
      // Consecutive day
      this.props.currentStreak += 1;
      this.props.longestStreak = Math.max(this.props.longestStreak, this.props.currentStreak);
    } else {
      // Streak broken
      this.props.currentStreak = 1;
    }

    this.props.totalDaysActive += 1;
    this.props.lastActivityDate = normalizedDate;
    this.props.updatedAt = new Date();
  }
}
