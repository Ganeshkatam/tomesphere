import {
  LocationAnchor,
  SelectionAnchor,
  ReaderHighlight,
} from "@/shared/core/events/types";
import { ReaderPreferencesDto } from "../dto/ReaderPageDto";
import { SelectionRect } from "../../state/reader-store";

export interface ReaderRenderer {
  initialize(bookUrl: string, container: HTMLElement): Promise<void>;
  destroy(): Promise<void>;

  display(): Promise<void>;
  goTo(anchor: LocationAnchor | string): Promise<void>;
  next(): Promise<void>;
  previous(): Promise<void>;

  getProgress(): Promise<{ percentage: number; anchor: LocationAnchor }>;

  highlight(highlight: ReaderHighlight): Promise<void>;
  removeHighlight(id: string): Promise<void>;

  bookmark(anchor: LocationAnchor): Promise<void>;
  annotation(id: string, action: "show" | "hide"): Promise<void>;

  search(query: string): Promise<any[]>;

  theme(themeName: "light" | "dark" | "sepia"): void;
  preferences(prefs: ReaderPreferencesDto): void;
  renderThumbnail?(pageNumber: number, canvas: HTMLCanvasElement): Promise<void>;

  // Event subscribers
  onLocationChanged(
    callback: (anchor: LocationAnchor, percentage: number) => void,
  ): () => void;
  onTextSelected(
    callback: (anchor: SelectionAnchor, text: string, rect?: SelectionRect) => void,
  ): () => void;
  onHighlightClicked(callback: (id: string) => void): () => void;
}
