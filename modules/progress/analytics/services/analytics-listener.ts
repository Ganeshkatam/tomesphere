import { eventBus } from '@/modules/shared/core/events/EventBus';
import { recordReadingActivity } from './streak-tracker';

/**
 * 🚨 ANALYTICS EVENT LISTENER
 * 
 * Subscribes to cross-domain events to process analytics asynchronously.
 * This completely isolates the Reader from Analytics.
 */

export function initializeAnalyticsListeners() {
    console.log('Initializing Analytics Event Listeners...');

    eventBus.subscribe('reader:page_completed', async (payload) => {
        console.log(`[Analytics] Detected page completion for user ${payload.userId}`);
        
        // When a page is completed, we trigger the streak update logic.
        // The reader UI doesn't have to await this, it happens totally out of band.
        try {
            await recordReadingActivity(payload.userId);
            console.log(`[Analytics] Successfully updated streak for user ${payload.userId}`);
        } catch (error) {
            console.error(`[Analytics] Failed to update streak:`, error);
        }
    });

    eventBus.subscribe('reader:session_ended', async (payload) => {
        console.log(`[Analytics] Session ended. Time spent: ${payload.durationSeconds}s`);
        // We could write to the view_history table here
    });
}
