import { ValueObject } from "@/shared/kernel/ValueObject";
import { ValidationError } from "@/shared/kernel/DomainError";

interface BookIdProps {
  value: string;
}

export class BookId extends ValueObject<BookIdProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: BookIdProps) {
    super(props);
  }

  public static create(id: string): BookId {
    if (!id || id.trim().length === 0) {
      throw new ValidationError("BookId cannot be empty");
    }
    return new BookId({ value: id });
  }
}
