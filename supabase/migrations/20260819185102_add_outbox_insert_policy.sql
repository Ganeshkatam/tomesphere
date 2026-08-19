-- Drop existing policy if it exists to avoid conflicts
DROP POLICY IF EXISTS authenticated_outbox_insert ON outbox_events;

GRANT INSERT ON outbox_events TO authenticated;

CREATE POLICY "authenticated_outbox_insert" ON outbox_events
  FOR INSERT TO authenticated WITH CHECK (true);
