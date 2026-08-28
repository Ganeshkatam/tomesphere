import { ReaderRenderer } from "./ports/ReaderRenderer";
import {
  LocationAnchor,
  SelectionAnchor,
  ReaderHighlight,
  ReaderNote,
  AnnotationTarget,
  ReaderBookmark,
  ReaderAnnotation,
  ReaderBookmarkView,
} from "@/shared/core/events/types";
import {
  getHighlightsAction,
  getBookmarksAction,
  getNotesAction,
  createHighlightAction,
  deleteHighlightAction,
  createNoteAction,
  updateNoteAction,
  deleteNoteAction,
  createBookmarkAction,
  deleteBookmarkAction,
  getReaderPositionAction,
} from "../presentation/actions/reader";
import { useReaderStore } from "../state/reader-store";
import { ReaderSessionFacade } from "./facades/ReaderSessionFacade";
import { ReaderSessionDto, ReaderPreferencesDto } from "./dto/ReaderPageDto";

export class ReaderService {
  private renderer: ReaderRenderer | null = null;
  private userId: string;
  private bookId: string;
  private storageKey: string;

  // Session state
  private sessionFacade: ReaderSessionFacade;
  private sessionStartTime: number | null = null;
  private accumulatedDurationSeconds: number = 0;
  private uniquePagesVisited: Set<string> = new Set<string>();

  // Auto-save debounce & Heartbeat
  private autoSaveTimer: NodeJS.Timeout | null = null;
  private readonly AUTO_SAVE_DELAY_MS = 2500;
  private pendingSaveAnchor: LocationAnchor | null = null;
  private lastSavedPositionValue: string | null = null;
  private lastFlushedPositionValue: string | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private readonly HEARTBEAT_INTERVAL_MS = 30000;
  private lastFlushedPagesCount: number = 0;

  // In-memory highlight list for hasNote computation and target promotion
  private highlights: ReaderHighlight[] = [];
  private notes: ReaderNote[] = [];
  private bookmarks: ReaderBookmark[] = [];

  constructor(
    userId: string,
    bookId: string,
    private initialSession?: ReaderSessionDto,
    private initialPreferences?: ReaderPreferencesDto,
  ) {
    this.userId = userId;
    this.bookId = bookId;
    this.storageKey = `tomesphere_reader_pos_${bookId}`;
    this.sessionFacade = new ReaderSessionFacade(bookId);
  }

  // ─── Initialization ──────────────────────────────────────────────

