export interface ReadingPositionProps {
    location: string;
    chapter?: string;
    page?: number;
    timestamp?: number;
    progress: number;
    updatedAt: Date;
}

export class ReadingPosition {
    private constructor(private readonly props: ReadingPositionProps) {}

    public static create(props: ReadingPositionProps): ReadingPosition {
        if (!props.location || props.location.trim() === '') {
            throw new Error('Reading position must have a location');
        }
        if (props.progress < 0 || props.progress > 100) {
            throw new Error('Reading progress must be between 0 and 100');
        }

        return new ReadingPosition({
            ...props,
            progress: Number(props.progress.toFixed(2)), // Enforce 2 decimal precision
        });
    }

    get location(): string { return this.props.location; }
    get chapter(): string | undefined { return this.props.chapter; }
    get page(): number | undefined { return this.props.page; }
    get timestamp(): number | undefined { return this.props.timestamp; }
    get progress(): number { return this.props.progress; }
    get updatedAt(): Date { return this.props.updatedAt; }

    public isAfter(other: ReadingPosition): boolean {
        return this.progress > other.progress;
    }

    public toJSON() {
        return {
            location: this.location,
            chapter: this.chapter,
            page: this.page,
            timestamp: this.timestamp,
            progress: this.progress,
            updatedAt: this.updatedAt.toISOString(),
        };
    }
}
