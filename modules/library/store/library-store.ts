import { create } from "zustand";
import { LibraryFilterDto } from "../application/dto/response/LibraryPageDto";

export type ViewMode = "grid" | "list";

export interface LibraryState {
  // Navigation
  viewMode: ViewMode;
  activeViewId: string;
  loadingView: boolean;
  expandedSidebarGroups: string[];

  // Selection
  selection: string[]; // Array of bookIds for future bulk actions

  // Filtering & Sorting
  searchQuery: string;
  sortBy:
    | "title"
    | "author"
    | "date_added"
    | "date_opened"
    | "progress"
    | "publication_date";
  sortDirection: "asc" | "desc";
  filters: Partial<LibraryFilterDto>;

  // Actions
  setViewMode: (mode: ViewMode) => void;
  setActiveView: (id: string) => void;
  setLoadingView: (loading: boolean) => void;
  toggleSidebarGroup: (groupId: string) => void;

  toggleSelection: (bookId: string) => void;
  clearSelection: () => void;

  setSearchQuery: (query: string) => void;
  setSort: (
    by: LibraryState["sortBy"],
    dir: LibraryState["sortDirection"],
  ) => void;
  setFilters: (filters: Partial<LibraryFilterDto>) => void;
}

export const useLibraryStore = create<LibraryState>((set) => ({
  viewMode: "grid",
  activeViewId: "overview",
  loadingView: false,
  expandedSidebarGroups: ["collections"],

  selection: [],

  searchQuery: "",
  sortBy: "date_added",
  sortDirection: "desc",
  filters: {},

  setViewMode: (mode) => set({ viewMode: mode }),
  setActiveView: (id) => set({ activeViewId: id, selection: [] }), // Clear selection on view change
  setLoadingView: (loading) => set({ loadingView: loading }),

  toggleSidebarGroup: (groupId) =>
    set((state) => {
      const isExpanded = state.expandedSidebarGroups.includes(groupId);
      return {
        expandedSidebarGroups: isExpanded
          ? state.expandedSidebarGroups.filter((g) => g !== groupId)
          : [...state.expandedSidebarGroups, groupId],
      };
    }),

  toggleSelection: (bookId) =>
    set((state) => {
      const isSelected = state.selection.includes(bookId);
      return {
        selection: isSelected
          ? state.selection.filter((id) => id !== bookId)
          : [...state.selection, bookId],
      };
    }),

  clearSelection: () => set({ selection: [] }),

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSort: (sortBy, sortDirection) => set({ sortBy, sortDirection }),
  setFilters: (filters) => set({ filters }),
}));
