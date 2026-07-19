import { InProcessEventBus } from "./InProcessEventBus";
import { DomainEvent } from "../../domain/events/DomainEvent";
import { EventHandler } from "../../application/events/EventHandler";
import { EventEnvelope } from "../../application/events/EventEnvelope";

class SimpleEvent extends DomainEvent<string> {
  public static readonly EVENT_NAME = "SimpleEvent";
  public readonly eventName = SimpleEvent.EVENT_NAME;
}

describe("InProcessEventBus and EventRegistry", () => {
  it("executes handlers sequentially and preserves registration freezing", async () => {
    const eventBus = new InProcessEventBus();
    const registry = eventBus.getRegistry();

    const executionOrder: string[] = [];

    const handlerA: EventHandler<SimpleEvent> = {
      handle: async () => {
        executionOrder.push("A");
      },
    };

    const handlerB: EventHandler<SimpleEvent> = {
      handle: async () => {
        executionOrder.push("B");
      },
    };

    eventBus.subscribe(SimpleEvent, handlerA);
    eventBus.subscribe(SimpleEvent, handlerB);

    // Freeze the registry to lock registrations
    registry.freeze();

    // Attempting to register after freeze should throw
    expect(() =>
      eventBus.subscribe(SimpleEvent, { handle: async () => {} }),
    ).toThrow("EventRegistry is frozen and cannot accept new registrations.");

    // Duplicate registration guard
    const registry2 = new InProcessEventBus().getRegistry();
    registry2.register(SimpleEvent, handlerA);
    expect(() => registry2.register(SimpleEvent, handlerA)).toThrow(
      "Handler is already registered for this event type.",
    );

    // Trigger dispatch
    const event = new SimpleEvent("id-123", 1);
    await eventBus.publish([event]);

    // Handlers must execute sequentially in registration order (A before B)
    expect(executionOrder).toEqual(["A", "B"]);
  });

  it("propagates errors and halts sequential execution of subsequent handlers", async () => {
    const eventBus = new InProcessEventBus();

    let handlerBCalled = false;

    const handlerA: EventHandler<SimpleEvent> = {
      handle: async () => {
        throw new Error("Handler A Failed");
      },
    };

    const handlerB: EventHandler<SimpleEvent> = {
      handle: async () => {
        handlerBCalled = true;
      },
    };

    eventBus.subscribe(SimpleEvent, handlerA);
    eventBus.subscribe(SimpleEvent, handlerB);

    const event = new SimpleEvent("id-123", 1);

    // Publishing should throw, wrapping the first failure, and stop B from executing
    await expect(eventBus.publish([event])).rejects.toThrow("Handler A Failed");
    expect(handlerBCalled).toBe(false);
  });
});
