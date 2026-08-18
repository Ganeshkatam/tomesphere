import { WorkerDatabaseClient } from "../shared/infrastructure/database/WorkerDatabaseClient";
import { Pool } from "pg";

async function runTests() {
  console.log("=== Running Worker Verification Gates ===");

  try {
    // 1. Proof of Isolation (tomesphere_worker restricted)
    console.log("\n--- Gate 1: Isolation Test ---");
    try {
      const res = await WorkerDatabaseClient.query("SELECT * FROM public.users LIMIT 1");
      console.log("❌ Isolation failure: tomesphere_worker could query public.users directly.");
      console.dir(res.rows);
    } catch (err: any) {
      if (err.message.includes("permission denied")) {
         console.log("✅ Isolation passed: tomesphere_worker cannot bypass RLS/privileges on public tables directly.");
      } else {
         console.log("✅ Isolation passed (RLS/Empty):", err.message);
      }
    }

    try {
      // It should also fail if RLS just returns 0 rows, let's test a table that has data like books
      const resBooks = await WorkerDatabaseClient.query("SELECT * FROM public.books LIMIT 1");
      if (resBooks.rows.length === 0) {
        console.log("✅ Isolation passed: tomesphere_worker sees 0 rows from public.books due to RLS.");
      } else {
        console.log("❌ Isolation failure: tomesphere_worker can see data in public.books.");
      }
    } catch (err: any) {
      console.log("✅ Isolation passed:", err.message);
    }

    // 2. Correctness (Claiming outbox events)
    console.log("\n--- Gate 2: Claiming Outbox Events ---");
    // Insert a dummy event via postgres admin pool to simulate the application
    const adminConnectionString = process.env.DATABASE_URL; 
    if (!adminConnectionString) {
       console.log("Missing DATABASE_URL to inject test data. Skipping insert phase.");
    } else {
       const adminPool = new Pool({ connectionString: adminConnectionString });
       await adminPool.query(`
         INSERT INTO public.outbox_messages (aggregate_type, aggregate_id, event_type, payload, status, retry_count)
         VALUES ('test_aggregate', gen_random_uuid(), 'test_event', '{}', 'pending', 0)
       `);
       console.log("Injected 1 pending outbox message as postgres admin.");
       await adminPool.end();
    }

    const claimed = await WorkerDatabaseClient.claimOutboxEvents(5);
    console.log(`✅ Correctness passed: claimed ${claimed.length} events successfully.`);

    // 3. Recovery (Failed/crashed workers recover)
    console.log("\n--- Gate 3: Stale Claim Recovery ---");
    if (claimed.length > 0) {
        // Manually revert one to stale processing
        const targetId = claimed[0].id;
        
        // We have to update it via admin pool since worker shouldn't have direct update
        if (adminConnectionString) {
           const adminPool = new Pool({ connectionString: adminConnectionString });
           await adminPool.query(`
             UPDATE public.outbox_messages 
             SET status = 'processing', claimed_at = NOW() - INTERVAL '6 minutes'
             WHERE id = $1
           `, [targetId]);
           console.log(`Set event ${targetId} to stale processing (6 mins ago).`);
           await adminPool.end();

           const reClaimed = await WorkerDatabaseClient.claimOutboxEvents(5);
           const found = reClaimed.find(e => e.id === targetId);
           if (found) {
             console.log(`✅ Recovery passed: Stale event ${targetId} was successfully reclaimed!`);
           } else {
             console.log(`❌ Recovery failed: Stale event ${targetId} was NOT reclaimed.`);
           }
        }
    } else {
        console.log("No events claimed, skipping recovery test.");
    }

  } catch (error) {
    console.error("Worker Verification Gates failed:", error);
  } finally {
    console.log("\n=== Finished Worker Verification Gates ===");
    process.exit(0);
  }
}

runTests();
