import { create } from "zustand";
import {
  LocationAnchor,
  SelectionAnchor,
  AnnotationTarget,
  ReaderNote,
  ReaderBookmark,
} from "@/shared/core/events/types";
import { ReaderPreferencesDto } from "../application/dto/ReaderPageDto";

//  STRICT ARCHITECTURAL RULE:
// This store ONLY holds presentation and session state.
// Persistence is owned entirely by the Backend Commands.

export type SessionState =
  "idle" | "opening" | "active" | "paused" | "completed";

/**
 * Ephemeral viewport geometry for floating selection toolbar positioning.
 * Derived from Range.getBoundingClientRect() at selection time.
 * Becomes stale on scroll, zoom, iframe reflow, or viewport change --
 * consumers must treat this as transient presentation data, never persisted.
 */
export interface SelectionRect {
  readonly top: number;
  readonly left: number;
  readonly width: number;
  readonly height: number;
  readonly bottom: number;
  readonly right: number;
}

export interface ActiveSelection {
  anchor: SelectionAnchor;
  text: string;
  /** Ephemeral viewport-relative geometry. Stale after scroll/zoom/resize. */
  rect?: SelectionRect;
}

export interface ActiveNoteEditor {
  target: AnnotationTarget;
  existingNoteId?: string;
  initialBody?: string;
  quoteText?: string;
  color?: string;
}

export interface TocItem {
  id: string;
  title: string;
  pageNumber: number;
  items?: TocItem[];
}

interface ReaderSessionState {
  currentBookId: string | null;
  currentAnchor: LocationAnchor | null;
  isReading: boolean;
  sessionState: SessionState;
  rendererReady: boolean;
  loading: boolean;

  // Highlight selection popup
  activeSelection: ActiveSelection | null;

  // Highlight context menu (on click)
  clickedHighlightId: string | null;

  // Note editor
  activeNote: ActiveNoteEditor | null;

  // Loaded notes for the current book
  notes: ReaderNote[];
  bookmarks: ReaderBookmark[];

  // Real document Table of Contents outline
  tableOfContents: TocItem[];

  // Sidebar state
  sidebarOpen: boolean;
  sidebarTab: "annotations" | "bookmarks" | "toc" | "search";

  // Side Rail (Pages & Thumbnails) state
  sideRailOpen: boolean;
  totalPages: number;

  // Preferences
  preferences: ReaderPreferencesDto;

  // Actions
  setBook: (id: string) => void;
  setAnchor: (anchor: LocationAnchor) => void;
  setSessionState: (state: SessionState) => void;
  setRendererReady: (ready: boolean) => void;
  setLoading: (loading: boolean) => void;
  setActiveSelection: (selection: ActiveSelection | null) => void;
  setClickedHighlightId: (id: string | null) => void;
  setActiveNote: (note: ActiveNoteEditor | null) => void;
  setNotes: (notes: ReaderNote[]) => void;
  setBookmarks: (bookmarks: ReaderBookmark[]) => void;
  setTableOfContents: (toc: TocItem[]) => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarTab: (tab: "annotations" | "bookmarks" | "toc" | "search") => void;
  setSideRailOpen: (open: boolean) => void;
  setTotalPages: (total: number) => void;
  setPreferences: (prefs: ReaderPreferencesDto) => void;
  updatePreference: <K extends keyof ReaderPreferencesDto>(
    key: K,
    value: ReaderPreferencesDto[K],
  ) => void;
}

export const useReaderStore = create<ReaderSessionState>((set) => ({
  currentBookId: null,
  currentAnchor: null,
  isReading: false,
  sessionState: "idle",
  rendererReady: false,
  loading: false,
  activeSelection: null,
  clickedHighlightId: null,
  activeNote: null,
  notes: [],
  bookmarks: [],
  tableOfContents: [],
  sidebarOpen: false,
  sidebarTab: "annotations",
  sideRailOpen: true,
  totalPages: 1,
  preferences: {
    theme: "light",
    fontFamily: "Inter",
    fontSize: 16,
    lineHeight: 1.5,
    margin: 20,
    zoom: 100,
    scrollMode: "vertical",
    pageMode: "single",
  },

  setBook: (id) => set({ currentBookId: id }),
  setAnchor: (anchor) => set({ currentAnchor: anchor }),
  setSessionState: (state) =>
    set({ sessionState: state, isReading: state === "active" }),
  setRendererReady: (ready) => set({ rendererReady: ready }),
  setLoading: (loading) => set({ loading }),
  setActiveSelection: (selection) => set({ activeSelection: selection }),
  setClickedHighlightId: (id) => set({ clickedHighlightId: id }),
  setActiveNote: (note) => set({ activeNote: note }),
  setNotes: (notes) => set({ notes }),
  setBookmarks: (bookmarks) => set({ bookmarks }),
  setTableOfContents: (toc) => set({ tableOfContents: toc }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSidebarTab: (tab) => set({ sidebarTab: tab }),
  setSideRailOpen: (open) => set({ sideRailOpen: open }),
  setTotalPages: (total) => set({ totalPages: Math.max(1, total) }),
  setPreferences: (prefs) => set({ preferences: prefs }),
  updatePreference: (key, value) =>
    set((state) => ({
      preferences: { ...state.preferences, [key]: value },
    })),
}));
