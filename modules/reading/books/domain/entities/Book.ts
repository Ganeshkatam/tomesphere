import { Entity } from "@/modules/core/domain/Entity";
import { BookId } from "../value-objects";

export interface BookProps {
  id: BookId;
  title: string;
  authors: string[];
  coverUrl?: string | null;
  description?: string | null;
  genres?: string[];
  publishedDate?: string | null;
  pageCount?: number | null;
  isTextbook: boolean;
  subjects?: string[];
  pdfUrl?: string | null;
  epubUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Book extends Entity<BookProps> {
  private constructor(props: BookProps) {
    super(props.id.value, props);
  }

  static create(props: BookProps): Book {
    return new Book(props);
  }

  get bookId(): BookId {
    return this.props.id;
  }
  get title(): string {
    return this.props.title;
  }
  get authors(): string[] {
    return this.props.authors || [];
  }
  get coverUrl(): string | null {
    return this.props.coverUrl || null;
  }
  get description(): string | null {
    return this.props.description || null;
  }
  get genres(): string[] {
    return this.props.genres || [];
  }
  get isTextbook(): boolean {
    return this.props.isTextbook;
  }
  get subjects(): string[] {
    return this.props.subjects || [];
  }
  get publishedDate(): string | null {
    return this.props.publishedDate || null;
  }
  get pageCount(): number | null {
    return this.props.pageCount || null;
  }
  get pdfUrl(): string | null {
    return this.props.pdfUrl || null;
  }
  get epubUrl(): string | null {
    return this.props.epubUrl || null;
  }

  isPublicDomain(): boolean {
    if (!this.props.publishedDate) return false;
    const pubYear = new Date(this.props.publishedDate).getFullYear();
    return pubYear < 1928;
  }

  matchesTitleOrAuthor(query: string): boolean {
    const searchTerm = query.toLowerCase();
    return (
      this.title.toLowerCase().includes(searchTerm) ||
      this.authors.some(a => a.toLowerCase().includes(searchTerm))
    );
  }

  toJSON(): BookProps {
    return { ...this.props };
  }
}
