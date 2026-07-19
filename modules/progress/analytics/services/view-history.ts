import { BookDto } from "@/modules/library/application/dto/response/BookDto";

const MAX_HISTORY = parseInt(process.env.NEXT_PUBLIC_MAX_HISTORY || "20", 10);
const STORAGE_KEY = process.env.NEXT_PUBLIC_RECENT_VIEWS_KEY || "tomesphere_recent_views";

export interface ViewHistoryItem {
  book: BookDto;
  viewedAt: number;
}

export function addToViewHistory(book: BookDto): void {
  if (typeof window === "undefined") return;

  const history = getViewHistory();

  // Remove if already exists
  const filtered = history.filter((item) => item.book.id !== book.id);

  // Add to front
  const updated = [{ book, viewedAt: Date.now() }, ...filtered].slice(
    0,
    MAX_HISTORY,
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getViewHistory(): ViewHistoryItem[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function clearViewHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
