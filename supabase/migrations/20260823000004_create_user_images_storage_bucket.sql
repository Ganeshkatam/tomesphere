-- Create public storage bucket for user uploaded images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'user-images',
  'user-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Policy: Anyone can view user images
DROP POLICY IF EXISTS "User images are publicly accessible" ON storage.objects;
CREATE POLICY "User images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'user-images');

-- Policy: Authenticated users can upload to user-images
DROP POLICY IF EXISTS "Authenticated users can upload to user-images" ON storage.objects;
CREATE POLICY "Authenticated users can upload to user-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'user-images');

-- Policy: Users can update their own uploads
DROP POLICY IF EXISTS "Authenticated users can update user-images" ON storage.objects;
CREATE POLICY "Authenticated users can update user-images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'user-images');

-- Policy: Users can delete their own uploads
DROP POLICY IF EXISTS "Authenticated users can delete user-images" ON storage.objects;
CREATE POLICY "Authenticated users can delete user-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'user-images');
