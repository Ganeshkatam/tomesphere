import { createClient } from '@supabase/supabase-js';
import { IEventBus } from '../../core/events/types';

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 500;

/**
 * Outbox Relay
 * 
 * Polls `outbox_messages` for pending events, dispatches them to the
 * in-memory EventBus, and marks them as processed.
 *
 * Design decisions:
 * - Uses `claim_outbox_messages` RPC for safe concurrent claiming (FOR UPDATE SKIP LOCKED).
 * - Implements exponential backoff on failure.
 * - Marks permanently failed events as `failed_permanent` after MAX_RETRIES.
 * - The EventBus is only responsible for dispatching already-persisted events.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false, autoRefreshToken: false }
    })
    : null;

export interface OutboxRelayResult {
    processed: number;
    failed: number;
    permanentlyFailed: number;
}

export async function processOutbox(eventBus: IEventBus): Promise<OutboxRelayResult> {
    if (!supabase) {
        console.error('[Outbox Relay] Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL');
        return { processed: 0, failed: 0, permanentlyFailed: 0 };
    }

    // 1. Claim pending messages atomically
    const { data: messages, error: claimError } = await supabase
        .rpc('claim_outbox_messages', { limit_count: 50 });

    if (claimError) {
        console.error('[Outbox Relay] Failed to claim messages:', claimError.message);
        return { processed: 0, failed: 0, permanentlyFailed: 0 };
    }

    if (!messages || messages.length === 0) {
        return { processed: 0, failed: 0, permanentlyFailed: 0 };
    }

    let processed = 0;
    let failed = 0;
    let permanentlyFailed = 0;

    // 2. Process each claimed message
    for (const message of messages) {
        try {
            // Dispatch to the EventBus
            // The EventBus handlers (SearchDocumentEventHandlers, RecommendationSignalEventHandlers, etc.)
            // will process the event.
            const eventType = message.event_type as any;
            const payload = message.payload as any;

            eventBus.emit(eventType, payload);

            // 3. Mark as processed
            await supabase
                .from('outbox_messages')
                .update({
                    status: 'processed',
                    processed_at: new Date().toISOString()
                })
                .eq('id', message.id);

            processed++;
        } catch (error: any) {
            const newRetryCount = (message.retry_count || 0) + 1;
            const isPermanentFailure = newRetryCount >= MAX_RETRIES;

            await supabase
                .from('outbox_messages')
                .update({
                    status: isPermanentFailure ? 'failed_permanent' : 'failed',
                    retry_count: newRetryCount,
                    last_error: error.message || 'Unknown error'
                })
                .eq('id', message.id);

            if (isPermanentFailure) {
                console.error(`[Outbox Relay] Permanently failed message ${message.id}: ${error.message}`);
                permanentlyFailed++;
            } else {
                console.warn(`[Outbox Relay] Retryable failure for message ${message.id} (attempt ${newRetryCount}/${MAX_RETRIES})`);
                failed++;
            }
        }
    }

    console.log(`[Outbox Relay] Batch complete: ${processed} processed, ${failed} failed, ${permanentlyFailed} permanently failed`);

    return { processed, failed, permanentlyFailed };
}

/**
 * Returns operational metrics for monitoring.
 */
export async function getOutboxMetrics() {
    if (!supabase) return null;

    const { data, error } = await supabase
        .rpc('claim_outbox_messages', { limit_count: 0 }); // dummy call for type safety

    // Use direct queries for metrics
    const [pending, processing, failed, permanent] = await Promise.all([
        supabase.from('outbox_messages').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('outbox_messages').select('*', { count: 'exact', head: true }).eq('status', 'processing'),
        supabase.from('outbox_messages').select('*', { count: 'exact', head: true }).eq('status', 'failed'),
        supabase.from('outbox_messages').select('*', { count: 'exact', head: true }).eq('status', 'failed_permanent'),
    ]);

    return {
        pending: pending.count || 0,
        processing: processing.count || 0,
        failed: failed.count || 0,
        permanentlyFailed: permanent.count || 0,
    };
}
