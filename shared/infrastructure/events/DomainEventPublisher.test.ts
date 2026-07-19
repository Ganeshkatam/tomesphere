import { DomainEventPublisher } from "../../application/events/DomainEventPublisher";
import { InProcessEventBus } from "./InProcessEventBus";
import {  AggregateRoot  } from "@/shared/kernel/AggregateRoot";
import { DomainEvent } from "../../domain/events/DomainEvent";
import { EventHandler } from "../../application/events/EventHandler";
import { EventEnvelope } from "../../application/events/EventEnvelope";

class TestEvent extends DomainEvent<string> {
  public static readonly EVENT_NAME = "TestEvent";
  public readonly eventName = TestEvent.EVENT_NAME;
}

class TestAggregate extends AggregateRoot<any> {
  constructor(id: string) {
    super(id, {});
  }

  public trigger(): void {
    this.addDomainEvent(new TestEvent(this.id, 1));
  }
}

class MockEventHandler implements EventHandler<TestEvent> {
  public handledCount = 0;
  async handle(envelope: EventEnvelope<TestEvent>): Promise<void> {
    this.handledCount++;
  }
}

describe("DomainEventPublisher", () => {
  it("should collect, publish, and clear events from aggregate post-commit", async () => {
    const eventBus = new InProcessEventBus();
    const handler = new MockEventHandler();
    eventBus.subscribe(TestEvent, handler);

    const aggregate = new TestAggregate("agg-123");
    aggregate.trigger();

    expect(aggregate.collectDomainEvents()).toHaveLength(1);

    // Simulate publishing via DomainEventPublisher
    await eventBus.publish(aggregate);

    // Should call handler and clear events on aggregate
    expect(handler.handledCount).toBe(1);
    expect(aggregate.collectDomainEvents()).toHaveLength(0);
  });

  it("should NOT clear aggregate events if publishing fails", async () => {
    const eventBus = new InProcessEventBus();

    // Register failing handler
    eventBus.subscribe(TestEvent, {
      handle: async () => {
        throw new Error("Publishing failed");
      },
    });

    const aggregate = new TestAggregate("agg-123");
    aggregate.trigger();

    await expect(eventBus.publish(aggregate)).rejects.toThrow(
      "Publishing failed",
    );

    // Events must remain on aggregate to prevent event loss
    expect(aggregate.collectDomainEvents()).toHaveLength(1);
  });
});
