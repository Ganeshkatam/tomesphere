import * as pdfjsLib from "pdfjs-dist";
import { ReaderRenderer } from "../../../application/ports/ReaderRenderer";
import {
  LocationAnchor,
  SelectionAnchor,
  ReaderHighlight,
} from "@/shared/core/events/types";
import { ReaderPreferencesDto } from "../../../application/dto/ReaderPageDto";
import { useReaderStore } from "../../../state/reader-store";

if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

type PageState = {
  wrapper: HTMLDivElement;
  canvas: HTMLCanvasElement | null;
  page: pdfjsLib.PDFPageProxy | null;
  renderTask: pdfjsLib.RenderTask | null;
  loadPromise: Promise<void> | null;
  generation: number;
  renderedZoom: number | null;
  isIntersecting: boolean;
};

const PAGE_CLASS = "tomesphere-pdf-page";
const PAGE_PLACEHOLDER_CLASS = "tomesphere-pdf-page-placeholder";
const VIRTUALIZATION_ROOT_MARGIN = "100% 0px";
const MAX_RENDERED_PAGES = 10;
const MAX_DEVICE_PIXEL_RATIO = 2;

export class PdfJsRenderer implements ReaderRenderer {
  private pdfDocument: pdfjsLib.PDFDocumentProxy | null = null;
  private loadingTask: pdfjsLib.PDFDocumentLoadingTask | null = null;
  private container: HTMLElement | null = null;
  private observer: IntersectionObserver | null = null;
  private scrollRaf: number | null = null;
  private pageStates = new Map<number, PageState>();

  private currentPageNum = 1;
  private totalPages = 1;
  private currentZoom = 1;
  private initialized = false;
  private destroyed = false;
  private isNavigating = false;
  private navigatingTimer: any = null;
  private lastEmittedPage = 0;
  private documentGeneration = 0;
  private placeholderRatio = 8.5 / 11;

  private locationListeners: Set<
    (anchor: LocationAnchor, percentage: number) => void
  > = new Set();

  private selectionListeners: Set<
    (anchor: SelectionAnchor, text: string) => void
  > = new Set();
  private highlightClickListeners: Set<(id: string) => void> = new Set();

  async initialize(bookUrl: string, container: HTMLElement): Promise<void> {
    await this.destroy();

    this.destroyed = false;
    this.initialized = false;
    this.documentGeneration += 1;
    const generation = this.documentGeneration;
    this.container = container;
    this.currentPageNum = 1;
    this.lastEmittedPage = 0;

    container.replaceChildren();
    container.style.overflow = "auto";
    container.style.display = "block";
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.padding = "24px";
    container.style.boxSizing = "border-box";
    container.style.scrollBehavior = "smooth";
    container.style.overscrollBehavior = "contain";
    container.classList.add("tomesphere-pdf-scroll-container");

    const loadingTask = pdfjsLib.getDocument(bookUrl);
    this.loadingTask = loadingTask;
    const pdfDocument = await loadingTask.promise;

    if (generation !== this.documentGeneration || this.destroyed) {
      await pdfDocument.destroy();
      return;
    }

    this.pdfDocument = pdfDocument;
    this.totalPages = Math.max(1, pdfDocument.numPages);
    useReaderStore.getState().setTotalPages(this.totalPages);

    await this.createPageScaffolding(generation);
    if (generation !== this.documentGeneration || this.destroyed) return;

    this.installObservers();
    this.initialized = true;
    await this.ensurePageRendered(1);
    this.emitLocation(1);
  }

  async display(): Promise<void> {
    if (!this.initialized || !this.pdfDocument) return;
    await this.ensurePageRendered(this.currentPageNum);
  }

