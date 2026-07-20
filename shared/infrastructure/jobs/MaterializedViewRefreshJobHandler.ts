import { JobHandler } from "./JobHandler";
import { Job } from "./types";
import { SupabaseClient } from "@supabase/supabase-js";

export interface MVRefreshPayload {
  rpcName: string;
}

export class MaterializedViewRefreshJobHandler implements JobHandler<MVRefreshPayload> {
  constructor(private readonly supabase: SupabaseClient) {}

  async handle(job: Job<MVRefreshPayload>): Promise<void> {
    const { rpcName } = job.payload;

    if (!rpcName) {
      throw new Error("MVRefreshPayload missing rpcName");
    }

    // Attempt to invoke the RPC
    const { error } = await this.supabase.rpc(rpcName);

    if (error) {
      throw new Error(`Failed to refresh Materialized View using RPC '${rpcName}': ${error.message}`);
    }

    console.log(`[Job ${job.id}] Successfully refreshed MV via ${rpcName}`);
  }
}
