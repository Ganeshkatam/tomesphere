import { NextResponse } from 'next/server';
import { processOutbox } from '@/modules/shared/core/jobs/outbox-relay';
import { eventBus } from '@/modules/shared/core/events/EventBus';
import { AnalyticsModule } from '@/modules/analytics/AnalyticsModule';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        if (process.env.NODE_ENV === 'production') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    // Register handlers before processing
    await AnalyticsModule.registerEventHandlers(eventBus);

    const result = await processOutbox(eventBus);

    return NextResponse.json(result);
}
