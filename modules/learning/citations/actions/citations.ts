'use server';

import { createSupabaseServerClient } from '@/modules/shared/core/database/server';
import type { Citation, SaveCitationInput, ActionResult } from '../types';
import type { Book } from '@/modules/shared/core/database/client';
import { UUIDSchema, SafeSearchQuery, validateInput } from '@/lib/validators';

// ─── Auth helper ──────────────────────────────────────────────

async function getAuthenticatedUser() {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    return { supabase, user };
}

// ─── Queries ──────────────────────────────────────────────────

/**
 * Fetch all citations for the authenticated user, newest first.
 */
export async function getCitations(): Promise<ActionResult<Citation[]>> {
    const auth = await getAuthenticatedUser();
    if (!auth) {
        return { success: false, error: 'Not authenticated' };
    }

    const { data, error } = await auth.supabase
        .from('citations')
        .select('*')
        .eq('user_id', auth.user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[getCitations]', error.message);
        return { success: false, error: 'Failed to load citations' };
    }

    return { success: true, data: data as Citation[] };
}

/**
 * Search books by title or author. Server-side to avoid
 * exposing raw Supabase queries to the client.
 */
export async function searchBooksAction(
    searchTerm: string
): Promise<ActionResult<Book[]>> {
    const parsed = SafeSearchQuery.safeParse(searchTerm);
    if (!parsed.success || parsed.data.length === 0) {
        return { success: true, data: [] };
    }

    const sanitized = parsed.data;

    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from('books')
        .select('*')
        .or(`title.ilike.%${sanitized}%,author.ilike.%${sanitized}%`)
        .limit(10);

    if (error) {
        console.error('[searchBooksAction]', error.message);
        return { success: false, error: 'Failed to search books' };
    }

    return { success: true, data: (data as Book[]) ?? [] };
}

// ─── Mutations ────────────────────────────────────────────────

/**
 * Save a new bibliography (set of books + format).
 */
export async function saveCitation(
    input: SaveCitationInput
): Promise<ActionResult<Citation>> {
    // Validate input
    const title = input.title?.trim();
    if (!title) {
        return { success: false, error: 'Title is required' };
    }
    if (title.length > 200) {
        return { success: false, error: 'Title must be under 200 characters' };
    }
    if (!input.books || input.books.length === 0) {
        return { success: false, error: 'At least one book is required' };
    }

    const auth = await getAuthenticatedUser();
    if (!auth) {
        return { success: false, error: 'Not authenticated' };
    }

    const bookIds = input.books.map(b => b.id);

    const { data, error } = await auth.supabase
        .from('citations')
        .insert({
            user_id: auth.user.id,
            title,
            format: input.format,
            book_ids: bookIds,
            books: input.books,
        })
        .select()
        .single();

    if (error) {
        console.error('[saveCitation]', error.message);
        return { success: false, error: 'Failed to save citation' };
    }

    return { success: true, data: data as Citation };
}

/**
 * Delete a citation by ID. Only the owner can delete (RLS enforced).
 */
export async function deleteCitation(
    citationId: string
): Promise<ActionResult> {
    const idCheck = validateInput(UUIDSchema, citationId);
    if (!idCheck.success) {
        return { success: false, error: idCheck.error };
    }

    const auth = await getAuthenticatedUser();
    if (!auth) {
        return { success: false, error: 'Not authenticated' };
    }

    const { error } = await auth.supabase
        .from('citations')
        .delete()
        .eq('id', citationId)
        .eq('user_id', auth.user.id); // Belt-and-suspenders with RLS

    if (error) {
        console.error('[deleteCitation]', error.message);
        return { success: false, error: 'Failed to delete citation' };
    }

    return { success: true, data: undefined };
}
