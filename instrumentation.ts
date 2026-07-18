/**
 * 🚨 NEXT.JS INSTRUMENTATION
 * 
 * This file runs exactly once when the Next.js server boots up.
 * It is the correct, architecturally sound place to initialize 
 * server-side singletons like our Event Bus listeners or APM agents.
 */

export async function register() {
    // Only boot the listeners on the server side
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const { initializeAnalyticsListeners } = await import('@/modules/progress/analytics/services/analytics-listener');
        
        console.log('🚀 [Platform] Booting Subsystem Event Listeners...');
        initializeAnalyticsListeners();
        
        // Future listeners go here:
        // initializeNotificationListeners();
        // initializeRecommendationEngineListeners();
    }
}
