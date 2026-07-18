export interface BookmarkProps {
    id: string;
    bookId: string;
    readerId: string;
    location: string;
    chapter?: string;
    name?: string;
    orderIndex: number;
    createdAt: Date;
}

export class Bookmark {
    private constructor(private readonly props: BookmarkProps) {}

    public static create(props: Omit<BookmarkProps, 'createdAt'> & Partial<Pick<BookmarkProps, 'createdAt'>>): Bookmark {
        if (!props.id) throw new Error('Bookmark must have an ID');
        if (!props.bookId) throw new Error('Bookmark must have a book ID');
        if (!props.readerId) throw new Error('Bookmark must have a reader ID');
        if (!props.location) throw new Error('Bookmark must have a location');

        return new Bookmark({
            ...props,
            createdAt: props.createdAt || new Date(),
        });
    }

    get id(): string { return this.props.id; }
    get bookId(): string { return this.props.bookId; }
    get readerId(): string { return this.props.readerId; }
    get location(): string { return this.props.location; }
    get chapter(): string | undefined { return this.props.chapter; }
    get name(): string | undefined { return this.props.name; }
    get orderIndex(): number { return this.props.orderIndex; }
    get createdAt(): Date { return this.props.createdAt; }

    public rename(newName: string): Bookmark {
        return new Bookmark({
            ...this.props,
            name: newName,
        });
    }

    public updateOrder(newIndex: number): Bookmark {
        return new Bookmark({
            ...this.props,
            orderIndex: newIndex,
        });
    }
}
