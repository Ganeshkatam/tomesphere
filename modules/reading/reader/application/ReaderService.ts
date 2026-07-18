import { ReaderRenderer } from '../contracts/ReaderRenderer';
import { LocationAnchor, SelectionAnchor, ReaderHighlight } from '@/modules/shared/core/events/types';
import { executeUpdateReaderPosition } from './commands/UpdateReaderPositionCommand';
import { executeCompleteReadingSession } from './commands/CompleteReadingSessionCommand';
import { executeCreateHighlight } from './commands/CreateHighlightCommand';
import { executeDeleteHighlight } from './commands/DeleteHighlightCommand';
import { executeGetHighlights } from './queries/GetHighlightsQuery';
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

    constructor(userId: string, bookId: string) {
        this.userId = userId;
        this.bookId = bookId;
    }

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
        });

        // Listen for highlight clicks
        this.renderer.onHighlightClicked((id: string) => {
            // In Sprint 2A, clicking a highlight just deletes it immediately for validation.
            // In future sprints, this will open a menu.
            if (confirm('Delete this highlight?')) {
                this.deleteHighlight(id);
            }
        });

        // Open the document
        await this.renderer.open(bookUrl, container);
        
        // Load highlights
        await this.loadHighlights();

        store.setRendererReady(true);
        this.startSession();
    }

    private async loadHighlights(): Promise<void> {
        try {
            const highlights = await executeGetHighlights({ userId: this.userId, bookId: this.bookId });
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
                color
            };

            await this.renderer.addHighlight(highlight);
            store.setActiveSelection(null); // Clear selection popup
        } catch (error) {
            console.error('Failed to create highlight', error);
        }
    }

    public async deleteHighlight(highlightId: string): Promise<void> {
        if (!this.renderer) return;

        try {
            await executeDeleteHighlight({ userId: this.userId, highlightId });
            await this.renderer.removeHighlight(highlightId);
        } catch (error) {
            console.error('Failed to delete highlight', error);
        }
    }

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

