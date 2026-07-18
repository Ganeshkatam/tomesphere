import { ReadingPosition } from './ReadingPosition';
import { Bookmark } from './Bookmark';
import { BookmarkCollection } from './BookmarkCollection';
import { Highlight } from './Highlight';
import { HighlightCollection } from './HighlightCollection';
import { ReaderEvent } from './Events';

export interface ReaderSessionProps {
    id: string;
    readerId: string;
    bookId: string;
    status: 'active' | 'finished';
    position: ReadingPosition;
    bookmarks: BookmarkCollection;
    highlights: HighlightCollection;
    startedAt: Date;
    lastResumedAt: Date;
    finishedAt?: Date;
    totalDurationSeconds: number;
}

export class ReaderSession {
    private domainEvents: ReaderEvent[] = [];

    private constructor(private props: ReaderSessionProps) {}

    public static start(
        id: string,
        readerId: string,
        bookId: string,
        initialPosition: ReadingPosition
    ): ReaderSession {
        const now = new Date();
        const session = new ReaderSession({
            id,
            readerId,
            bookId,
            status: 'active',
            position: initialPosition,
            bookmarks: BookmarkCollection.create(),
            highlights: HighlightCollection.create(),
            startedAt: now,
            lastResumedAt: now,
            totalDurationSeconds: 0,
        });

        session.addDomainEvent({
            type: 'ReadingSessionStarted',
            sessionId: id,
            readerId,
            bookId,
            timestamp: now,
        });

        return session;
    }

    public static restore(props: ReaderSessionProps): ReaderSession {
        return new ReaderSession(props);
    }

    get id(): string { return this.props.id; }
    get readerId(): string { return this.props.readerId; }
    get bookId(): string { return this.props.bookId; }
    get status(): 'active' | 'finished' { return this.props.status; }
    get position(): ReadingPosition { return this.props.position; }
    get bookmarks(): BookmarkCollection { return this.props.bookmarks; }
    get highlights(): HighlightCollection { return this.props.highlights; }
    get startedAt(): Date { return this.props.startedAt; }
    get finishedAt(): Date | undefined { return this.props.finishedAt; }
    get totalDurationSeconds(): number { return this.props.totalDurationSeconds; }

    public resume(): void {
        if (this.status === 'finished') {
            throw new Error('Cannot resume a finished session');
        }
        this.props.lastResumedAt = new Date();
    }

    public updatePosition(newPosition: ReadingPosition): void {
        if (this.status === 'finished') {
            throw new Error('Cannot update position of a finished session');
        }
        if (this.props.position.isAfter(newPosition)) {
            // Requirement: "position monotonic" - wait, sometimes users go back?
            // If the rule is strictly monotonic progress for the session max progress:
            // Actually, "position monotonic" might mean we only update if it's forward, or we allow going back but max progress is monotonic.
            // Let's assume the current position represents the *latest* read point, but they can jump around.
            // If "position monotonic" means it can't decrease:
            throw new Error('Reading position must be monotonic within a session');
        }

        // Accumulate duration
        const now = new Date();
        const durationSinceResume = Math.floor((now.getTime() - this.props.lastResumedAt.getTime()) / 1000);
        this.props.totalDurationSeconds += durationSinceResume;
        this.props.lastResumedAt = now;

        this.props.position = newPosition;
    }

    public addBookmark(bookmark: Bookmark): void {
        if (this.status === 'finished') {
            throw new Error('Cannot add bookmark to a finished session');
        }
        this.props.bookmarks = this.props.bookmarks.add(bookmark);
    }

    public removeBookmark(bookmarkId: string): void {
        if (this.status === 'finished') {
            throw new Error('Cannot remove bookmark from a finished session');
        }
        this.props.bookmarks = this.props.bookmarks.remove(bookmarkId);
    }

    public moveBookmark(bookmarkId: string, newIndex: number): void {
        if (this.status === 'finished') {
            throw new Error('Cannot move bookmark in a finished session');
        }
        this.props.bookmarks = this.props.bookmarks.move(bookmarkId, newIndex);
    }

    public addHighlight(highlight: Highlight): void {
        if (this.status === 'finished') {
            throw new Error('Cannot add highlight to a finished session');
        }
        this.props.highlights = this.props.highlights.add(highlight);
    }

    public removeHighlight(highlightId: string): void {
        if (this.status === 'finished') {
            throw new Error('Cannot remove highlight from a finished session');
        }
        this.props.highlights = this.props.highlights.remove(highlightId);
    }

    public updateHighlightNote(highlightId: string, newNote: string): void {
        if (this.status !== 'active') {
            throw new Error('Cannot update highlight in a non-active session');
        }
        const highlight = Array.from(this.props.highlights).find(h => h.id === highlightId);
        if (!highlight) throw new Error('Highlight not found');

        const updated = highlight.updateNote(newNote);
        this.props.highlights = this.props.highlights.replace(updated);
    }

    public pause(): void {
        if (this.status !== 'active') {
            throw new Error('Can only pause an active session');
        }
        
        const now = new Date();
        const durationSinceResume = Math.floor((now.getTime() - this.props.lastResumedAt.getTime()) / 1000);
        this.props.totalDurationSeconds += durationSinceResume;
        // Session remains 'active', but lastResumedAt will be updated upon next resume()
    }

    public abandon(): void {
        if (this.status === 'finished') {
            throw new Error('Session is already finished');
        }
        this.props.status = 'finished';
        this.props.finishedAt = new Date();
    }

    public complete(endPosition: ReadingPosition, pagesRead: number): void {
        if (this.status === 'finished') {
            throw new Error('Session is already finished');
        }

        const now = new Date();
        const durationSinceResume = Math.floor((now.getTime() - this.props.lastResumedAt.getTime()) / 1000);
        this.props.totalDurationSeconds += durationSinceResume;
        
        const startProgress = this.props.position.progress;
        this.props.position = endPosition;
        this.props.status = 'finished';
        this.props.finishedAt = now;

        this.addDomainEvent({
            type: 'ReadingSessionCompleted',
            sessionId: this.id,
            readerId: this.readerId,
            bookId: this.bookId,
            durationSeconds: this.props.totalDurationSeconds,
            pagesRead,
            startProgress,
            endProgress: endPosition.progress,
            timestamp: now,
        });
    }

    public getDomainEvents(): ReaderEvent[] {
        return [...this.domainEvents];
    }

    public clearDomainEvents(): void {
        this.domainEvents = [];
    }

    private addDomainEvent(event: ReaderEvent): void {
        // "duplicate events never emitted"
        const isDuplicate = this.domainEvents.some(
            e => e.type === event.type && e.sessionId === event.sessionId
        );
        if (!isDuplicate) {
            this.domainEvents.push(event);
        }
    }
}
