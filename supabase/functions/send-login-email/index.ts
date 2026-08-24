import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

interface WebhookPayload {
  type: string;
  table: string;
  schema: string;
  record: {
    id: string;
    user_id: string;
    created_at: string;
    user_agent?: string;
    ip?: string;
    [key: string]: any;
  };
  old_record: any | null;
}

serve(async (req: Request) => {
  try {
    // 1. Authenticate Webhook Request
    const webhookSecret = Deno.env.get("WEBHOOK_SECRET");
    if (!webhookSecret) {
      console.error("Configuration Error: Missing WEBHOOK_SECRET");
      return new Response("Internal Server Error", { status: 500 });
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response("Unauthorized", { status: 401 });
    }
    
    const token = authHeader.replace("Bearer ", "");
    
    // Validate secret length and value securely
    if (token.length !== webhookSecret.length || token !== webhookSecret) {
      return new Response("Unauthorized", { status: 401 });
    }

    // 2. Validate Payload
    const payload: WebhookPayload = await req.json();
    
    if (payload.type !== "INSERT" || payload.schema !== "auth" || payload.table !== "sessions") {
      console.error("Invalid webhook payload structure");
      return new Response("Bad Request: Invalid payload structure", { status: 400 });
    }

    const session = payload.record;
    if (!session || !session.id || !session.user_id) {
      console.error("Missing required session fields");
      return new Response("Bad Request: Missing session data", { status: 400 });
    }

    // 3. Initialize Privileged Client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables");
      return new Response("Internal Server Error", { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 4. Idempotency Lock Claim
    // Attempt to insert a new tracking row
    const { error: claimError } = await supabase
      .from("login_notifications_log")
      .insert({
        session_id: session.id,
        user_id: session.user_id,
        status: "PROCESSING",
        attempts: 1,
      });

    if (claimError) {
      // 23505 is PostgreSQL's unique_violation error code
      if (claimError.code === "23505") {
        // Row exists. Check if it's FAILED so we can retry.
        const { data: existingLog } = await supabase
          .from("login_notifications_log")
          .select("status, attempts")
          .eq("session_id", session.id)
          .single();

        if (existingLog && existingLog.status === "FAILED") {
          console.log(`Retrying failed notification for session ${session.id}`);
          await supabase
            .from("login_notifications_log")
            .update({ status: "PROCESSING", attempts: existingLog.attempts + 1 })
            .eq("session_id", session.id);
        } else {
          // It's either already SENT or currently PROCESSING
          console.log(`Session ${session.id} is already ${existingLog?.status}. Skipping.`);
          return new Response("OK", { status: 200 });
        }
      } else {
        console.error("Failed to claim idempotency lock:", claimError);
        return new Response("Internal Server Error", { status: 500 });
      }
    }

    // 5. Server-side Email Resolution
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(session.user_id);
    
    if (userError || !userData || !userData.user || !userData.user.email) {
      console.error(`Failed to resolve email for user ${session.user_id}`);
      await supabase.from("login_notifications_log")
        .update({ status: "FAILED", last_error: "User email not found" })
        .eq("session_id", session.id);
      // Return 200 so webhook doesn't keep retrying an unresolvable user
      return new Response("OK", { status: 200 }); 
    }
    
    const userEmail = userData.user.email;

    // 6. Send Email via Brevo API
    const brevoApiKey = Deno.env.get("BREVO_API_KEY");
    const senderEmail = Deno.env.get("SENDER_EMAIL") || "no-reply@tomesphere.in";
    
    if (!brevoApiKey) {
      console.error("Configuration Error: Missing BREVO_API_KEY");
      await supabase.from("login_notifications_log")
        .update({ status: "FAILED", last_error: "Missing Brevo API Key" })
        .eq("session_id", session.id);
      return new Response("Internal Server Error", { status: 500 });
    }

    const signInTime = new Date(session.created_at).toLocaleString('en-US', { timeZone: 'UTC' }) + ' UTC';
    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #fafafa;">
        <div style="background-color: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 24px rgba(0,0,0,0.04); border: 1px solid #eaeaea;">
          
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="margin: 0; font-size: 24px; color: #111827; font-weight: 700; letter-spacing: -0.5px;">
              TomeSphere
            </h1>
          </div>
          
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="background-color: #eef2ff; color: #4f46e5; display: inline-block; padding: 12px 24px; border-radius: 999px; font-weight: 600; font-size: 14px; letter-spacing: 0.5px; text-transform: uppercase;">
              New Sign-in Detected
            </div>
          </div>
          
          <h2 style="color: #111827; font-size: 20px; font-weight: 600; margin-bottom: 16px; text-align: center;">
            Was this you?
          </h2>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin-bottom: 32px; text-align: center;">
            We noticed a new sign-in to your TomeSphere account. Here are the details of the session:
          </p>
          
          <div style="background-color: #f9fafb; border: 1px solid #f3f4f6; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
            <div style="margin-bottom: 16px;">
              <p style="margin: 0; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Time</p>
              <p style="margin: 4px 0 0 0; font-size: 15px; color: #111827; font-weight: 500;">${signInTime}</p>
            </div>
            ${session.user_agent ? `
            <div>
              <p style="margin: 0; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Device & Browser</p>
              <p style="margin: 4px 0 0 0; font-size: 15px; color: #111827; font-weight: 500; line-height: 1.4;">${session.user_agent}</p>
            </div>
            ` : ''}
          </div>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 22px; text-align: center; margin-bottom: 0;">
            If this was you, you can safely ignore this email.<br/><br/>
            If you don't recognize this activity, please <a href="https://tomesphere.in/security" style="color: #4f46e5; text-decoration: none; font-weight: 600;">secure your account</a> immediately.
          </p>
          
        </div>
        
        <div style="text-align: center; margin-top: 32px;">
          <p style="color: #9ca3af; font-size: 12px; line-height: 18px;">
            © ${new Date().getFullYear()} TomeSphere. All rights reserved.<br/>
            This is an automated security notification.
          </p>
        </div>
      </div>
    `;

    const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": brevoApiKey,
      },
      body: JSON.stringify({
        sender: { email: senderEmail, name: "TomeSphere Security" },
        to: [{ email: userEmail }],
        subject: "New sign-in to your TomeSphere account",
        htmlContent: htmlContent,
      }),
    });

    if (!brevoRes.ok) {
      const errText = await brevoRes.text();
      console.error(`Brevo API failed: ${errText}`);
      await supabase.from("login_notifications_log")
        .update({ status: "FAILED", last_error: `Brevo Error: ${brevoRes.status} - ${errText.substring(0, 100)}` })
        .eq("session_id", session.id);
      return new Response("Failed to send email via Brevo", { status: 500 }); // Retry via webhook
    }

    // 7. Mark Processed Successfully
    await supabase.from("login_notifications_log")
      .update({ status: "SENT", processed_at: new Date().toISOString() })
      .eq("session_id", session.id);

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    console.error("Unhandled Edge Function Error:", error);
    return new Response(`Bad Request: ${error.message}`, { status: 400 });
  }
});
