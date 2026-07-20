import { Entity } from "@/shared/kernel/Entity";

export interface ActivityLogProps {
  userId: string;
  date: Date;
  createdAt: Date;
}

export class ActivityLog extends Entity<ActivityLogProps> {
  get userId(): string {
    return this.props.userId;
  }

  get date(): Date {
    return this.props.date;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  private constructor(id: string, props: ActivityLogProps) {
    super(id, props);
  }

  static create(
    id: string,
    props: Omit<ActivityLogProps, "createdAt"> & { createdAt?: Date },
  ): ActivityLog {
    return new ActivityLog(id, {
      ...props,
      createdAt: props.createdAt || new Date(),
    });
  }
}
