import ePub, { Book, Rendition } from "epubjs";
import { ReaderRenderer } from "../../../application/ports/ReaderRenderer";
import {
  LocationAnchor,
  SelectionAnchor,
  ReaderHighlight,
} from "@/shared/core/events/types";

export class EpubJsRenderer implements ReaderRenderer {
  private book: Book | null = null;
  private rendition: Rendition | null = null;

  private locationListeners: Set<(anchor: LocationAnchor) => void> = new Set();
  private selectionListeners: Set<
    (anchor: SelectionAnchor, text: string) => void
  > = new Set();
  private highlightClickListeners: Set<(id: string) => void> = new Set();

  private handleRelocated = (location: any) => {
    const anchor: LocationAnchor = {
      type: "epubcfi",
      value: location.start.cfi,
    };
    this.locationListeners.forEach((listener) => listener(anchor));
  };

  private handleSelected = (cfiRange: string, contents: any) => {
    // Extract the selected text
    const text = contents.window.getSelection().toString();

    const anchor: SelectionAnchor = {
      version: 1,
      // For EPUB CFI, the range string encodes both start and end relative to a base node.
      // We store the full range string in both to preserve standard epubjs compatibility.
      start: { type: "epubcfi", value: cfiRange },
      end: { type: "epubcfi", value: cfiRange },
    };

    this.selectionListeners.forEach((listener) => listener(anchor, text));

    // Clear the native DOM selection so our custom highlight logic takes over cleanly
    contents.window.getSelection().removeAllRanges();
  };

  async open(bookUrl: string, container: HTMLElement): Promise<void> {
    this.book = ePub(bookUrl);

    this.rendition = this.book.renderTo(container, {
      width: "100%",
      height: "100%",
      spread: "none",
      manager: "continuous",
      flow: "scrolled",
    });

    this.rendition.on("relocated", this.handleRelocated);
    this.rendition.on("selected", this.handleSelected);

    await this.rendition.display();
  }

  async goTo(anchor: LocationAnchor): Promise<void> {
    if (!this.rendition || anchor.type !== "epubcfi") return;
    await this.rendition.display(anchor.value);
  }

  async currentLocation(): Promise<LocationAnchor> {
    if (!this.rendition) throw new Error("Renderer not initialized");
    const location = this.rendition.currentLocation() as any;
    return {
      type: "epubcfi",
      value: location.start.cfi,
    };
  }

  onLocationChanged(callback: (anchor: LocationAnchor) => void): () => void {
    this.locationListeners.add(callback);
    return () => this.locationListeners.delete(callback);
  }

  async addHighlight(highlight: ReaderHighlight): Promise<void> {
    if (!this.rendition) return;

    // The CFI range string is safely stored in start.value
    const cfiRange = highlight.selectionAnchor.start.value;
    this.highlightIdToCfi.set(highlight.id, cfiRange);

    this.rendition.annotations.highlight(
      cfiRange,
      { fill: highlight.color },
      (e: Event) => {
        // Prevent event from propagating and triggering other clicks (e.g. page turns)
        e.preventDefault();
        e.stopPropagation();
        this.highlightClickListeners.forEach((listener) =>
          listener(highlight.id),
        );
      },
      "highlight",
      { "data-highlight-id": highlight.id },
    );
  }

  async removeHighlight(id: string): Promise<void> {
    if (!this.rendition) return;

    const cfiRange = this.highlightIdToCfi.get(id);
    if (cfiRange) {
      this.rendition.annotations.remove(cfiRange, "highlight");
      this.highlightIdToCfi.delete(id);
    }
  }

  // Internal mapping for deletions
  private highlightIdToCfi: Map<string, string> = new Map();

  onTextSelected(
    callback: (anchor: SelectionAnchor, text: string) => void,
  ): () => void {
    this.selectionListeners.add(callback);
    return () => this.selectionListeners.delete(callback);
  }

  onHighlightClicked(callback: (id: string) => void): () => void {
    this.highlightClickListeners.add(callback);
    return () => this.highlightClickListeners.delete(callback);
  }

  async destroy(): Promise<void> {
    this.locationListeners.clear();
    this.selectionListeners.clear();
    this.highlightClickListeners.clear();
    this.highlightIdToCfi.clear();

    if (this.rendition) {
      this.rendition.off("relocated", this.handleRelocated);
      this.rendition.off("selected", this.handleSelected);
      this.rendition.destroy();
      this.rendition = null;
    }
    if (this.book) {
      this.book.destroy();
      this.book = null;
    }
  }
}
