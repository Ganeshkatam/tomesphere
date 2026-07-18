import { ReaderRenderer } from '../contracts/ReaderRenderer';
import { LocationAnchor, SelectionAnchor, ReaderHighlight, ReaderNote, AnnotationTarget } from '@/modules/shared/core/events/types';
import { executeUpdateReaderPosition } from './commands/UpdateReaderPositionCommand';
import { executeCompleteReadingSession } from './commands/CompleteReadingSessionCommand';
import { executeCreateHighlight } from './commands/CreateHighlightCommand';
import { executeDeleteHighlight } from './commands/DeleteHighlightCommand';
import { executeCreateNote } from './commands/CreateNoteCommand';
import { executeUpdateNote } from './commands/UpdateNoteCommand';
import { executeDeleteNote } from './commands/DeleteNoteCommand';
import { executeGetHighlights } from './queries/GetHighlightsQuery';
import { executeGetNotes } from './queries/GetNotesQuery';
import { useReaderStore } from '../state/reader-store';

export class ReaderService {
    private renderer: ReaderRenderer | null = null;
    private userId: string;
    private bookId: string;
    
    // Session state
    private sessionStartTime: number | null = null;
    private accumulatedDurationSeconds: number = 0;
    
    // Auto-save debounce
    private autoSaveTimer: NodeJS.Timeout | null = null;
    private readonly AUTO_SAVE_DELAY_MS = 2500;

    // In-memory highlight list for hasNote computation and target promotion
    private highlights: ReaderHighlight[] = [];
    private notes: ReaderNote[] = [];

    constructor(userId: string, bookId: string) {
        this.userId = userId;
        this.bookId = bookId;
    }

    // ─── Initialization ──────────────────────────────────────────────