  public async initialize(
    renderer: ReaderRenderer,
    bookUrl: string,
    container: HTMLElement,
  ): Promise<void> {
    this.renderer = renderer;
    const store = useReaderStore.getState();

    store.setSessionState("opening");
    store.setBook(this.bookId);

    if (this.initialPreferences) {
      store.setPreferences(this.initialPreferences);
    }

    // 1. Resolve canonical reading position (prioritize server session position, then local cache)
    let initialAnchor: LocationAnchor | null = null;
    let initialPageNumber = 1;

    if (this.initialSession?.position) {
      const pos = this.initialSession.position;
      if (typeof pos === "object" && pos.type && pos.value) {
        initialAnchor = pos;
        const parsed = parseInt(pos.value, 10);
        if (Number.isInteger(parsed) && parsed > 0) {
          initialPageNumber = parsed;
        }
      }
    }

    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(this.storageKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed?.anchor && parsed?.page) {
            // If we didn't have a server position, or if cache is valid, use it
            if (!initialAnchor) {
              initialAnchor = parsed.anchor;
              initialPageNumber = parseInt(parsed.page, 10) || 1;
            }
          }
        }
      } catch (err) {
        console.warn("Could not read position from cache:", err);
      }
    }

    if (!initialAnchor) {
      try {
        const res = await getReaderPositionAction(this.bookId);
        if (res.success && res.data?.locationAnchor) {
          const remoteAnchor = res.data.locationAnchor;
          const remotePage = parseInt(remoteAnchor.value, 10);
          if (Number.isInteger(remotePage) && remotePage > 0) {
            initialAnchor = remoteAnchor;
            initialPageNumber = remotePage;
          }
        }
      } catch (err) {
        console.warn("Could not fetch remote reading position:", err);
      }
    }

    // Record initial saved position to prevent redundant immediate saves
    this.lastSavedPositionValue = initialAnchor?.value || String(initialPageNumber);
    this.lastFlushedPositionValue = this.lastSavedPositionValue;

    // Listen for location changes
    this.renderer.onLocationChanged((anchor: LocationAnchor, percentage: number) => {
      useReaderStore.getState().setAnchor(anchor);
      this.uniquePagesVisited.add(anchor.value);

      // Instant local persistence on every position update
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(
            this.storageKey,
            JSON.stringify({
              page: anchor.value,
              anchor,
              percentage,
              updatedAt: Date.now(),
            }),
          );
        } catch {}
      }

      this.scheduleAutoSave(anchor);

      if (percentage === 100) {
        this.sessionFacade.markBookCompleted();
      }
    });

    // Listen for text selections
    this.renderer.onTextSelected((anchor: SelectionAnchor, text: string) => {
      useReaderStore.getState().setActiveSelection({ anchor, text });
      useReaderStore.getState().setClickedHighlightId(null); // dismiss context menu
    });

    // Listen for highlight clicks → show context menu
    this.renderer.onHighlightClicked((id: string) => {
      useReaderStore.getState().setClickedHighlightId(id);
      useReaderStore.getState().setActiveSelection(null); // dismiss selection popup
    });

    // Open the document
    await this.renderer.initialize(bookUrl, container);
    
    // If destroy was called during async initialize (e.g. React Strict Mode), abort
    if (!this.renderer) return;
    
    // Display document starting directly at last saved reading position
    if (initialAnchor && initialPageNumber > 1) {
      await this.renderer.goTo(initialAnchor);
    } else {
      await this.renderer.display();
    }

    // Load annotations in order: highlights first, then notes, then bookmarks
    await this.loadHighlights();
    await this.loadNotes();
    await this.loadBookmarks();

    // Apply initial preferences
    this.applyPreferences(store.preferences);

    // Setup auto-save safety nets
    this.setupAutoSaveListeners();

    if (!this.renderer) return; // one last check
    store.setRendererReady(true);
    this.startSession(initialPageNumber);
  }

  private setupAutoSaveListeners() {
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", this.handleUnload);
      window.addEventListener("pagehide", this.handleUnload);
      document.addEventListener("visibilitychange", this.handleVisibilityChange);
    }
  }

  private handleVisibilityChange = () => {
    if (typeof document === "undefined") return;
    if (document.visibilityState === "hidden") {
      this.flushActiveReadingDuration();
    } else if (document.visibilityState === "visible") {
      if (useReaderStore.getState().sessionState === "active") {
        this.sessionStartTime = Date.now();
      }
    }
  };

  public async flushActiveReadingDuration(): Promise<void> {
    if (this.sessionStartTime) {
      const now = Date.now();
      const elapsed = Math.floor((now - this.sessionStartTime) / 1000);
      if (elapsed > 0) {
        this.sessionStartTime = now;
        const currentPages = this.uniquePagesVisited.size;
        const newPages = Math.max(0, currentPages - this.lastFlushedPagesCount);
        this.lastFlushedPagesCount = currentPages;

        const currentAnchor = useReaderStore.getState().currentAnchor;
        const currentPosValue = currentAnchor?.value;

        // Only send position update if the user actually navigated to a new position
        let pageToSend: number | undefined = undefined;
        if (currentPosValue && currentPosValue !== this.lastFlushedPositionValue) {
          const parsed = parseInt(currentPosValue, 10);
          if (!isNaN(parsed) && parsed > 0) {
            pageToSend = parsed;
            this.lastFlushedPositionValue = currentPosValue;
            this.lastSavedPositionValue = currentPosValue;
          }
        }

        await this.sessionFacade.completeSession(elapsed, newPages, pageToSend);
      }
    }
  }

  private handleUnload = () => {
    if (this.pendingSaveAnchor) {
      this.sessionFacade.saveProgress(this.pendingSaveAnchor);
      this.pendingSaveAnchor = null;
    }
    this.flushActiveReadingDuration();
  };

  public applyPreferences(prefs: any) {
    if (this.renderer) {
      this.renderer.theme(prefs.theme);
      this.renderer.preferences(prefs);
    }
  }

  // ─── Highlights ──────────────────────────────────────────────────

  private async loadHighlights(): Promise<void> {
    try {
      const res = await getHighlightsAction(this.bookId);
      if (res.success) {
        this.highlights = res.data.map((dto) => ({
          id: dto.id,
          userId: this.userId,
          bookId: dto.bookId,
          selectionAnchor:
            typeof dto.location === "string" && dto.location.startsWith("{")
              ? JSON.parse(dto.location)
              : dto.location,
          selectedText: dto.text || dto.selectedText || "",
          color: dto.color || "#FDE047",
          hasNote: false, // Computed later
        }));
        if (this.renderer) {
          for (const h of this.highlights) {
            await this.renderer.highlight(h);
          }
        }
      } else {
        console.error("Action failed:", res.error.message);
      }
    } catch (error) {
      console.error("Failed to load highlights", error);
    }
  }

  public async createHighlight(color: string): Promise<void> {
    const store = useReaderStore.getState();
    const selection = store.activeSelection;
    if (!selection || !this.renderer) return;

    try {
      const res = await createHighlightAction({
        bookId: this.bookId,
        selectionAnchor: selection.anchor,
        selectedText: selection.text,
        color,
      });

      if (res.success) {
        const highlight: ReaderHighlight = {
          id: res.data.id,
          userId: this.userId,
          bookId: this.bookId,
          selectionAnchor: selection.anchor,
          selectedText: selection.text,
          color,
          hasNote: false,
        };

        this.highlights.push(highlight);
        await this.renderer.highlight(highlight);
        store.setActiveSelection(null);
      }
    } catch (error) {
      console.error("Failed to create highlight", error);
    }
  }

  public async highlightSelectionAndOpenNote(color: string = "yellow"): Promise<void> {
    const store = useReaderStore.getState();
    const selection = store.activeSelection;
    if (!selection || !this.renderer) return;

    try {
      const res = await createHighlightAction({
        bookId: this.bookId,
        selectionAnchor: selection.anchor,
        selectedText: selection.text,
        color,
      });

      if (res.success) {
        const highlight: ReaderHighlight = {
          id: res.data.id,
          userId: this.userId,
          bookId: this.bookId,
          selectionAnchor: selection.anchor,
          selectedText: selection.text,
          color,
          hasNote: false,
        };

        this.highlights.push(highlight);
        await this.renderer.highlight(highlight);
        store.setActiveSelection(null);
        this.openNoteForHighlight(highlight.id);
      }
    } catch (error) {
      console.error("Failed to create highlight and open note", error);
    }
  }

  public async deleteHighlight(highlightId: string): Promise<void> {
    if (!this.renderer) return;

    try {
      const res = await deleteHighlightAction(highlightId);
      if (!res.success) throw new Error(res.error.message);
      await this.renderer.removeHighlight(highlightId);

      // Find the highlight being deleted (for target promotion)
      const deletedHighlight = this.highlights.find(
        (h) => h.id === highlightId,
      );

      // Remove from local list
      this.highlights = this.highlights.filter((h) => h.id !== highlightId);

      // Promote any attached notes from highlight target → location target
      if (deletedHighlight) {
        this.notes = this.notes.map((note) => {
          if (
            note.target.type === "highlight" &&
            note.target.highlightId === highlightId
          ) {
            return {
              ...note,
              target: {
                type: "location" as const,
                anchor: deletedHighlight.selectionAnchor.start,
              },
            };
          }
          return note;
        });
        useReaderStore.getState().setNotes(this.notes);
      }

      useReaderStore.getState().setClickedHighlightId(null);
    } catch (error) {
      console.error("Failed to delete highlight", error);
    }
  }

  // ─── Notes ───────────────────────────────────────────────────────

  private async loadNotes(): Promise<void> {
    try {
      const res = await getNotesAction(this.bookId);
      if (res.success) {
        this.notes = res.data;
        useReaderStore.getState().setNotes(this.notes);

        // Compute hasNote on highlights
        const highlightIdsWithNotes = new Set(
          this.notes
            .filter((n) => n.target.type === "highlight")
            .map(
              (n) =>
                (n.target as { type: "highlight"; highlightId: string })
                  .highlightId,
            ),
        );
        this.highlights = this.highlights.map((h) => ({
          ...h,
          hasNote: highlightIdsWithNotes.has(h.id),
        }));
      } else {
        console.error("Action failed:", res.error.message);
      }
    } catch (error) {
      console.error("Failed to load notes", error);
    }
  }

  public openNoteEditor(
    target: AnnotationTarget,
    existingNote?: ReaderNote,
  ): void {
    useReaderStore.getState().setActiveNote({
      target,
      existingNoteId: existingNote?.id,
      initialBody: existingNote?.bodyMarkdown,
    });
  }

  public openNoteForHighlight(highlightId: string): void {
    const existing = this.notes.find(
      (n) =>
        n.target.type === "highlight" && n.target.highlightId === highlightId,
    );

    const target: AnnotationTarget = { type: "highlight", highlightId };

    if (existing) {
      this.openNoteEditor(target, existing);
    } else {
      this.openNoteEditor(target);
    }

    useReaderStore.getState().setClickedHighlightId(null);
  }

  public async saveNote(bodyMarkdown: string): Promise<void> {
    const store = useReaderStore.getState();
    const activeNote = store.activeNote;
    if (!activeNote) return;

    try {
      if (activeNote.existingNoteId) {
        await updateNoteAction({
          noteId: activeNote.existingNoteId,
          bodyMarkdown,
        });

        this.notes = this.notes.map((n) =>
          n.id === activeNote.existingNoteId
            ? { ...n, bodyMarkdown, updatedAt: new Date().toISOString() }
            : n,
        );
      } else {
        const res = await createNoteAction({
          bookId: this.bookId,
          target: activeNote.target,
          bodyMarkdown,
        });

        if (res.success) {
          const newNote: ReaderNote = {
            id: res.data.id,
            userId: this.userId,
            bookId: this.bookId,
            target: activeNote.target,
            bodyMarkdown,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          this.notes.push(newNote);

          if (activeNote.target.type === "highlight") {
            const targetHighlightId = activeNote.target.highlightId;
            this.highlights = this.highlights.map((h) =>
              h.id === targetHighlightId ? { ...h, hasNote: true } : h,
            );
          }
        }
      }

      store.setNotes(this.notes);
      store.setActiveNote(null);
    } catch (error) {
      console.error("Failed to save note", error);
    }
  }

  public async deleteNote(noteId: string): Promise<void> {
    try {
      const res = await deleteNoteAction(noteId);
      if (!res.success) throw new Error(res.error.message);

      const deleted = this.notes.find((n) => n.id === noteId);
      this.notes = this.notes.filter((n) => n.id !== noteId);

      if (deleted && deleted.target.type === "highlight") {
        const stillHasNote = this.notes.some(
          (n) =>
            n.target.type === "highlight" &&
            n.target.highlightId ===
              (deleted.target as { type: "highlight"; highlightId: string })
                .highlightId,
        );
        if (!stillHasNote) {
          this.highlights = this.highlights.map((h) =>
            h.id ===
            (deleted.target as { type: "highlight"; highlightId: string })
              .highlightId
              ? { ...h, hasNote: false }
              : h,
          );
        }
      }

      useReaderStore.getState().setNotes(this.notes);
      useReaderStore.getState().setActiveNote(null);
    } catch (error) {
      console.error("Failed to delete note", error);
    }
  }

  // ─── Projections (Application Layer) ─────────────────────────────

  public getAnnotations(): ReaderAnnotation[] {
    return this.highlights.map((highlight) => {
      const note = this.notes.find(
        (n) =>
          n.target.type === "highlight" &&
          n.target.highlightId === highlight.id,
      );
      return { highlight, note };
    });
  }

  public getBookmarkViews(): ReaderBookmarkView[] {
    const currentAnchor = useReaderStore.getState().currentAnchor;
    return this.bookmarks.map((bookmark) => ({
      bookmark,
      isCurrent: currentAnchor?.value === bookmark.anchor.value,
    }));
  }

  // ─── Bookmarks ───────────────────────────────────────────────────

  private async loadBookmarks(): Promise<void> {
    try {
      const res = await getBookmarksAction(this.bookId);
      if (res.success) {
        this.bookmarks = res.data.map((dto) => ({
          id: dto.id,
          userId: this.userId,
          bookId: dto.bookId,
          anchor: JSON.parse(dto.location),
          label: dto.name || undefined,
          createdAt: dto.createdAt,
        }));
        useReaderStore.getState().setBookmarks(this.bookmarks);
      } else {
        console.error("Action failed:", res.error.message);
      }
    } catch (error) {
      console.error("Failed to load bookmarks", error);
    }
  }

  public isCurrentLocationBookmarked(): boolean {
    const currentAnchor = useReaderStore.getState().currentAnchor;
    if (!currentAnchor) return false;
    return this.bookmarks.some((b) => b.anchor.value === currentAnchor.value);
  }

  public async toggleBookmark(): Promise<void> {
    const currentAnchor = useReaderStore.getState().currentAnchor;
    if (!currentAnchor) return;

    const existing = this.bookmarks.find(
      (b) => b.anchor.value === currentAnchor.value,
    );

    if (existing) {
      await this.deleteBookmark(existing.id);
    } else {
      try {
        const res = await createBookmarkAction({
          bookId: this.bookId,
          anchor: currentAnchor,
        });

        if (res.success) {
          const newBookmark: ReaderBookmark = {
            id: res.data.id,
            userId: this.userId,
            bookId: this.bookId,
            anchor: currentAnchor,
            createdAt: new Date().toISOString(),
          };

          this.bookmarks = [newBookmark, ...this.bookmarks];
          useReaderStore.getState().setBookmarks(this.bookmarks);
        }
      } catch (error) {
        console.error("Failed to create bookmark", error);
      }
    }
  }

  public async deleteBookmark(bookmarkId: string): Promise<void> {
    try {
      const res = await deleteBookmarkAction(bookmarkId);
      if (!res.success) throw new Error(res.error.message);
      this.bookmarks = this.bookmarks.filter((b) => b.id !== bookmarkId);
      useReaderStore.getState().setBookmarks(this.bookmarks);
    } catch (error) {
      console.error("Failed to delete bookmark", error);
    }
  }

  // ─── Session ─────────────────────────────────────────────────────

  public async resume(anchor: LocationAnchor): Promise<void> {
    if (!this.renderer) return;
    await this.renderer.goTo(anchor);
  }

  public async goToLocation(anchor: LocationAnchor): Promise<void> {
    if (!this.renderer) return;
    await this.renderer.goTo(anchor);
  }

  public async next(): Promise<void> {
    if (!this.renderer) return;
    await this.renderer.next();
  }

  public async previous(): Promise<void> {
    if (!this.renderer) return;
    await this.renderer.previous();
  }

  public async renderThumbnail(
    pageNumber: number,
    canvas: HTMLCanvasElement,
  ): Promise<void> {
    if (!this.renderer?.renderThumbnail) return;
    await this.renderer.renderThumbnail(pageNumber, canvas);
  }

  public zoomIn(): void {
    const prefs = useReaderStore.getState().preferences;
    const currentZoom = prefs.zoom || 100;
    const targetZoom = Math.min(300, currentZoom + 15);
    const newPrefs = {
      ...prefs,
      zoom: targetZoom,
      fontSize: Math.min(32, prefs.fontSize + 2),
    };
    useReaderStore.getState().setPreferences(newPrefs);
    this.renderer?.preferences(newPrefs);
  }

  public zoomOut(): void {
    const prefs = useReaderStore.getState().preferences;
    const currentZoom = prefs.zoom || 100;
    const targetZoom = Math.max(80, currentZoom - 15);
    const newPrefs = {
      ...prefs,
      zoom: targetZoom,
      fontSize: Math.max(10, prefs.fontSize - 2),
    };
    useReaderStore.getState().setPreferences(newPrefs);
    this.renderer?.preferences(newPrefs);
  }

  public resetZoom(): void {
    const prefs = useReaderStore.getState().preferences;
    const newPrefs = { ...prefs, zoom: 100, fontSize: 16 };
    useReaderStore.getState().setPreferences(newPrefs);
    this.renderer?.preferences(newPrefs);
  }

  public setZoom(zoomPercentage: number): void {
    const prefs = useReaderStore.getState().preferences;
    const clamped = Math.min(300, Math.max(80, zoomPercentage));
    const newPrefs = { ...prefs, zoom: clamped };
    useReaderStore.getState().setPreferences(newPrefs);
    this.renderer?.preferences(newPrefs);
  }

  public startSession(initialPage: number = 1): void {
    const store = useReaderStore.getState();
    if (store.sessionState === "active") return;

    this.sessionStartTime = Date.now();
    store.setSessionState("active");
    this.sessionFacade.startSession(initialPage);

    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = setInterval(() => {
      this.flushActiveReadingDuration();
    }, this.HEARTBEAT_INTERVAL_MS);
  }

  public pauseSession(): void {
    const store = useReaderStore.getState();
    if (store.sessionState !== "active") return;

    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }

    this.flushActiveReadingDuration();
    store.setSessionState("paused");
  }

  private scheduleAutoSave(anchor: LocationAnchor): void {
    // If the reading position has not changed, do not schedule or send updates
    if (this.lastSavedPositionValue === anchor.value) {
      return;
    }

    this.pendingSaveAnchor = anchor;
    if (this.autoSaveTimer) {
      clearTimeout(this.autoSaveTimer);
    }

    this.autoSaveTimer = setTimeout(async () => {
      if (this.pendingSaveAnchor && this.pendingSaveAnchor.value !== this.lastSavedPositionValue) {
        const anchorToSave = this.pendingSaveAnchor;
        await this.savePosition(anchorToSave);
        this.pendingSaveAnchor = null;
      }
    }, this.AUTO_SAVE_DELAY_MS);
  }

  private async savePosition(anchor: LocationAnchor): Promise<void> {
    if (this.lastSavedPositionValue === anchor.value) return;
    this.lastSavedPositionValue = anchor.value;
    this.lastFlushedPositionValue = anchor.value;
    await this.sessionFacade.saveProgress(anchor);
  }

  public async completeSession(): Promise<void> {
    this.pauseSession();
    useReaderStore.getState().setSessionState("completed");

    const currentAnchor = useReaderStore.getState().currentAnchor;
    if (currentAnchor) {
      if (this.autoSaveTimer) clearTimeout(this.autoSaveTimer);
      await this.savePosition(currentAnchor);
    }
  }

  public async destroy(): Promise<void> {
    if (typeof window !== "undefined") {
      window.removeEventListener("beforeunload", this.handleUnload);
      window.removeEventListener("pagehide", this.handleUnload);
      document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    }

    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }

    // Force pending save
    if (this.pendingSaveAnchor) {
      await this.savePosition(this.pendingSaveAnchor);
      this.pendingSaveAnchor = null;
    }

    await this.completeSession();
    if (this.renderer) {
      await this.renderer.destroy();
      this.renderer = null;
    }
  }
}
