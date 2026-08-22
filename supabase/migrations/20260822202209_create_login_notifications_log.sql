-- Create the idempotency log for login notification webhooks
create table public.login_notifications_log (
  session_id uuid primary key,
  user_id uuid not null,
  status text not null,
  attempts integer not null default 0,
  created_at timestamptz not null default now(),
  processed_at timestamptz,
  last_error text,
  
  constraint login_notifications_log_status_check check (status in ('PROCESSING', 'SENT', 'FAILED')),
  constraint login_notifications_log_attempts_check check (attempts >= 0)
);

-- Enable RLS and do not create any public policies (only accessible via service_role)
alter table public.login_notifications_log enable row level security;
