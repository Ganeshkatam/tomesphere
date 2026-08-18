import { BookSummaryMapper } from "./BookSummaryMapper";

describe("BookSummaryMapper", () => {
  it("should strip out unexpected fields and only return the bounded DTO", () => {
    const rawDatabaseRow = {
      id: "book-1",
      slug: "test-book",
      title: "Test Book",
      cover_url: "http://example.com/cover.jpg",
      languages: { name: "English" },
      release_date: "2024-01-01",
      // These fields should be completely stripped
      biography: "Some bio",
      created_at: "2024-01-01T00:00:00Z",
      pdf_url: "http://example.com/file.pdf",
      internal_score: 99.9,
      book_authors: [
        {
          position: 1,
          authors: {
            id: "author-2",
            slug: "author-two",
            name: "Author Two",
            bio: "Leaked bio 2",
            created_at: "2024-01-01",
          },
        },
        {
          position: 0,
          authors: {
            id: "author-1",
            slug: "author-one",
            name: "Author One",
            bio: "Leaked bio 1",
            created_at: "2024-01-01",
          },
        },
      ],
      book_genres: [
        {
          genres: { id: "g1", name: "Science Fiction", internal_notes: "leak" },
        },
      ],
    };

    const result = BookSummaryMapper.toDto(rawDatabaseRow);

    expect(result).toEqual({
      id: "book-1",
      slug: "test-book",
      title: "Test Book",
      coverUrl: "http://example.com/cover.jpg",
      language: "English",
      publicationYear: 2024,
      authors: [
        { id: "author-1", slug: "author-one", name: "Author One" },
        { id: "author-2", slug: "author-two", name: "Author Two" },
      ],
      genres: [
        { id: "g1", name: "Science Fiction" },
      ],
    });

    // Explicitly verify stripped properties don't exist
    expect((result as any).pdf_url).toBeUndefined();
    expect((result as any).created_at).toBeUndefined();
    expect((result as any).biography).toBeUndefined();
    expect((result.authors[0] as any).bio).toBeUndefined();
  });
});