  private async createPageScaffolding(generation: number): Promise<void> {
    const container = this.container;
    const pdfDocument = this.pdfDocument;
    if (!container || !pdfDocument || generation !== this.documentGeneration) return;

    const firstPage = await pdfDocument.getPage(1);
    if (generation !== this.documentGeneration || this.destroyed) {
      firstPage.cleanup();
      return;
    }

    const firstViewport = firstPage.getViewport({ scale: 1 });
    if (firstViewport.width > 0 && firstViewport.height > 0) {
      this.placeholderRatio = firstViewport.width / firstViewport.height;
    }
    firstPage.cleanup();

    const fragment = document.createDocumentFragment();
    for (let pageNumber = 1; pageNumber <= this.totalPages; pageNumber += 1) {
      const wrapper = document.createElement("div");
      wrapper.className = PAGE_CLASS;
      wrapper.dataset.pageNumber = String(pageNumber);
      wrapper.setAttribute("aria-label", `PDF page ${pageNumber}`);
      wrapper.style.position = "relative";
      wrapper.style.width = "100%";
      wrapper.style.minHeight = "320px";
      wrapper.style.aspectRatio = `${this.placeholderRatio}`;
      wrapper.style.display = "block";
      wrapper.style.textAlign = "center";
      wrapper.style.boxSizing = "border-box";
      wrapper.style.margin = "0 auto 24px auto";
      wrapper.style.contain = "layout style";
      wrapper.style.scrollMarginBlock = "12px";
      wrapper.classList.add(PAGE_PLACEHOLDER_CLASS);

      const state: PageState = {
        wrapper,
        canvas: null,
        page: null,
        renderTask: null,
        loadPromise: null,
        generation: 0,
        renderedZoom: null,
        isIntersecting: false,
      };
      this.pageStates.set(pageNumber, state);
      fragment.appendChild(wrapper);
    }
    container.appendChild(fragment);
  }

