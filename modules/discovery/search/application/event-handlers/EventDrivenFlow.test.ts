import { InProcessEventBus } from "../../../../shared/infrastructure/events/InProcessEventBus";
import { SearchModule } from "../../SearchModule";
import { RecommendationModule } from "../../../recommendations/RecommendationModule";
import { ProgressModule } from "../../../../user/progress/ProgressModule";
import { SearchRepository } from "../../domain/repositories/SearchRepository";
import { RecommendationContextStore } from "../../../recommendations/application/projections/RecommendationContextStore";
import { ProgressRepository } from "../../../../user/progress/domain/repositories/ProgressRepository";
import { BookPublishedEvent } from "../../../../reading/books/domain/events/BookEvents";
import { ReadingCompletedEvent } from "../../../../reading/reader/domain/events/ReaderEvents";
import { AggregateRoot } from "../../../../core/domain/AggregateRoot";
import { UserProgress } from "../../../../user/progress/domain/entities/UserProgress";
import { ReadingGoal } from "../../../../user/progress/domain/value-objects/ReadingGoal";
import { ReadingStreak } from "../../../../user/progress/domain/value-objects/ReadingStreak";
import { ExperiencePoints } from "../../../../user/progress/domain/value-objects/ExperiencePoints";
import { AchievementCollection } from "../../../../user/progress/domain/collections/AchievementCollection";
import { UserId } from "../../../../core/domain/UserId";

// Simple Mocks
class MockSearchRepository implements SearchRepository {
  public indexedDocs: any[] = [];
  async search(query: any) {
    return { documents: [], totalCount: 0 };
  }
  async index(doc: any) {
    this.indexedDocs.push(doc);
  }
  async updateIndex(id: string, updates: any) {}
  async removeIndex(id: string) {}
}

class MockProgressRepository implements ProgressRepository {
  public savedProgress: UserProgress | null = null;
  private readonly progress = UserProgress.fromPersistence(
    "progress-123",
    "user-123",
    ReadingGoal.create(30, 12),
    ReadingStreak.create(0, 0, null),
    ExperiencePoints.create(0),
    AchievementCollection.create([]),
    new Date(),
  );

  async findByUserId(userId: UserId): Promise<UserProgress | null> {
    return this.progress;
  }
  async save(progress: UserProgress): Promise<void> {
    this.savedProgress = progress;
  }
}

// Simulated Book Aggregate
class BookAggregate extends AggregateRoot<any> {
  constructor(id: string) {
    super(id, {});
  }

  publish(title: string, authors: string[]): void {
    this.addDomainEvent(
      new BookPublishedEvent(
        this.id,
        1, // aggregateVersion
        title,
        authors,
        ["Fiction"],
        "en",
        5, // popularity
      ),
    );
  }
}

// Simulated Reader Aggregate
class ReaderSessionAggregate extends AggregateRoot<any> {
  constructor(id: string) {
    super(id, {});
  }

  completeBook(bookId: string): void {
    this.addDomainEvent(
      new ReadingCompletedEvent(
        "user-123", // user/session aggregateId
        1, // aggregateVersion
        bookId,
        new Date(),
      ),
    );
  }
}

describe("E2E Event-Driven Monolith Flow", () => {
  it("propagates events reactively and updates projections across modules", async () => {
    // 1. Initialize Event Infrastructure
    const eventBus = new InProcessEventBus();
    const registry = eventBus.getRegistry();

    // 2. Initialize Bounded Context Modules
    const searchRepo = new MockSearchRepository();
    const recsStore = new RecommendationContextStore();
    const progressRepo = new MockProgressRepository();

    const searchModule = new SearchModule(searchRepo);
    const recsModule = new RecommendationModule(recsStore);
    const progressModule = new ProgressModule(progressRepo, eventBus);

    // 3. Register Context Handlers Symmetrically
    searchModule.registerEventHandlers(registry);
    recsModule.registerEventHandlers(registry);
    progressModule.registerEventHandlers(registry);

    // 4. Freeze Registry at application boot
    registry.freeze();

    // --- FLOW 1: Publish a Book ---
    const book = new BookAggregate("book-789");
    book.publish("Refactoring Bounded Contexts", ["Fowler"]);

    // Post-commit publish
    await eventBus.publish(book);

    // Assert: Search indexing handler triggered
    expect(searchRepo.indexedDocs).toHaveLength(1);
    expect(searchRepo.indexedDocs[0].title).toBe(
      "Refactoring Bounded Contexts",
    );
    expect(searchRepo.indexedDocs[0].authors).toEqual(["Fowler"]);

    // Assert: Recommendations & Progress ignored BookPublishedEvent (Isolation check)
    expect(recsStore.getAffinities("user-123")).toHaveLength(0);
    expect(progressRepo.savedProgress).toBeNull();

    // --- FLOW 2: Complete a Book ---
    const session = new ReaderSessionAggregate("session-123");
    session.completeBook("book-789");

    // Post-commit publish
    await eventBus.publish(session);

    // Assert: Recommendations context signal updated reactively
    expect(recsStore.getAffinities("user-123")).toContain("Sci-Fi");

    // Assert: Progress XP accumulated reactively (xp is 5 because books completed = 1)
    expect(progressRepo.savedProgress).not.toBeNull();
    expect(progressRepo.savedProgress?.experiencePoints.value).toBe(5);
  });
});
