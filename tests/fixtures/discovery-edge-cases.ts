import { BookSummaryDto } from "../../modules/discovery/application/dto/BookSummaryDto";
import { AuthorCardDto } from "../../modules/discovery/application/dto/AuthorCardDto";
import { CollectionSummaryDto } from "../../modules/discovery/application/dto/CollectionSummaryDto";

export const tortureBooks: BookSummaryDto[] = [
  {
    id: "torture-1",
    slug: "torture-1",
    title: "The Book With No Cover",
    authors: [{ id: "a1", name: "Author One", slug: "author-one" }],
    genres: [],
    coverUrl: null, // Book A -> coverUrl null
    language: "English",
    publicationYear: 2024,
  },
  {
    id: "torture-2",
    slug: "torture-2",
    title: "A Very Long Normal Title That Might Wrap Over Multiple Lines Depending On The Viewport Size And Container Width Used In The Layout",
    authors: [{ id: "a2", name: "Author Two", slug: "author-two" }],
    genres: [],
    coverUrl: "https://picsum.photos/200/300?random=1",
    language: "English",
    publicationYear: 2024,
  },
  {
    id: "torture-3",
    slug: "torture-3",
    title: "PathologicalTitleWithoutSpacesThatMightOverflowTheContainerIfWordBreakIsNotSetCorrectlyInTheCSS",
    authors: [{ id: "a3", name: "Author Three", slug: "author-three" }],
    genres: [],
    coverUrl: "https://picsum.photos/200/300?random=2",
    language: "English",
    publicationYear: 2024,
  },
  {
    id: "torture-4",
    slug: "torture-4",
    title: "The Collaboration",
    authors: [
      { id: "a4", name: "Primary Author", slug: "primary-author" },
      { id: "a5", name: "Secondary Author", slug: "secondary-author" },
      { id: "a6", name: "Tertiary Author", slug: "tertiary-author" },
      { id: "a7", name: "Quaternary Author", slug: "quaternary-author" }
    ],
    genres: [],
    coverUrl: "https://picsum.photos/200/300?random=3",
    language: "English",
    publicationYear: 2024,
  },
  {
    id: "torture-5",
    slug: "torture-5",
    title: "Timeless Knowledge",
    authors: [{ id: "a8", name: "Ancient Author", slug: "ancient-author" }],
    genres: [],
    coverUrl: "https://picsum.photos/200/300?random=4",
    language: "English",
    publicationYear: null, // Book E -> publicationYear null
  },
  {
    id: "torture-6",
    slug: "torture-6",
    title: "The Book by the Person with an Extremely Long Name",
    authors: [{ id: "a9", name: "Dr. Hubert Blaine Wolfeschlegelsteinhausenbergerdorff Sr.", slug: "hubert" }],
    genres: [],
    coverUrl: "https://picsum.photos/200/300?random=5",
    language: "English",
    publicationYear: 2024,
  }
];

export const tortureAuthors: AuthorCardDto[] = [
  {
    id: "author-torture-1",
    slug: "author-torture-1",
    name: "Author Without Portrait",
    imageUrl: null, // Author A -> imageUrl null
    bookCount: 5,
  },
  {
    id: "author-torture-2",
    slug: "author-torture-2",
    name: "Dr. Hubert Blaine Wolfeschlegelsteinhausenbergerdorff Sr. - The Sequel", // Author B -> very long name
    imageUrl: "https://picsum.photos/200/200?random=6",
    bookCount: 1,
  }
];

export const tortureCollections: CollectionSummaryDto[] = [
  {
    id: "collection-torture-1",
    slug: "collection-torture-1",
    title: "An Unbelievably Long Collection Title That Should Probably Be Truncated Or Let Wrap Naturally", // Collection -> long title
    description: "This is a description that goes on for quite a while to see how the collection card handles excessive text content which could potentially break the flex layout if not constrained.",
    bookCount: 42,
  }
];

export const tortureSubjects: string[] = [
  "Normal Subject",
  "SupercalifragilisticexpialidociousSubjectWithoutSpaces", // Subject -> long label
  "A Very Long Subject Name That Might Wrap Or Break"
];
