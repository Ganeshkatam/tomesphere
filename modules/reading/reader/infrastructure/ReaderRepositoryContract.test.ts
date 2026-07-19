import { ReaderSession } from "../domain/ReaderSession";
import { ReadingPosition } from "../domain/ReadingPosition";
import { Bookmark } from "../domain/Bookmark";
import { Highlight } from "../domain/Highlight";
import { ReaderRepository } from "./ReaderRepository";

// Basic in-memory implementation for testing the contract
class InMemoryReaderRepository implements ReaderRepository {
  private sessions: Map<string, ReaderSession> = new Map();

  async save(session: ReaderSession): Promise<void> {
    this.sessions.set(session.id, session);
  }

  async findById(id: string): Promise<ReaderSession | null> {
    return this.sessions.get(id) || null;
  }

  async getActiveSession(readerId: string): Promise<ReaderSession | null> {
    for (const session of this.sessions.values()) {
      if (session.readerId === readerId && session.status === "active") {
        return session;
      }
    }
    return null;
  }

  async delete(id: string): Promise<void> {
    this.sessions.delete(id);
  }
}

describe("ReaderRepository Contract", () => {
  let repository: ReaderRepository;

  beforeEach(() => {
    repository = new InMemoryReaderRepository();
  });

  const createPos = (loc: string, prog: number) =>
    ReadingPosition.create({
      location: loc,
      progress: prog,
      updatedAt: new Date(),
    });

  it("should save and find a session by id", async () => {
    const session = ReaderSession.start(
      "session-1",
      "reader-1",
      "book-1",
      createPos("loc-0", 0),
    );
    await repository.save(session);

    const found = await repository.findById("session-1");
    expect(found).toBeDefined();
    expect(found?.id).toBe("session-1");
    expect(found?.bookId).toBe("book-1");
  });

  it("should correctly save and restore bookmarks and highlights", async () => {
    const session = ReaderSession.start(
      "session-1",
      "reader-1",
      "book-1",
      createPos("loc-0", 0),
    );

    const bookmark = Bookmark.create({
      id: "b1",
      bookId: "book-1",
      readerId: "reader-1",
      location: "loc-5",
      orderIndex: 0,
    });
    session.addBookmark(bookmark);

    const highlight = Highlight.create({
      id: "h1",
      bookId: "book-1",
      readerId: "reader-1",
      location: "loc-10",
      text: "Important",
    });
    session.addHighlight(highlight);

    await repository.save(session);

    const found = await repository.findById("session-1");
    expect(Array.from(found?.bookmarks || []).length).toBe(1);
    expect(Array.from(found?.highlights || []).length).toBe(1);
    expect(Array.from(found?.bookmarks || [])[0].id).toBe("b1");
    expect(Array.from(found?.highlights || [])[0].id).toBe("h1");
  });

  it("should find the active session for a reader", async () => {
    const session1 = ReaderSession.start(
      "session-1",
      "reader-1",
      "book-1",
      createPos("loc-0", 0),
    );
    session1.complete(createPos("loc-10", 10), 10);
    await repository.save(session1);

    const session2 = ReaderSession.start(
      "session-2",
      "reader-1",
      "book-2",
      createPos("loc-0", 0),
    );
    await repository.save(session2);

    const active = await repository.getActiveSession("reader-1");
    expect(active?.id).toBe("session-2");
  });

  it("should return null if no active session", async () => {
    const session1 = ReaderSession.start(
      "session-1",
      "reader-1",
      "book-1",
      createPos("loc-0", 0),
    );
    session1.complete(createPos("loc-10", 10), 10);
    await repository.save(session1);

    const active = await repository.getActiveSession("reader-1");
    expect(active).toBeNull();
  });
});
