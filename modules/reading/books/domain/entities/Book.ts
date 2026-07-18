import { Entity } from '@/modules/core/domain/Entity';
import { BookId } from '../value-objects';

export interface BookProps {
    id: BookId;
    title: string;
    author: string;
    coverUrl?: string | null;
    description?: string | null;
    genre?: string | null;
    publishedDate?: string | null;
    pageCount?: number | null;
    isTextbook: boolean;
    academicSubject?: string | null;
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

    get bookId(): BookId { return this.props.id; }
    get title(): string { return this.props.title; }
    get author(): string { return this.props.author; }
    get coverUrl(): string | null { return this.props.coverUrl || null; }
    get description(): string | null { return this.props.description || null; }
    get genre(): string | null { return this.props.genre || null; }
    get isTextbook(): boolean { return this.props.isTextbook; }
    get academicSubject(): string | null { return this.props.academicSubject || null; }
    get publishedDate(): string | null { return this.props.publishedDate || null; }
    get pageCount(): number | null { return this.props.pageCount || null; }

    isPublicDomain(): boolean {
        if (!this.props.publishedDate) return false;
        const pubYear = new Date(this.props.publishedDate).getFullYear();
        return pubYear < 1928;
    }

    matchesTitleOrAuthor(query: string): boolean {
        const searchTerm = query.toLowerCase();
        return this.title.toLowerCase().includes(searchTerm) || 
               this.author.toLowerCase().includes(searchTerm);
    }

    toJSON(): BookProps {
        return { ...this.props };
    }
}
