import { Book } from '@/modules/shared/core/database/client';

/** Row shape from the `citations` table */
export interface Citation {
    id: string;
    user_id: string;
    title: string;
    format: CitationFormat;
    book_ids: string[];
    books: Book[];
    created_at: string;
    updated_at: string;
}

/** Supported citation format styles */
export type CitationFormat = 'apa' | 'mla' | 'chicago' | 'harvard';

/** Input for creating a new citation (omit server-generated fields) */
export interface SaveCitationInput {
    title: string;
    format: CitationFormat;
    books: Book[];
}

/** Result wrapper for server actions — canonical location is shared kernel */
export type { ActionResult } from '@/modules/shared/core/types/ActionResult';
