import { createClient } from "@supabase/supabase-js";
import { Pool } from "pg";
import * as crypto from "crypto";
import * as fs from "fs";

// Load .env.local manually for tsx
try {
  const envLocal = fs.readFileSync(".env.local", "utf8");
  envLocal.split(/\r?\n/).forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) process.env[match[1]] = match[2].trim();
  });
} catch (e) {
  // Ignore if not present
}

async function runPoC() {
  console.log("=== Running Storage Ticket PoC (Real Credentials) ===");
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const databaseUrl = process.env.TOMESPHERE_WORKER_DATABASE_URL;
  const testEmail = process.env.TEST_USER_EMAIL;
  const testPassword = process.env.TEST_USER_PASSWORD;

  if (!supabaseUrl || !anonKey || !databaseUrl) {
    console.error("Missing core env vars.");
    process.exit(1);
  }

  if (!testEmail || !testPassword) {
    console.error("Missing TEST_USER_EMAIL or TEST_USER_PASSWORD in environment.");
    process.exit(1);
  }

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  const adminPool = new Pool({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });
  const supabase = createClient(supabaseUrl, anonKey);
  
  let testPath = "";
  let userId = "";

  try {
    console.log(`Authenticating real user: ${testEmail}...`);
    const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });
    
    if (authErr) throw authErr;
    userId = authData.user?.id || "";
    console.log(`Authenticated test user successfully. ID: ${userId}`);

    // Create test object
    testPath = `poc-${crypto.randomUUID()}.txt`;
    const { error: upErr } = await supabase.storage.from('test-tickets').upload(testPath, "Test Content");
    if (upErr) throw upErr;
    console.log(`Uploaded temporary test object: ${testPath}`);

    // ==============================================================
    console.log("\n--- EXPERIMENT A: Authenticated user + no ticket ---");
    const { data: urlA, error: errA } = await supabase.storage.from('test-tickets').createSignedUrl(testPath, 5);
    if (errA) {
      console.log("✅ DENIED: createSignedUrl without ticket failed as expected:", errA.message);
    } else {
      console.log("❌ FAILED: createSignedUrl succeeded without a ticket!");
    }

    // ==============================================================
    console.log("\n--- EXPERIMENT B: Authenticated user + active ticket ---");
    const ticketRes = await adminPool.query(`
      INSERT INTO internal.storage_tickets (bucket_id, storage_path, user_id, operation, expires_at)
      VALUES ('test-tickets', $1, $2, 'select', now() + interval '10 seconds')
      RETURNING ticket_id
    `, [testPath, userId]);
    const ticketId = ticketRes.rows[0].ticket_id;
    console.log(`Inserted ticket: ${ticketId}`);

    let signedUrlToTest = "";
    const { data: urlB, error: errB } = await supabase.storage.from('test-tickets').createSignedUrl(testPath, 5);
    if (urlB) {
      console.log("✅ SUCCESS: createSignedUrl succeeded with active ticket.");
      signedUrlToTest = urlB.signedUrl;
    } else {
      console.log("❌ FAILED: createSignedUrl failed with active ticket:", errB?.message);
    }

    // ==============================================================
    console.log("\n--- EXPERIMENT C: Delete ticket immediately -> fetch signed URL ---");
    await adminPool.query(`DELETE FROM internal.storage_tickets WHERE ticket_id = $1`, [ticketId]);
    console.log("Deleted ticket.");
    
    const fetchResC = await fetch(signedUrlToTest);
    if (fetchResC.ok) {
      const text = await fetchResC.text();
      console.log("✅ SUCCESS: Signed URL remained valid after ticket deletion. Content:", text);
    } else {
      console.log("❌ FAILED: Signed URL became invalid after ticket deletion! Status:", fetchResC.status);
    }

    // ==============================================================
    console.log("\n--- EXPERIMENT D: Signed URL expiry ---");
    console.log("Waiting 6 seconds for the signed URL (5s TTL) to expire...");
    await new Promise(r => setTimeout(r, 6000));
    
    const fetchResD = await fetch(signedUrlToTest);
    if (!fetchResD.ok) {
      console.log("✅ SUCCESS: Signed URL expired properly. Status:", fetchResD.status);
    } else {
      console.log("❌ FAILED: Signed URL did not expire!");
    }

    // ==============================================================
    console.log("\n--- EXPERIMENT E: Direct authenticated access after ticket deletion ---");
    const { data: dlData, error: dlErr } = await supabase.storage.from('test-tickets').download(testPath);
    if (dlErr) {
      console.log("✅ SUCCESS: Direct download denied without ticket:", dlErr.message);
    } else {
      console.log("❌ FAILED: Direct download succeeded without ticket!");
    }

  } catch (error) {
    console.error("PoC failed:", error);
  } finally {
    // --------------------------------------------------------
    // CLEANUP
    // --------------------------------------------------------
    console.log("\n--- EXPERIMENT F: Cleanup ---");
    try {
      if (testPath) {
        await supabase.storage.from('test-tickets').remove([testPath]);
        console.log("temporary object: removed");
      }
    } catch (cleanupErr) {
      console.error("Cleanup encountered an error:", cleanupErr);
    }
    await adminPool.end();
    console.log("=== Finished PoC ===");
    process.exit(0);
  }
}

runPoC().catch(console.error);
