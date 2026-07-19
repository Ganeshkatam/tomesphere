import { ValueObject } from "@/shared/kernel/ValueObject";

interface ReadingActivityProps {
  minutes: number;
  pages: number;
  completedBooks: number;
  date: Date;
}

export class ReadingActivity extends ValueObject<ReadingActivityProps> {
  get minutes(): number {
    return this.props.minutes;
  }
  get pages(): number {
    return this.props.pages;
  }
  get completedBooks(): number {
    return this.props.completedBooks;
  }
  get date(): Date {
    return this.props.date;
  }

  private constructor(props: ReadingActivityProps) {
    super(props);
  }

  static create(
    minutes: number,
    pages: number,
    completedBooks: number = 0,
    date: Date = new Date(),
  ): ReadingActivity {
    return new ReadingActivity({ minutes, pages, completedBooks, date });
  }
}