  private installObservers(): void {
    const container = this.container;
    if (!container) return;

    this.observer?.disconnect();
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const pageNumber = Number((entry.target as HTMLElement).dataset.pageNumber);
          if (!Number.isInteger(pageNumber)) continue;
          
          const state = this.pageStates.get(pageNumber);
          if (state) state.isIntersecting = entry.isIntersecting;

          if (entry.isIntersecting) {
            void this.ensurePageRendered(pageNumber);
          } else {
            void this.unloadPage(pageNumber);
          }
        }
      },
      {
        root: container,
        rootMargin: VIRTUALIZATION_ROOT_MARGIN,
        threshold: 0.01,
      },
    );

    for (const state of this.pageStates.values()) {
      this.observer.observe(state.wrapper);
    }

    container.addEventListener("scroll", this.handleScroll, { passive: true });
    container.addEventListener("wheel", this.handleWheel, { passive: false });
    container.addEventListener("touchstart", this.handleTouchStart, { passive: true });
    container.addEventListener("touchmove", this.handleTouchMove, { passive: false });
    container.addEventListener("touchend", this.handleTouchEnd, { passive: true });
    container.addEventListener("touchcancel", this.handleTouchEnd, { passive: true });
  }

  private initialPinchDistance = 0;
  private initialPinchZoom = 100;
  private isPinching = false;
  private pinchRaf: number | null = null;

  private readonly handleWheel = (e: WheelEvent): void => {
    // Detect trackpad pinch-to-zoom (dispatches ctrlKey + wheel event)
    if (e.ctrlKey) {
      e.preventDefault();
      const currentPct = Math.round(this.currentZoom * 100);
      const step = e.deltaY < 0 ? 5 : -5;
      const targetZoom = Math.min(240, Math.max(100, currentPct + step));
      if (targetZoom !== currentPct) {
        useReaderStore.getState().updatePreference("zoom", targetZoom);
        this.preferences({
          ...useReaderStore.getState().preferences,
          zoom: targetZoom,
        });
      }
    }
  };

  private readonly handleTouchStart = (e: TouchEvent): void => {
    if (e.touches.length === 2) {
      this.isPinching = true;
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      this.initialPinchDistance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY,
      );
      this.initialPinchZoom = Math.round(this.currentZoom * 100);
    }
  };

  private readonly handleTouchMove = (e: TouchEvent): void => {
    if (!this.isPinching || e.touches.length !== 2) return;
    if (e.cancelable) e.preventDefault();

    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    const currentDistance = Math.hypot(
      touch1.clientX - touch2.clientX,
      touch1.clientY - touch2.clientY,
    );

    if (this.initialPinchDistance > 0) {
      const scaleFactor = currentDistance / this.initialPinchDistance;
      const rawTarget = Math.round(this.initialPinchZoom * scaleFactor);
      const targetZoom = Math.min(240, Math.max(100, rawTarget));

      if (this.pinchRaf !== null) {
        window.cancelAnimationFrame(this.pinchRaf);
      }

      this.pinchRaf = window.requestAnimationFrame(() => {
        this.pinchRaf = null;
        const currentPct = Math.round(this.currentZoom * 100);
        if (Math.abs(targetZoom - currentPct) >= 2) {
          useReaderStore.getState().updatePreference("zoom", targetZoom);
          this.preferences({
            ...useReaderStore.getState().preferences,
            zoom: targetZoom,
          });
        }
      });
    }
  };

  private readonly handleTouchEnd = (e: TouchEvent): void => {
    if (e.touches.length < 2) {
      this.isPinching = false;
      this.initialPinchDistance = 0;
      if (this.pinchRaf !== null) {
        window.cancelAnimationFrame(this.pinchRaf);
        this.pinchRaf = null;
      }
    }
  };

  private readonly handleScroll = (): void => {
    if (this.isNavigating) return;
    if (this.scrollRaf !== null) return;
    this.scrollRaf = window.requestAnimationFrame(() => {
      this.scrollRaf = null;
      if (!this.isNavigating) {
        this.updateCurrentPageFromViewport();
      }
    });
  };

  private updateCurrentPageFromViewport(): void {
    const container = this.container;
    if (!container || this.pageStates.size === 0) return;

    const containerRect = container.getBoundingClientRect();
    const centerX = containerRect.left + container.clientWidth / 2;
    const centerY = containerRect.top + container.clientHeight / 2;
    const centerElement = document.elementFromPoint(centerX, centerY);
    const wrapper = centerElement?.closest<HTMLElement>(`.${PAGE_CLASS}`);
    const candidatePage = wrapper?.dataset.pageNumber;
    const nearestPage = candidatePage ? Number(candidatePage) : this.currentPageNum;

    if (!Number.isInteger(nearestPage) || nearestPage < 1 || nearestPage > this.totalPages) return;
    if (nearestPage === this.currentPageNum) return;

    this.currentPageNum = nearestPage;
    this.emitLocation(nearestPage);
    this.enforceRenderBudget(nearestPage);
  }

  private emitLocation(pageNumber: number): void {
    if (pageNumber < 1 || pageNumber > this.totalPages) return;
    if (pageNumber === this.lastEmittedPage) return;

    this.lastEmittedPage = pageNumber;
    const percentage = (pageNumber / Math.max(1, this.totalPages)) * 100;
    const anchor: LocationAnchor = {
      type: "pdf",
      value: String(pageNumber),
    };
    this.locationListeners.forEach((listener) => listener(anchor, percentage));
  }

  private async ensurePageRendered(pageNumber: number): Promise<void> {
    const pdfDocument = this.pdfDocument;
    const state = this.pageStates.get(pageNumber);
    if (!pdfDocument || !state || this.destroyed) return;

    if (state.canvas && state.renderedZoom === this.currentZoom) return;
    if (state.loadPromise) {
      await state.loadPromise;
      return;
    }

    const generation = ++state.generation;
    const zoom = this.currentZoom;
    state.loadPromise = this.renderPage(pageNumber, state, generation, zoom)
      .catch((error: unknown) => {
        if (!this.isCancellationError(error)) {
          console.error(`Failed to render PDF page ${pageNumber}`, error);
        }
      })
      .finally(() => {
        if (state.generation === generation) {
          state.loadPromise = null;
        }
      });

    await state.loadPromise;
  }

  private async renderPage(
    pageNumber: number,
    state: PageState,
    generation: number,
    zoom: number,
  ): Promise<void> {
    const pdfDocument = this.pdfDocument;
    if (!pdfDocument || this.destroyed) return;

    const page = await pdfDocument.getPage(pageNumber);
    if (!this.isCurrentPageState(state, generation)) {
      page.cleanup();
      return;
    }
    const unscaledViewport = page.getViewport({ scale: 1 });
    const containerWidth = Math.max(300, (this.container?.clientWidth || window.innerWidth) - 48);
    const containerHeight = Math.max(300, (this.container?.clientHeight || window.innerHeight) - 48);

    // Compute fit-to-viewport base scale so the page is always neatly framed
    const fitScale = Math.min(
      containerWidth / Math.max(1, unscaledViewport.width),
      (containerHeight * 1.25) / Math.max(1, unscaledViewport.height),
    );

    const effectiveScale = Math.max(0.5, fitScale * Math.max(1.0, zoom));
    const viewport = page.getViewport({ scale: effectiveScale });

    const outputScale = Math.min(
      typeof window === "undefined" ? 1 : window.devicePixelRatio || 1,
      MAX_DEVICE_PIXEL_RATIO,
    );
    const canvas = document.createElement("canvas");
    canvas.className = "tomesphere-pdf-canvas";
    canvas.width = Math.max(1, Math.floor(viewport.width * outputScale));
    canvas.height = Math.max(1, Math.floor(viewport.height * outputScale));
    canvas.style.display = "block";
    canvas.style.margin = "0 auto";
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;
    canvas.style.maxWidth = "100%";
    canvas.style.boxSizing = "border-box";
    canvas.style.backgroundColor = "white";
    canvas.style.boxShadow = "0 25px 50px -12px rgb(0 0 0 / 0.25)";
    canvas.style.objectFit = "contain";
    canvas.style.userSelect = "text";
    canvas.setAttribute("aria-label", `Rendered PDF page ${pageNumber}`);

    state.wrapper.style.display = "flex";
    state.wrapper.style.justifyContent = "center";
    state.wrapper.style.maxWidth = "100%";
    state.wrapper.style.overflow = "hidden";

    const context = canvas.getContext("2d", { alpha: false });
    if (!context) {
      page.cleanup();
      this.restorePlaceholder(state);
      throw new Error("Unable to acquire a 2D canvas context");
    }

    context.setTransform(outputScale, 0, 0, outputScale, 0, 0);
    const renderTask = page.render({
      canvasContext: context,
      viewport,
    } as any);
    state.renderTask = renderTask;

    try {
      await renderTask.promise;
    } catch (error: unknown) {
      if (state.renderTask === renderTask) state.renderTask = null;
      // The canvas was never added to the DOM, so no need to remove it
      page.cleanup();
      throw error;
    }

    if (!this.isCurrentPageState(state, generation) || zoom !== this.currentZoom) {
      page.cleanup();
      return;
    }

    state.wrapper.replaceChildren(canvas);
    state.wrapper.style.aspectRatio = "auto";
    state.wrapper.style.minHeight = "0";
    state.wrapper.classList.remove(PAGE_PLACEHOLDER_CLASS);
    state.canvas = canvas;
    state.page = page;
    state.renderedZoom = zoom;
    state.renderTask = null;
    this.enforceRenderBudget(this.currentPageNum);
  }

  private isCurrentPageState(state: PageState, generation: number): boolean {
    return !this.destroyed && state.generation === generation;
  }

  private async unloadPage(pageNumber: number, expectedGeneration?: number, keepCanvas = false): Promise<void> {
    const state = this.pageStates.get(pageNumber);
    if (!state) return;
    if (expectedGeneration !== undefined && state.generation !== expectedGeneration) return;

    state.generation += 1;
    const renderTask = state.renderTask;
    state.renderTask = null;

    if (renderTask) {
      renderTask.cancel();
      await renderTask.promise.catch(() => undefined);
    }

    const page = state.page;
    state.page = null;
    state.loadPromise = null;

    if (!keepCanvas) {
      state.renderedZoom = null;
      state.canvas?.remove();
      state.canvas = null;
      this.restorePlaceholder(state);
    }

    if (page) page.cleanup();
  }

  private restorePlaceholder(state: PageState): void {
    state.wrapper.classList.add(PAGE_PLACEHOLDER_CLASS);
    state.wrapper.style.aspectRatio = `${this.placeholderRatio}`;
    state.wrapper.style.minHeight = "320px";
  }

  private enforceRenderBudget(centerPage: number): void {
    if (this.isNavigating) return;

    const rendered = [...this.pageStates.entries()]
      .filter(([, state]) => state.canvas !== null || state.loadPromise !== null)
      .sort(([pageA], [pageB]) => {
        const distanceA = Math.abs(pageA - centerPage);
        const distanceB = Math.abs(pageB - centerPage);
        return distanceA - distanceB;
      });

    for (const [pageNumber] of rendered.slice(MAX_RENDERED_PAGES)) {
      // Never unload immediate neighboring pages (+/- 2 pages)
      if (Math.abs(pageNumber - centerPage) <= 2) continue;
      void this.unloadPage(pageNumber);
    }
  }

  async goTo(anchor: LocationAnchor | string): Promise<void> {
    if (!this.pdfDocument || !this.container) return;

    const rawPage = typeof anchor === "string" ? anchor : anchor.value;
    const targetPage = Number.parseInt(rawPage, 10);
    if (!Number.isInteger(targetPage) || targetPage < 1 || targetPage > this.totalPages) return;

    this.isNavigating = true;
    if (this.navigatingTimer) clearTimeout(this.navigatingTimer);

    this.currentPageNum = targetPage;
    this.emitLocation(targetPage);

    const state = this.pageStates.get(targetPage);
    if (!state) return;

    // Pre-render target page and immediate neighbors before scroll to eliminate white flashes
    await this.ensurePageRendered(targetPage);
    if (targetPage + 1 <= this.totalPages) void this.ensurePageRendered(targetPage + 1);
    if (targetPage - 1 >= 1) void this.ensurePageRendered(targetPage - 1);

    state.wrapper.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });

    this.navigatingTimer = setTimeout(() => {
      this.isNavigating = false;
      this.enforceRenderBudget(targetPage);
    }, 450);
  }

  async next(): Promise<void> {
    const target = Math.min(this.totalPages, this.currentPageNum + 1);
    if (target === this.currentPageNum) return;
    await this.goTo(String(target));
  }

  async previous(): Promise<void> {
    const target = Math.max(1, this.currentPageNum - 1);
    if (target === this.currentPageNum) return;
    await this.goTo(String(target));
  }

  async getProgress(): Promise<{ percentage: number; anchor: LocationAnchor }> {
    const page = Math.min(Math.max(this.currentPageNum, 1), this.totalPages);
    return {
      percentage: (page / Math.max(1, this.totalPages)) * 100,
      anchor: { type: "pdf", value: String(page) },
    };
  }

  async renderThumbnail(
    pageNumber: number,
    canvas: HTMLCanvasElement,
  ): Promise<void> {
    if (!this.pdfDocument || this.destroyed || pageNumber < 1 || pageNumber > this.totalPages)
      return;

    let page: pdfjsLib.PDFPageProxy | null = null;

    try {
      page = await this.pdfDocument.getPage(pageNumber);
      if (this.destroyed || !this.pdfDocument) {
        page.cleanup();
        return;
      }

      const unscaledViewport = page.getViewport({ scale: 1 });
      const targetWidth = 220;
      const scale = targetWidth / Math.max(1, unscaledViewport.width);
      const viewport = page.getViewport({ scale });

      const dpr =
        typeof window !== "undefined"
          ? Math.min(window.devicePixelRatio || 1, 2)
          : 1;
      canvas.width = Math.max(1, Math.floor(viewport.width * dpr));
      canvas.height = Math.max(1, Math.floor(viewport.height * dpr));

      const context = canvas.getContext("2d", { alpha: false });
      if (!context) {
        page.cleanup();
        return;
      }

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      await page.render({
        canvasContext: context,
        viewport,
      } as any).promise;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "";
      const isExpectedCancellation =
        /cancel/i.test(message) ||
        /worker was destroyed/i.test(message) ||
        this.destroyed;

      if (!isExpectedCancellation && process.env.NODE_ENV === "development") {
        console.warn(
          `[PdfJsRenderer] Handled thumbnail rendering error gracefully on page ${pageNumber}:`,
          message || err,
        );
      }

      // Draw a clean fallback representation on the canvas
      try {
        const context = canvas.getContext("2d");
        if (context && canvas.width > 0 && canvas.height > 0) {
          context.fillStyle = "#1e293b";
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.fillStyle = "#94a3b8";
          context.font = "bold 10px monospace";
          context.textAlign = "center";
          context.textBaseline = "middle";
          context.fillText(`P.${pageNumber}`, canvas.width / 2, canvas.height / 2);
        }
      } catch {
        // Fallback canvas drawing failed silently
      }
    } finally {
      if (page) {
        try {
          page.cleanup();
        } catch {
          // Ignore cleanup errors
        }
      }
    }
  }

  onLocationChanged(
    callback: (anchor: LocationAnchor, percentage: number) => void,
  ): () => void {
    this.locationListeners.add(callback);
    return () => this.locationListeners.delete(callback);
  }

  async highlight(highlight: ReaderHighlight): Promise<void> {
    console.warn(
      "PDF highlighting requires a text layer and is not implemented by the canvas renderer",
      highlight,
    );
  }

  async removeHighlight(id: string): Promise<void> {
    void id;
  }

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

  async bookmark(anchor: LocationAnchor): Promise<void> {
    void anchor;
  }

  async annotation(id: string, action: "show" | "hide"): Promise<void> {
    void id;
    void action;
  }

  async search(query: string): Promise<any[]> {
    void query;
    return [];
  }

  theme(themeName: "light" | "dark" | "sepia"): void {
    for (const state of this.pageStates.values()) {
      if (!state.canvas) continue;
      if (themeName === "dark") {
        state.canvas.style.filter = "invert(1) hue-rotate(180deg)";
      } else if (themeName === "sepia") {
        state.canvas.style.filter = "sepia(0.5)";
      } else {
        state.canvas.style.filter = "none";
      }
    }
  }

  private getMinZoom(): number {
    return 1.0; // Never allow zooming out smaller than 100% / viewport fit
  }

  preferences(prefs: ReaderPreferencesDto): void {
    const minZoom = this.getMinZoom();
    const newZoom = Math.max(minZoom, Math.min(2.4, (prefs.zoom || 100) / 100));
    if (this.currentZoom === newZoom) return;

    this.currentZoom = newZoom;
    const targetPage = this.currentPageNum;
    void this.resetRenderedPagesForZoom(targetPage);
  }

  private async resetRenderedPagesForZoom(targetPage: number): Promise<void> {
    const unloads: Promise<void>[] = [];
    for (const [pageNumber, state] of this.pageStates) {
      if (state.canvas || state.loadPromise) {
        // Keep the old canvas visible while rendering the new zoom to prevent a white flash
        const keepCanvas = state.isIntersecting || pageNumber === targetPage;
        unloads.push(this.unloadPage(pageNumber, undefined, keepCanvas));
      }
    }
    await Promise.all(unloads);
    
    if (!this.destroyed) {
      const reRenders: Promise<void>[] = [];
      for (const [pageNumber, state] of this.pageStates) {
        if (state.isIntersecting) {
          reRenders.push(this.ensurePageRendered(pageNumber));
        }
      }
      if (reRenders.length === 0) {
        reRenders.push(this.ensurePageRendered(targetPage));
      }
      await Promise.all(reRenders);
    }
  }

  async destroy(): Promise<void> {
    this.destroyed = true;
    this.documentGeneration += 1;

    if (this.navigatingTimer) {
      clearTimeout(this.navigatingTimer);
      this.navigatingTimer = null;
    }
    this.isNavigating = false;

    if (this.scrollRaf !== null && typeof window !== "undefined") {
      window.cancelAnimationFrame(this.scrollRaf);
      this.scrollRaf = null;
    }

    if (this.pinchRaf !== null && typeof window !== "undefined") {
      window.cancelAnimationFrame(this.pinchRaf);
      this.pinchRaf = null;
    }

    this.container?.removeEventListener("scroll", this.handleScroll);
    this.container?.removeEventListener("wheel", this.handleWheel);
    this.container?.removeEventListener("touchstart", this.handleTouchStart);
    this.container?.removeEventListener("touchmove", this.handleTouchMove);
    this.container?.removeEventListener("touchend", this.handleTouchEnd);
    this.container?.removeEventListener("touchcancel", this.handleTouchEnd);
    this.observer?.disconnect();
    this.observer = null;

    const unloads = [...this.pageStates.keys()].map((pageNumber) => this.unloadPage(pageNumber));
    await Promise.all(unloads);
    this.pageStates.clear();

    if (this.loadingTask) {
      await this.loadingTask.destroy();
      this.loadingTask = null;
    }

    if (this.pdfDocument) {
      await this.pdfDocument.destroy();
      this.pdfDocument = null;
    }

    this.container?.replaceChildren();
    this.container = null;
    this.initialized = false;
    this.currentPageNum = 1;
    this.totalPages = 1;
    this.lastEmittedPage = 0;
  }

  private isCancellationError(error: unknown): boolean {
    if (error instanceof Error) {
      return (
        error.name === "RenderingCancelledException" || 
        /cancel/i.test(error.message) ||
        /worker was destroyed/i.test(error.message)
      );
    }
    return false;
  }
}
