import { ValueObject } from "@/shared/kernel/ValueObject";
import { ValidationError } from "@/shared/kernel/DomainError";

interface ExperiencePointsProps {
  value: number;
}

export class ExperiencePoints extends ValueObject<ExperiencePointsProps> {
  get value(): number {
    return this.props.value;
  }

  private constructor(props: ExperiencePointsProps) {
    super(props);
  }

  static create(value: number): ExperiencePoints {
    if (value < 0) {
      throw new ValidationError("XP cannot be negative");
    }
    return new ExperiencePoints({ value });
  }

  add(points: number): ExperiencePoints {
    if (points < 0) {
      throw new ValidationError("Cannot add negative XP");
    }
    return new ExperiencePoints({ value: this.props.value + points });
  }
}
