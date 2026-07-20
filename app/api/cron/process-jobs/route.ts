import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/shared/core/types/database';
import { SupabaseJobRepository } from '@/shared/infrastructure/jobs/SupabaseJobRepository';
import { JobHandlerRegistry } from '@/shared/infrastructure/jobs/JobHandlerRegistry';
import { JobDispatcher } from '@/shared/infrastructure/jobs/JobDispatcher';
import { ProjectionRebuildJobHandler } from '@/shared/infrastructure/jobs/ProjectionRebuildJobHandler';
import { ProjectionRegistry } from '@/shared/infrastructure/projections/ProjectionRegistry';
import { SearchIndexer } from '@/modules/discovery/search/infrastructure/projections/SearchIndexer';
import { SearchProjectionRepository } from '@/modules/discovery/search/infrastructure/repositories/SearchProjectionRepository';
import { JobType } from '@/shared/infrastructure/jobs/types';
import { MaterializedViewRefreshJobHandler } from '@/shared/infrastructure/jobs/MaterializedViewRefreshJobHandler';

// Vercel Cron or Supabase Scheduled Function Endpoint
export const maxDuration = 300; // 5 minutes max

export async function POST(request: Request) {
  // 1. Verify Authorization (e.g. CRON_SECRET)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Initialize Database Client (Service Role for admin bypass)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient<Database>(supabaseUrl, supabaseKey);

  // 3. Initialize Repositories
  const jobRepository = new SupabaseJobRepository(supabase);
  const searchRepo = new SearchProjectionRepository(supabase);
  
  // 4. Initialize Handlers and Registries
  const searchIndexer = new SearchIndexer(searchRepo, supabase);
  const projectionRegistry = new ProjectionRegistry();
  projectionRegistry.register('discovery_search', searchIndexer);

  const jobRegistry = new JobHandlerRegistry();
  jobRegistry.register(JobType.PROJECTION_REBUILD, new ProjectionRebuildJobHandler(projectionRegistry));
  jobRegistry.register(JobType.MV_REFRESH, new MaterializedViewRefreshJobHandler(supabase));

  // 5. Initialize Dispatcher
  const dispatcher = new JobDispatcher(jobRepository, jobRegistry);

  // 6. Fetch and Process Pending Jobs
  try {
    // We fetch a batch of pending jobs
    const { data: jobs, error } = await supabase
      .from('job_queue')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_at', new Date().toISOString())
      .order('created_at', { ascending: true })
      .limit(10);

    if (error) throw error;

    let processed = 0;
    for (const jobRecord of jobs || []) {
      // Mark as processing
      await jobRepository.updateStatus(jobRecord.id, 'processing');
      
      await dispatcher.dispatch(jobRecord.id, 'cron-worker');
      processed++;
    }

    return NextResponse.json({ success: true, processed });
  } catch (error: any) {
    console.error('Job processing failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
