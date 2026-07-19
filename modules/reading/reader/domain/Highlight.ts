export interface HighlightProps {
  id: string;
  bookId: string;
  readerId: string;
  text: string;
  location: string;
  chapter?: string;
  color: string;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Highlight {
  private constructor(private readonly props: HighlightProps) {}

  public static create(
    props: Omit<HighlightProps, "createdAt" | "updatedAt" | "color"> &
      Partial<Pick<HighlightProps, "createdAt" | "updatedAt" | "color">>,
  ): Highlight {
    if (!props.id) throw new Error("Highlight must have an ID");
    if (!props.bookId) throw new Error("Highlight must have a book ID");
    if (!props.readerId) throw new Error("Highlight must have a reader ID");
    if (!props.text) throw new Error("Highlight must have text");
    if (!props.location) throw new Error("Highlight must have a location");

    const now = new Date();
    return new Highlight({
      ...props,
      color: props.color || "#FDE047", // Default yellow
      createdAt: props.createdAt || now,
      updatedAt: props.updatedAt || now,
    });
  }

  get id(): string {
    return this.props.id;
  }
  get bookId(): string {
    return this.props.bookId;
  }
  get readerId(): string {
    return this.props.readerId;
  }
  get text(): string {
    return this.props.text;
  }
  get location(): string {
    return this.props.location;
  }
  get chapter(): string | undefined {
    return this.props.chapter;
  }
  get color(): string {
    return this.props.color;
  }
  get note(): string | undefined {
    return this.props.note;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // Immutability: returning a new instance on update
  public updateNote(newNote: string): Highlight {
    return new Highlight({
      ...this.props,
      note: newNote,
      updatedAt: new Date(),
    });
  }

  public updateColor(newColor: string): Highlight {
    return new Highlight({
      ...this.props,
      color: newColor,
      updatedAt: new Date(),
    });
  }
}
