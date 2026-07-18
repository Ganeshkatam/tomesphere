'use server';

import { createSupabaseServerClient } from '@/modules/shared/core/database/server';
import { LocationAnchor } from '@/modules/shared/core/events/types';
import { emitOutboxEvent } from '@/modules/shared/core/infrastructure/outbox/outbox';

interface UpdateReaderPositionRequest {
    userId: string;
    bookId: string;
    locationAnchor: LocationAnchor;
}

/**
 * Updates the user's latest reading position and emits a domain event.
 * Uses last-write-wins semantics.
 */
export async function executeUpdateReaderPosition(request: UpdateReaderPositionRequest): Promise<void> {
    const supabase = await createSupabaseServerClient();
    const now = new Date().toISOString();

    // 1. Upsert the position (last write wins)
    const { error: upsertError } = await supabase
        .from('reader_positions')
        .upsert({
            user_id: request.userId,
            book_id: request.bookId,
            location_anchor: request.locationAnchor as any, // jsonb
            last_read_at: now
        }, {
            onConflict: 'user_id,book_id'
        });

    if (upsertError) {
        console.error('Failed to update reader position:', upsertError);
        throw new Error('Failed to update reading position');
    }

    // 2. Emit position_updated event
    await emitOutboxEvent(supabase, 'reader:position_updated', {
        userId: request.userId,
        bookId: request.bookId,
        locationAnchor: request.locationAnchor,
        occurredAt: now
    });
}
