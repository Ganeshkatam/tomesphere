/**
 *  PLATFORM CONTRACT: DocumentEngine
 *
 * This is the foundational abstraction layer for the Reader Domain.
 * The UI components MUST NEVER import `pdf.js` or `epub.js` directly.
 * All rendering engines must implement this interface to guarantee
 * that the reader UI can swap engines (PDF, EPUB, OCR) seamlessly.
 */

export interface RenderedPage {
  pageNumber: number;
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  scale: number;
}

export interface TextItem {
  str: string;
  dir: string;
  width: number;
  height: number;
  transform: number[];
  fontName: string;
  hasEOL: boolean;
}

export interface TextContent {
  items: TextItem[];
  styles: Record<string, any>;
}

export interface SearchResult {
  pageNumber: number;
  matchIndex: number;
  snippet: string;
}

export interface DocumentMetadata {
  title?: string;
  author?: string;
  totalPages: number;
  engineType: "pdf" | "epub" | "unknown";
}

export interface DocumentEngine {
  /**
   * Bootstraps the engine and loads the document into memory.
   */
  load(buffer: ArrayBuffer): Promise<void>;

  /**
   * Synchronously returns the total page count (must be available post-load).
   */
  getPageCount(): number;

  /**
   * Returns extracted metadata like title, author, and page count.
   */
  getMetadata(): Promise<DocumentMetadata>;

  /**
   * Renders a specific page to an HTML5 Canvas wrapped in our custom type.
   */
  renderPage(page: number, scale?: number): Promise<RenderedPage>;

  /**
   * Extracts text layers for selection, highlighting, and search.
   */
  getTextContent(page: number): Promise<TextContent>;

  /**
   * Executes a search across the document.
   */
  search(query: string): Promise<SearchResult[]>;

  /**
   * Safely cleans up web workers, canvas contexts, and memory.
   */
  destroy(): Promise<void>;
}
