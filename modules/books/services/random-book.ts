import { BookDto } from "@/modules/library/application/dto/response/BookDto";

export function getRandomBook(
  books: BookDto[],
  selectedGenres: string[] = [],
): BookDto | null {
  if (books.length === 0) return null;

  let filteredBooks = books;

  // Filter by genres if specified
  if (selectedGenres.length > 0) {
    filteredBooks = books.filter(
      (book) =>
        book.genres?.some((g) => selectedGenres.includes(g.name)) ?? false,
    );
  }

  if (filteredBooks.length === 0) return null;

  // Get random index
  const randomIndex = Math.floor(Math.random() * filteredBooks.length);
  return filteredBooks[randomIndex];
}

export function getRandomBooks(
  books: BookDto[],
  count: number,
  selectedGenres: string[] = [],
): BookDto[] {
  if (books.length === 0) return [];

  let filteredBooks = books;

  if (selectedGenres.length > 0) {
    filteredBooks = books.filter(
      (book) =>
        book.genres?.some((g) => selectedGenres.includes(g.name)) ?? false,
    );
  }

  // Shuffle array
  const shuffled = [...filteredBooks].sort(() => Math.random() - 0.5);

  // Return requested count
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
