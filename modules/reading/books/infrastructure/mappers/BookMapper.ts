import { Book } from '../../domain/entities/Book';
import { BookId } from '../../domain/value-objects';
import type { BookRow } from '../models/BookRow';

export class BookMapper {
    static toDomain(raw: BookRow): Book {
        return Book.create({
            id: BookId.create(raw.id),
            title: raw.title,
            author: raw.author || 'Unknown Author',
            coverUrl: raw.cover_url,
            description: raw.description,
            genre: raw.genre,
            publishedDate: raw.release_date,
            pageCount: raw.pages,
            isTextbook: raw.is_textbook || false,
            academicSubject: raw.academic_subject,
            createdAt: raw.created_at ? new Date(raw.created_at) : new Date(),
            updatedAt: (raw.updated_at || raw.created_at) ? new Date((raw.updated_at || raw.created_at)!) : new Date(),
        });
    }

    static toPersistence(domain: Book): Partial<BookRow> {
        return {
            id: domain.bookId.value,
            title: domain.title,
            author: domain.author,
            cover_url: domain.coverUrl ?? undefined,
            description: domain.description ?? undefined,
            genre: domain.genre ?? undefined,
            is_textbook: domain.isTextbook,
            academic_subject: domain.academicSubject ?? undefined,
            release_date: domain.publishedDate ?? undefined,
            pages: domain.pageCount ?? undefined,
        };
    }
}
