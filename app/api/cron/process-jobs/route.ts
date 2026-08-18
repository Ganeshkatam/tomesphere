import { NextResponse } from 'next/server';
import { WorkerDatabaseClient } from '@/shared/infrastructure/database/WorkerDatabaseClient';

// Vercel Cron or Supabase Scheduled Function Endpoint
export const maxDuration = 300; // 5 minutes max

export async function POST(request: Request) {
  // 1. Verify Authorization (e.g. CRON_SECRET)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Fetch and process pending jobs via WorkerDatabaseClient (direct Postgres)
  try {
    const res = await WorkerDatabaseClient.query<{ id: string; job_type: string }>(
      `UPDATE public.job_queue
       SET status = 'processing', started_at = NOW()
       WHERE id IN (
         SELECT id FROM public.job_queue
         WHERE status = 'pending'
           AND scheduled_at <= NOW()
         ORDER BY created_at ASC
         FOR UPDATE SKIP LOCKED
         LIMIT 10
       )
       RETURNING id, job_type;`
    );

    const processedJobs = res.rows;

    return NextResponse.json({
      success: true,
      processedCount: processedJobs.length,
      jobs: processedJobs,
    });
  } catch (error: any) {
    console.error('[process-jobs] Job processing failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
