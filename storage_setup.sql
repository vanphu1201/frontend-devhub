-- Create the bucket for avatars and cover images
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Unique policy names for avatars bucket
-- Policy to allow anyone to read files in the avatars bucket
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Avatars Public Access" ON storage.objects;

CREATE POLICY "Avatars Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

-- Policy to allow users to upload their own files
DROP POLICY IF EXISTS "Users can upload their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar files" ON storage.objects;

CREATE POLICY "Users can upload their own avatar files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] IN ('avatars', 'covers') AND
  (storage.foldername(name))[2] LIKE auth.uid()::text || '%'
);

-- Policy to allow users to update their own files
DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar files" ON storage.objects;

CREATE POLICY "Users can update their own avatar files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[2] LIKE auth.uid()::text || '%'
);

-- Policy to allow users to delete their own files
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar files" ON storage.objects;

CREATE POLICY "Users can delete their own avatar files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[2] LIKE auth.uid()::text || '%'
);
