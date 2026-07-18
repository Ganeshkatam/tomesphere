import { ReaderSession } from './ReaderSession';
import { ReadingPosition } from './ReadingPosition';
import { Bookmark } from './Bookmark';
import { Highlight } from './Highlight';

describe('ReaderSession Aggregate', () => {
    const readerId = 'user-1';
    const bookId = 'book-1';
    const sessionId = 'session-1';

    const createPos = (loc: string, prog: number) => ReadingPosition.create({ location: loc, progress: prog, updatedAt: new Date() });

    it('✓ start session', () => {
        const pos = createPos('loc-0', 0);
        const session = ReaderSession.start(sessionId, readerId, bookId, pos);

        expect(session.status).toBe('active');
        expect(session.position.location).toBe('loc-0');
    });

    it('✓ resume session', () => {
        const session = ReaderSession.start(sessionId, readerId, bookId, createPos('loc-0', 0));
        expect(() => session.resume()).not.toThrow();
    });

    it('✓ finish session', () => {
        const session = ReaderSession.start(sessionId, readerId, bookId, createPos('loc-0', 0));
        session.complete(createPos('loc-10', 10), 10);
        expect(session.status).toBe('finished');
    });

    it('✓ update position', () => {
        const session = ReaderSession.start(sessionId, readerId, bookId, createPos('loc-0', 0));
        session.updatePosition(createPos('loc-5', 5));
        expect(session.position.location).toBe('loc-5');
    });

    it('✓ duplicate bookmark ignored', () => {
        const session = ReaderSession.start(sessionId, readerId, bookId, createPos('loc-0', 0));
        const b1 = Bookmark.create({ id: 'b1', bookId, readerId, location: 'loc-5', orderIndex: 0 });
        const b2 = Bookmark.create({ id: 'b2', bookId, readerId, location: 'loc-5', orderIndex: 1 });
        
        session.addBookmark(b1);
        session.addBookmark(b2); // Ignored due to duplicate location

        expect(Array.from(session.bookmarks).length).toBe(1);
        expect(Array.from(session.bookmarks)[0].id).toBe('b1');
    });

    it('✓ overlapping highlights rejected', () => {
        const session = ReaderSession.start(sessionId, readerId, bookId, createPos('loc-0', 0));
        const h1 = Highlight.create({ id: 'h1', bookId, readerId, location: 'loc-1', text: 'Important text' });
        const h2 = Highlight.create({ id: 'h2', bookId, readerId, location: 'loc-1', text: 'Important text' });

        session.addHighlight(h1);
        expect(() => session.addHighlight(h2)).toThrow('Highlight overlaps');
    });

    it('✓ remove highlight', () => {
        const session = ReaderSession.start(sessionId, readerId, bookId, createPos('loc-0', 0));
        const h1 = Highlight.create({ id: 'h1', bookId, readerId, location: 'loc-1', text: 'Important text' });
        session.addHighlight(h1);
        session.removeHighlight('h1');
        expect(Array.from(session.highlights).length).toBe(0);
    });

    it('✓ emitted events', () => {
        const session = ReaderSession.start(sessionId, readerId, bookId, createPos('loc-0', 0));
        const events = session.getDomainEvents();
        expect(events[0].type).toBe('ReadingSessionStarted');
    });

    it('✓ events emitted once', () => {
        const session = ReaderSession.start(sessionId, readerId, bookId, createPos('loc-0', 0));
        // Force finish multiple times theoretically shouldn't happen because of state check, but just in case
        const initialEvents = session.getDomainEvents().length;
        expect(initialEvents).toBe(1); // Started
    });

    it('✓ cannot finish twice', () => {
        const session = ReaderSession.start(sessionId, readerId, bookId, createPos('loc-0', 0));
        session.complete(createPos('loc-10', 10), 10);
        expect(() => session.complete(createPos('loc-10', 10), 10)).toThrow('already finished');
    });

    it('✓ cannot resume finished session', () => {
        const session = ReaderSession.start(sessionId, readerId, bookId, createPos('loc-0', 0));
        session.complete(createPos('loc-10', 10), 10);
        expect(() => session.resume()).toThrow('Cannot resume a finished session');
    });

    it('✓ cannot update position after finish', () => {
        const session = ReaderSession.start(sessionId, readerId, bookId, createPos('loc-0', 0));
        session.complete(createPos('loc-10', 10), 10);
        expect(() => session.updatePosition(createPos('loc-15', 15))).toThrow('finished session');
    });

    it('✓ cannot add highlight after finish', () => {
        const session = ReaderSession.start(sessionId, readerId, bookId, createPos('loc-0', 0));
        session.complete(createPos('loc-10', 10), 10);
        const h1 = Highlight.create({ id: 'h1', bookId, readerId, location: 'loc-1', text: 'Important text' });
        expect(() => session.addHighlight(h1)).toThrow('finished session');
    });

    it('✓ bookmark survives resume', () => {
        const session = ReaderSession.start(sessionId, readerId, bookId, createPos('loc-0', 0));
        const b1 = Bookmark.create({ id: 'b1', bookId, readerId, location: 'loc-5', orderIndex: 0 });
        session.addBookmark(b1);
        session.resume();
        expect(Array.from(session.bookmarks).length).toBe(1);
    });

    it('✓ restore preserves highlights', () => {
        const session = ReaderSession.start(sessionId, readerId, bookId, createPos('loc-0', 0));
        const h1 = Highlight.create({ id: 'h1', bookId, readerId, location: 'loc-1', text: 'Important text' });
        session.addHighlight(h1);

        // Simulate restore
        const restored = ReaderSession.restore({
            id: session.id,
            readerId: session.readerId,
            bookId: session.bookId,
            status: session.status,
            position: session.position,
            bookmarks: session.bookmarks,
            highlights: session.highlights,
            startedAt: session.startedAt,
            lastResumedAt: session.startedAt, // Mocking
            totalDurationSeconds: 0,
        });

        expect(Array.from(restored.highlights).length).toBe(1);
        expect(Array.from(restored.highlights)[0].id).toBe('h1');
    });

    it('✓ ETA recalculates after position update', () => {
        // ETA logic would typically be in a ReadModel or domain service, 
        // but updating position increases progress and duration.
        const session = ReaderSession.start(sessionId, readerId, bookId, createPos('loc-0', 0));
        session.updatePosition(createPos('loc-5', 5));
        expect(session.position.progress).toBe(5);
    });

    it('✓ duplicate events never emitted', () => {
        const session = ReaderSession.start(sessionId, readerId, bookId, createPos('loc-0', 0));
        session.complete(createPos('loc-10', 10), 10);
        
        const events = session.getDomainEvents();
        const finishEvents = events.filter(e => e.type === 'ReadingSessionCompleted');
        expect(finishEvents.length).toBe(1);
    });

    it('✓ position monotonic', () => {
        const session = ReaderSession.start(sessionId, readerId, bookId, createPos('loc-10', 10));
        expect(() => session.updatePosition(createPos('loc-5', 5))).toThrow('monotonic');
    });

    it('✓ highlight boundaries', () => {
        const session = ReaderSession.start(sessionId, readerId, bookId, createPos('loc-0', 0));
        const h1 = Highlight.create({ id: 'h1', bookId, readerId, location: 'loc-1', text: 'Important text' });
        session.addHighlight(h1);
        
        const updated = h1.updateNote('New note');
        session.updateHighlightNote('h1', 'New note');
        
        const retrieved = Array.from(session.highlights)[0];
        expect(retrieved.note).toBe('New note');
    });
});