    public async initialize(renderer: ReaderRenderer, bookUrl: string, container: HTMLElement): Promise<void> {
        this.renderer = renderer;
        const store = useReaderStore.getState();

        store.setSessionState('opening');
        store.setBook(this.bookId);

        // Listen for location changes
        this.renderer.onLocationChanged((anchor: LocationAnchor) => {
            useReaderStore.getState().setAnchor(anchor);
            this.scheduleAutoSave(anchor);
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
        await this.renderer.open(bookUrl, container);
        
        // Load annotations in order: highlights first, then notes
        await this.loadHighlights();
        await this.loadNotes();

        store.setRendererReady(true);
        this.startSession();
    }

    // ─── Highlights ──────────────────────────────────────────────────

    private async loadHighlights(): Promise<void> {
        try {
            const highlights = await executeGetHighlights({ userId: this.userId, bookId: this.bookId });
            this.highlights = highlights;
            if (this.renderer) {
                for (const h of highlights) {
                    await this.renderer.addHighlight(h);
                }
            }
        } catch (error) {
            console.error('Failed to load highlights', error);
        }
    }

    public async createHighlight(color: string): Promise<void> {
        const store = useReaderStore.getState();
        const selection = store.activeSelection;
        if (!selection || !this.renderer) return;

        try {
            const { id } = await executeCreateHighlight({
                userId: this.userId,
                bookId: this.bookId,
                selectionAnchor: selection.anchor,
                selectedText: selection.text,
                color
            });

            const highlight: ReaderHighlight = {
                id,
                userId: this.userId,
                bookId: this.bookId,
                selectionAnchor: selection.anchor,
                selectedText: selection.text,
                color,
                hasNote: false
            };

            this.highlights.push(highlight);
            await this.renderer.addHighlight(highlight);
            store.setActiveSelection(null);
        } catch (error) {
            console.error('Failed to create highlight', error);
        }
    }

    public async deleteHighlight(highlightId: string): Promise<void> {
        if (!this.renderer) return;

        try {
            await executeDeleteHighlight({ userId: this.userId, highlightId });
            await this.renderer.removeHighlight(highlightId);

            // Find the highlight being deleted (for target promotion)
            const deletedHighlight = this.highlights.find(h => h.id === highlightId);

            // Remove from local list
            this.highlights = this.highlights.filter(h => h.id !== highlightId);

            // Promote any attached notes from highlight target → location target
            if (deletedHighlight) {
                this.notes = this.notes.map(note => {
                    if (note.target.type === 'highlight' && note.target.highlightId === highlightId) {
                        return {
                            ...note,
                            target: {
                                type: 'location' as const,
                                anchor: deletedHighlight.selectionAnchor.start
                            }
                        };
                    }
                    return note;
                });
                useReaderStore.getState().setNotes(this.notes);
            }

            useReaderStore.getState().setClickedHighlightId(null);
        } catch (error) {
            console.error('Failed to delete highlight', error);
        }
    }

    // ─── Notes ───────────────────────────────────────────────────────

    private async loadNotes(): Promise<void> {
        try {
            this.notes = await executeGetNotes({ userId: this.userId, bookId: this.bookId });
            useReaderStore.getState().setNotes(this.notes);

            // Compute hasNote on highlights
            const highlightIdsWithNotes = new Set(
                this.notes
                    .filter(n => n.target.type === 'highlight')
                    .map(n => (n.target as { type: 'highlight'; highlightId: string }).highlightId)
            );
            this.highlights = this.highlights.map(h => ({
                ...h,
                hasNote: highlightIdsWithNotes.has(h.id)
            }));
        } catch (error) {
            console.error('Failed to load notes', error);
        }
    }

    public openNoteEditor(target: AnnotationTarget, existingNote?: ReaderNote): void {
        useReaderStore.getState().setActiveNote({
            target,
            existingNoteId: existingNote?.id,
            initialBody: existingNote?.bodyMarkdown
        });
    }

    /**
     * Idempotent "Add Note" for a highlight.
     * If a note already exists for this highlight, opens it for editing.
     */
    public openNoteForHighlight(highlightId: string): void {
        const existing = this.notes.find(
            n => n.target.type === 'highlight' && n.target.highlightId === highlightId
        );

        const target: AnnotationTarget = { type: 'highlight', highlightId };

        if (existing) {
            this.openNoteEditor(target, existing);
        } else {
            this.openNoteEditor(target);
        }

        // Dismiss the context menu
        useReaderStore.getState().setClickedHighlightId(null);
    }

    public async saveNote(bodyMarkdown: string): Promise<void> {
        const store = useReaderStore.getState();
        const activeNote = store.activeNote;
        if (!activeNote) return;

        try {
            if (activeNote.existingNoteId) {
                // Update existing note
                await executeUpdateNote({
                    userId: this.userId,
                    noteId: activeNote.existingNoteId,
                    bodyMarkdown
                });

                // Update local state
                this.notes = this.notes.map(n =>
                    n.id === activeNote.existingNoteId
                        ? { ...n, bodyMarkdown, updatedAt: new Date().toISOString() }
                        : n
                );
            } else {
                // Create new note
                const { id } = await executeCreateNote({
                    userId: this.userId,
                    bookId: this.bookId,
                    target: activeNote.target,
                    bodyMarkdown
                });

                const newNote: ReaderNote = {
                    id,
                    userId: this.userId,
                    bookId: this.bookId,
                    target: activeNote.target,
                    bodyMarkdown,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };

                this.notes.push(newNote);

                // Update hasNote on the highlight
                if (activeNote.target.type === 'highlight') {
                    const targetHighlightId = activeNote.target.highlightId;
                    this.highlights = this.highlights.map(h =>
                        h.id === targetHighlightId
                            ? { ...h, hasNote: true }
                            : h
                    );
                }
            }

            store.setNotes(this.notes);
            store.setActiveNote(null);
        } catch (error) {
            console.error('Failed to save note', error);
        }
    }

    public async deleteNote(noteId: string): Promise<void> {
        try {
            await executeDeleteNote({ userId: this.userId, noteId });

            const deleted = this.notes.find(n => n.id === noteId);
            this.notes = this.notes.filter(n => n.id !== noteId);

            // Update hasNote on the highlight if applicable
            if (deleted && deleted.target.type === 'highlight') {
                const stillHasNote = this.notes.some(
                    n => n.target.type === 'highlight' &&
                         n.target.highlightId === (deleted.target as { type: 'highlight'; highlightId: string }).highlightId
                );
                if (!stillHasNote) {
                    this.highlights = this.highlights.map(h =>
                        h.id === (deleted.target as { type: 'highlight'; highlightId: string }).highlightId
                            ? { ...h, hasNote: false }
                            : h
                    );
                }
            }

            useReaderStore.getState().setNotes(this.notes);
            useReaderStore.getState().setActiveNote(null);
        } catch (error) {
            console.error('Failed to delete note', error);
        }
    }

    // ─── Session ─────────────────────────────────────────────────────

    public async resume(anchor: LocationAnchor): Promise<void> {
        if (!this.renderer) return;
        await this.renderer.goTo(anchor);
    }

    public startSession(): void {
        const store = useReaderStore.getState();
        if (store.sessionState === 'active') return;

        this.sessionStartTime = Date.now();
        store.setSessionState('active');
    }

    public pauseSession(): void {
        const store = useReaderStore.getState();
        if (store.sessionState !== 'active') return;

        if (this.sessionStartTime) {
            const duration = Math.floor((Date.now() - this.sessionStartTime) / 1000);
            this.accumulatedDurationSeconds += duration;
            this.sessionStartTime = null;
        }

        store.setSessionState('paused');
    }

    private scheduleAutoSave(anchor: LocationAnchor): void {
        if (this.autoSaveTimer) {
            clearTimeout(this.autoSaveTimer);
        }
        
        this.autoSaveTimer = setTimeout(async () => {
            await this.savePosition(anchor);
        }, this.AUTO_SAVE_DELAY_MS);
    }

    private async savePosition(anchor: LocationAnchor): Promise<void> {
        try {
            await executeUpdateReaderPosition({
                userId: this.userId,
                bookId: this.bookId,
                locationAnchor: anchor
            });
        } catch (error) {
            console.error('Failed to auto-save position', error);
        }
    }

    public async completeSession(): Promise<void> {
        this.pauseSession();
        useReaderStore.getState().setSessionState('completed');

        const currentAnchor = useReaderStore.getState().currentAnchor;
        if (currentAnchor) {
            if (this.autoSaveTimer) clearTimeout(this.autoSaveTimer);
            await this.savePosition(currentAnchor);
        }

        if (this.accumulatedDurationSeconds > 0) {
            try {
                await executeCompleteReadingSession({
                    userId: this.userId,
                    bookId: this.bookId,
                    durationSeconds: this.accumulatedDurationSeconds
                });
            } catch (error) {
                console.error('Failed to record completed session', error);
            }
        }
    }

    public async destroy(): Promise<void> {
        await this.completeSession();
        if (this.renderer) {
            await this.renderer.destroy();
            this.renderer = null;
        }
    }
}
