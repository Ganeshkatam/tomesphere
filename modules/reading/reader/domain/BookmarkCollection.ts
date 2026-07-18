import { Bookmark } from './Bookmark';

export class BookmarkCollection {
    private itemsArray: Bookmark[];

    private constructor(items: Bookmark[]) {
        // Ensure sorted by orderIndex
        this.itemsArray = [...items].sort((a, b) => a.orderIndex - b.orderIndex);
    }

    public static create(items: Bookmark[] = []): BookmarkCollection {
        return new BookmarkCollection(items);
    }

    public items(): Iterable<Bookmark> {
        return this.itemsArray;
    }

    // Iterator protocol for syntactic sugar
    public *[Symbol.iterator]() {
        for (const item of this.itemsArray) {
            yield item;
        }
    }

    public add(bookmark: Bookmark): BookmarkCollection {
        if (this.itemsArray.some(b => b.id === bookmark.id)) {
            throw new Error(`Bookmark with id ${bookmark.id} already exists`);
        }

        if (this.itemsArray.some(b => b.location === bookmark.location)) {
            // Ignore duplicate locations, or throw depending on policy.
            // Requirement says "duplicate bookmark ignored"
            return this;
        }

        // Auto-assign orderIndex if not set properly (just append)
        const orderIndex = bookmark.orderIndex >= 0 ? bookmark.orderIndex : this.itemsArray.length;
        const newBookmark = bookmark.updateOrder(orderIndex);

        return new BookmarkCollection([...this.itemsArray, newBookmark]);
    }

    public remove(id: string): BookmarkCollection {
        const newItems = this.itemsArray.filter(b => b.id !== id);
        if (newItems.length === this.itemsArray.length) {
            throw new Error(`Bookmark with id ${id} not found`);
        }
        
        // Re-index remaining
        const reindexed = newItems.map((b, idx) => b.updateOrder(idx));
        return new BookmarkCollection(reindexed);
    }

    public move(id: string, newIndex: number): BookmarkCollection {
        const index = this.itemsArray.findIndex(b => b.id === id);
        if (index === -1) {
            throw new Error(`Bookmark with id ${id} not found`);
        }

        const boundedIndex = Math.max(0, Math.min(newIndex, this.itemsArray.length - 1));
        
        const newItems = [...this.itemsArray];
        const [movedItem] = newItems.splice(index, 1);
        newItems.splice(boundedIndex, 0, movedItem);

        // Re-index all
        const reindexed = newItems.map((b, idx) => b.updateOrder(idx));
        return new BookmarkCollection(reindexed);
    }
}
