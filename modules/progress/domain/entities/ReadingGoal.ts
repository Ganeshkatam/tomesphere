import { AggregateRoot } from "@/shared/kernel/AggregateRoot";

export interface ReadingGoalProps {
  userId: string;
  year: number;
  targetBooks: number;
  booksRead: number;
  createdAt: Date;
  updatedAt: Date;
}

export class ReadingGoal extends AggregateRoot<ReadingGoalProps> {
  get userId(): string {
    return this.props.userId;
  }

  get year(): number {
    return this.props.year;
  }

  get targetBooks(): number {
    return this.props.targetBooks;
  }

  get booksRead(): number {
    return this.props.booksRead;
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
    return new ReadingGoal(id, {
      ...props,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    });
  }

  public updateBooksRead(booksRead: number): void {
    this.props.booksRead = booksRead;
    this.props.updatedAt = new Date();
  }

  public updateTargetBooks(targetBooks: number): void {
    this.props.targetBooks = targetBooks;
    this.props.updatedAt = new Date();
  }

  public calculateProgressPercentage(): number {
    if (this.props.targetBooks === 0) return 0;
    return Math.min(
      Math.round((this.props.booksRead / this.props.targetBooks) * 100),
      100,
    );
  }
}
