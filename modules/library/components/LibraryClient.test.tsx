import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import LibraryClient from "./LibraryClient";
import { LibraryPageDto } from "../application/dto/response/LibraryPageDto";
import { getLibraryPageAction } from "../presentation/actions/library";

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, fill, ...props }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

const mockSetLoadingView = jest.fn();

let mockStoreState = {
  activeViewId: "overview",
  viewMode: "grid",
  searchQuery: "",
  sortBy: "date_added",
  sortDirection: "desc" as const,
  setLoadingView: mockSetLoadingView,
};

jest.mock("../store/library-store", () => ({
  useLibraryStore: () => mockStoreState,
}));

jest.mock("../presentation/actions/library", () => ({
  getLibraryPageAction: jest.fn(),
}));

jest.mock("./LibraryOverview", () => {
  return function MockOverview({ summary }: any) {
    return <div data-testid="library-overview">Overview: {summary.totalBooks}</div>;
  };
});

jest.mock("./LibraryToolbar", () => {
  return function MockToolbar() {
    return <div data-testid="library-toolbar" />;
  };
});

jest.mock("./LibraryGrid", () => {
  return function MockGrid({ books }: any) {
    return (
      <div data-testid="library-grid">
        {books.map((b: any) => (
          <div key={b.bookId}>{b.title}</div>
        ))}
      </div>
    );
  };
});

jest.mock("./LibraryList", () => {
  return function MockList({ books }: any) {
    return (
      <div data-testid="library-list">
        {books.map((b: any) => (
          <div key={b.bookId}>{b.title}</div>
        ))}
      </div>
    );
  };
});

describe("LibraryClient behavioral tests", () => {
  const initialData: LibraryPageDto = {
    summary: {
      totalBooks: 1,
      currentlyReading: 1,
      finished: 0,
      totalCollections: 0,
      wantToRead: 0,
      pagesRead: 50,
      hoursRead: 2,
      lastOpened: null,
    },
    navigation: {
      views: [],
      collections: [],
      smartFilters: [],
    },
    filters: {
      formats: [],
      authors: [],
      genres: [],
    },
    books: {
      items: [
        {
          bookId: "b-1",
          title: "The Odyssey",
          authors: [{ id: "a1", name: "Homer" }],
          coverUrl: null,
          progress: 25,
          status: "reading",
          collections: [],
          dateAdded: "2026-01-01",
          lastOpened: "2026-01-02",
          favorite: true,
        },
      ],
      totalItems: 1,
      page: 1,
      pageSize: 24,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockStoreState = {
      activeViewId: "overview",
      viewMode: "grid",
      searchQuery: "",
      sortBy: "date_added",
      sortDirection: "desc",
      setLoadingView: mockSetLoadingView,
    };
  });

  it("renders overview, toolbar, and initial book items", () => {
    render(<LibraryClient initialData={initialData} />);

    expect(screen.getByTestId("library-overview")).toBeInTheDocument();
    expect(screen.getByTestId("library-toolbar")).toBeInTheDocument();
    expect(screen.getByText("The Odyssey")).toBeInTheDocument();
  });

  it("handles fetch failure, renders error UI with Retry, and restores library view on successful retry", async () => {
    // Initial mount renders initialData
    const { rerender } = render(<LibraryClient initialData={initialData} />);
    expect(screen.getByText("The Odyssey")).toBeInTheDocument();

    // Mock failure for the next action call
    (getLibraryPageAction as jest.Mock).mockRejectedValueOnce(
      new Error("Network timeout: failed to fetch books")
    );

    // Change activeViewId in store to trigger fetchPageData
    mockStoreState = {
      ...mockStoreState,
      activeViewId: "status:reading",
    };

    await act(async () => {
      rerender(<LibraryClient initialData={initialData} />);
    });

    // 1. Error presentation appears
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Unable to Load Library" })
      ).toBeInTheDocument();
      expect(
        screen.getByText("Network timeout: failed to fetch books")
      ).toBeInTheDocument();
    });

    // 2. Retry button is accessible
    const retryBtn = screen.getByRole("button", {
      name: "Retry loading library",
    });
    expect(retryBtn).toBeInTheDocument();

    // 3. Mock success for retry
    const fetchedData: LibraryPageDto = {
      ...initialData,
      books: {
        ...initialData.books,
        items: [
          {
            bookId: "b-2",
            title: "Iliad",
            authors: [{ id: "a1", name: "Homer" }],
            coverUrl: null,
            progress: 10,
            status: "reading",
            collections: [],
            dateAdded: "2026-01-01",
            lastOpened: "2026-01-02",
            favorite: false,
          },
        ],
      },
    };
    (getLibraryPageAction as jest.Mock).mockResolvedValueOnce(fetchedData);

    // 4. Click Retry
    fireEvent.click(retryBtn);

    // 5. Successful retry restores library view and clears error
    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: "Unable to Load Library" })
      ).not.toBeInTheDocument();
      expect(screen.getByText("Iliad")).toBeInTheDocument();
    });

    expect(getLibraryPageAction).toHaveBeenCalledTimes(2);
  });

  it("renders empty state card with Explore Books link when book items are empty", () => {
    const emptyData: LibraryPageDto = {
      summary: {
        totalBooks: 0,
        currentlyReading: 0,
        finished: 0,
        totalCollections: 0,
        wantToRead: 0,
        pagesRead: 0,
        hoursRead: 0,
        lastOpened: null,
      },
      navigation: {
        views: [],
        collections: [],
        smartFilters: [],
      },
      filters: {
        formats: [],
        authors: [],
        genres: [],
      },
      books: {
        items: [],
        totalItems: 0,
        page: 1,
        pageSize: 24,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false,
      },
    };

    render(<LibraryClient initialData={emptyData} />);

    expect(screen.getByRole("heading", { name: "No books found" })).toBeInTheDocument();
    const exploreLink = screen.getByRole("link", { name: "Explore Books" });
    expect(exploreLink).toHaveAttribute("href", "/discover");
  });
});
