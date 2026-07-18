import { create } from 'zustand';
import { LocationAnchor, SelectionAnchor } from '@/modules/shared/core/events/types';

// 🚨 STRICT ARCHITECTURAL RULE:
// This store ONLY holds presentation and session state.
// Persistence is owned entirely by the Backend Commands.

export type SessionState = 'idle' | 'opening' | 'active' | 'paused' | 'completed';

export interface ActiveSelection {
    anchor: SelectionAnchor;
    text: string;
}

interface ReaderSessionState {
    currentBookId: string | null;
    currentAnchor: LocationAnchor | null;
    isReading: boolean;
    sessionState: SessionState;
    rendererReady: boolean;
    loading: boolean;
    
    // Active text selection for the highlight popup
    activeSelection: ActiveSelection | null;
    
    // Actions
    setBook: (id: string) => void;
    setAnchor: (anchor: LocationAnchor) => void;
    setSessionState: (state: SessionState) => void;
    setRendererReady: (ready: boolean) => void;
    setLoading: (loading: boolean) => void;
    setActiveSelection: (selection: ActiveSelection | null) => void;
}

export const useReaderStore = create<ReaderSessionState>((set) => ({
    currentBookId: null,
    currentAnchor: null,
    isReading: false,
    sessionState: 'idle',
    rendererReady: false,
    loading: false,
    activeSelection: null,

    setBook: (id) => set({ currentBookId: id }),
    setAnchor: (anchor) => set({ currentAnchor: anchor }),
    setSessionState: (state) => set({ sessionState: state, isReading: state === 'active' }),
    setRendererReady: (ready) => set({ rendererReady: ready }),
    setLoading: (loading) => set({ loading }),
    setActiveSelection: (selection) => set({ activeSelection: selection })
}));

