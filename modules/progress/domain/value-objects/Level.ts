import { ValueObject } from "@/shared/kernel/ValueObject";

interface LevelProps {
  levelNumber: number;
  title: string;
  minimumXp: number;
}

export class Level extends ValueObject<LevelProps> {
  get levelNumber(): number {
    return this.props.levelNumber;
  }

  get title(): string {
    return this.props.title;
  }

  get minimumXp(): number {
    return this.props.minimumXp;
  }

  private constructor(props: LevelProps) {
    super(props);
  }

  static create(levelNumber: number, title: string, minimumXp: number): Level {
    return new Level({ levelNumber, title, minimumXp });
  }
}
