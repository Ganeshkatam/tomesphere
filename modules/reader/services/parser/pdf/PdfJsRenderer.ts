import * as pdfjsLib from "pdfjs-dist";
import { ReaderRenderer } from "../../../application/ports/ReaderRenderer";
import {
  LocationAnchor,
  SelectionAnchor,
  ReaderHighlight,
} from "@/shared/core/events/types";
import { ReaderPreferencesDto } from "../../../application/dto/ReaderPageDto";

// Set worker source (necessary for pdf.js to run without blocking the main thread)
if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  // Normally you'd point this to a local hosted worker. For Next.js, this is often placed in public/
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

export class PdfJsRenderer implements ReaderRenderer {
  private pdfDocument: pdfjsLib.PDFDocumentProxy | null = null;
  private container: HTMLElement | null = null;
  private canvas: HTMLCanvasElement | null = null;

  private currentPageNum = 1;
  private totalPages = 1;
  private currentZoom = 1.0;

  private locationListeners: Set<
    (anchor: LocationAnchor, percentage: number) => void
  > = new Set();

  // NOTE: PDF text selection/highlighting requires a TextLayer overlaid on the canvas.
  // Implementing a robust TextLayer is out of scope for V1 minimum parity unless specifically required.
  // We provide stub methods for text events.
  private selectionListeners: Set<
    (anchor: SelectionAnchor, text: string) => void
  > = new Set();
  private highlightClickListeners: Set<(id: string) => void> = new Set();

  async initialize(bookUrl: string, container: HTMLElement): Promise<void> {
    this.container = container;

    // Clear container
    this.container.innerHTML = "";

    // Create canvas
    this.canvas = document.createElement("canvas");
    this.container.appendChild(this.canvas);

    // Apply styling to container to handle scrolling/centering
    this.container.style.overflow = "auto";
    this.container.style.display = "flex";
    this.container.style.justifyContent = "center";
    this.container.style.alignItems = "center";

    // Load PDF
    const loadingTask = pdfjsLib.getDocument(bookUrl);
    this.pdfDocument = await loadingTask.promise;
    this.totalPages = this.pdfDocument.numPages;
  }

  async display(): Promise<void> {
    await this.renderPage(this.currentPageNum);
  }

  private async renderPage(num: number) {
    if (!this.pdfDocument || !this.canvas) return;

    const page = await this.pdfDocument.getPage(num);
    const viewport = page.getViewport({ scale: this.currentZoom });

    const context = this.canvas.getContext("2d");
    if (!context) return;

    this.canvas.height = viewport.height;
    this.canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    await page.render(renderContext as any).promise;

    // Dispatch location changed
    const percentage = (this.currentPageNum / this.totalPages) * 100;
    const anchor: LocationAnchor = {
      type: "pdf",
      value: this.currentPageNum.toString(),
    };
    this.locationListeners.forEach((listener) => listener(anchor, percentage));
  }

  async goTo(anchor: LocationAnchor | string): Promise<void> {
    if (!this.pdfDocument) return;

    let targetPage = this.currentPageNum;
    if (typeof anchor === "string") {
      targetPage = parseInt(anchor, 10);
    } else if (anchor.type === "pdf") {
      targetPage = parseInt(anchor.value, 10);
    }

    if (isNaN(targetPage) || targetPage < 1 || targetPage > this.totalPages)
      return;

    this.currentPageNum = targetPage;
    await this.renderPage(this.currentPageNum);
  }

  async next(): Promise<void> {
    if (this.currentPageNum >= this.totalPages) return;
    this.currentPageNum++;
    await this.renderPage(this.currentPageNum);
  }

  async previous(): Promise<void> {
    if (this.currentPageNum <= 1) return;
    this.currentPageNum--;
    await this.renderPage(this.currentPageNum);
  }

  async getProgress(): Promise<{ percentage: number; anchor: LocationAnchor }> {
    const percentage =
      (this.currentPageNum / Math.max(1, this.totalPages)) * 100;
    return {
      percentage,
      anchor: { type: "pdf", value: this.currentPageNum.toString() },
    };
  }

  onLocationChanged(
    callback: (anchor: LocationAnchor, percentage: number) => void,
  ): () => void {
    this.locationListeners.add(callback);
    return () => this.locationListeners.delete(callback);
  }

  async highlight(highlight: ReaderHighlight): Promise<void> {
    // Canvas-based PDF rendering without a TextLayer doesn't support DOM-based highlighting easily.
    console.warn(
      "Highlights not fully supported in simple Canvas PDF renderer",
    );
  }

  async removeHighlight(id: string): Promise<void> {}

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

  async bookmark(anchor: LocationAnchor): Promise<void> {}

  async annotation(id: string, action: "show" | "hide"): Promise<void> {}

  async search(query: string): Promise<any[]> {
    return []; // Requires text extraction logic which is complex for PDFs
  }

  theme(themeName: "light" | "dark" | "sepia"): void {
    if (!this.canvas) return;
    // For canvas, dark mode can be a simple CSS inversion filter
    if (themeName === "dark") {
      this.canvas.style.filter = "invert(1) hue-rotate(180deg)";
    } else if (themeName === "sepia") {
      this.canvas.style.filter = "sepia(0.5)";
    } else {
      this.canvas.style.filter = "none";
    }
  }

  preferences(prefs: ReaderPreferencesDto): void {
    // PDFs don't reflow text size, so we apply zoom scaling
    const newZoom = prefs.zoom / 100;
    if (this.currentZoom !== newZoom) {
      this.currentZoom = newZoom;
      // Re-render current page with new zoom
      this.renderPage(this.currentPageNum).catch(console.error);
    }
  }

  async destroy(): Promise<void> {
    this.locationListeners.clear();
    this.selectionListeners.clear();
    this.highlightClickListeners.clear();

    if (this.pdfDocument) {
      await this.pdfDocument.destroy();
      this.pdfDocument = null;
    }

    if (this.container && this.canvas) {
      this.container.removeChild(this.canvas);
      this.canvas = null;
    }
  }
}
