import {
  LocationAnchor,
  SelectionAnchor,
  ReaderHighlight,
} from "@/shared/core/events/types";

export interface ReaderRenderer {
  /**
   * Bootstraps the engine and loads the document into the provided DOM element.
   */
  open(bookUrl: string, container: HTMLElement): Promise<void>;

  /**
   * Navigates to a specific location (e.g. epubcfi).
   */
  goTo(anchor: LocationAnchor): Promise<void>;

  /**
   * Gets the user's current reading location.
   */
  currentLocation(): Promise<LocationAnchor>;

  /**
   * Subscribe to location changes (e.g. page turns).
   */
  onLocationChanged(callback: (anchor: LocationAnchor) => void): () => void;

  /**
   * Add a visual highlight to the renderer.
   * The renderer itself does not track state, it just renders this domain object.
   */
  addHighlight(highlight: ReaderHighlight): Promise<void>;

  /**
   * Remove a visual highlight from the renderer by ID.
   */
  removeHighlight(id: string): Promise<void>;

  /**
   * Subscribe to user text selections.
   * Emits the selected text and its anchor.
   */
  onTextSelected(
    callback: (anchor: SelectionAnchor, text: string) => void,
  ): () => void;

  /**
   * Subscribe to clicks on existing highlights.
   * The application logic decides what happens next (edit, delete, etc).
   */
  onHighlightClicked(callback: (id: string) => void): () => void;

  /**
   * Safely cleans up iframes, workers, and memory.
   */
  destroy(): Promise<void>;
}
