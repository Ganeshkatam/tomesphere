-- Create public storage bucket for user uploaded shelf images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'shelves',
  'shelves',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Policy: Anyone can view shelf cover images
DROP POLICY IF EXISTS "Shelf images are publicly accessible" ON storage.objects;
CREATE POLICY "Shelf images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'shelves');

-- Policy: Authenticated users can upload to shelves
DROP POLICY IF EXISTS "Authenticated users can upload to shelves" ON storage.objects;
CREATE POLICY "Authenticated users can upload to shelves"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'shelves');

-- Policy: Authenticated users can update shelf images
DROP POLICY IF EXISTS "Authenticated users can update shelves" ON storage.objects;
CREATE POLICY "Authenticated users can update shelves"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'shelves');

-- Policy: Authenticated users can delete shelf images
DROP POLICY IF EXISTS "Authenticated users can delete shelves" ON storage.objects;
CREATE POLICY "Authenticated users can delete shelves"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'shelves');
