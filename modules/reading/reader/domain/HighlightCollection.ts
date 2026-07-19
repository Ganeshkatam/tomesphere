import { Highlight } from "./Highlight";

export class HighlightCollection {
  private itemsArray: Highlight[];

  private constructor(items: Highlight[]) {
    this.itemsArray = [...items];
  }

  public static create(items: Highlight[] = []): HighlightCollection {
    return new HighlightCollection(items);
  }

  public items(): Iterable<Highlight> {
    return this.itemsArray;
  }

  public *[Symbol.iterator]() {
    for (const item of this.itemsArray) {
      yield item;
    }
  }

  public add(highlight: Highlight): HighlightCollection {
    // Prevent duplicate ID
    if (this.itemsArray.some((h) => h.id === highlight.id)) {
      throw new Error(`Highlight with id ${highlight.id} already exists`);
    }

    // Prevent exact duplicate location/text overlap
    // In a real system, we might check character offsets. Here we use location and text equality as a proxy.
    const isOverlap = this.itemsArray.some(
      (h) => h.location === highlight.location && h.text === highlight.text,
    );
    if (isOverlap) {
      throw new Error("Highlight overlaps with an existing highlight");
    }

    return new HighlightCollection([...this.itemsArray, highlight]);
  }

  public remove(id: string): HighlightCollection {
    const newItems = this.itemsArray.filter((h) => h.id !== id);
    if (newItems.length === this.itemsArray.length) {
      throw new Error(`Highlight with id ${id} not found`);
    }
    return new HighlightCollection(newItems);
  }

  public replace(highlight: Highlight): HighlightCollection {
    const index = this.itemsArray.findIndex((h) => h.id === highlight.id);
    if (index === -1) {
      throw new Error(`Highlight with id ${highlight.id} not found`);
    }

    const newItems = [...this.itemsArray];
    newItems[index] = highlight;
    return new HighlightCollection(newItems);
  }
}
