-- Create the bucket for community posts and comments images
INSERT INTO storage.buckets (id, name, public)
VALUES ('posts', 'posts', true)
ON CONFLICT (id) DO NOTHING;

-- Unique policy names to avoid conflicts with other buckets
-- Policy to allow anyone to read files in the posts bucket
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Posts Public Access" ON storage.objects;

CREATE POLICY "Posts Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'posts' );

-- Policy to allow users to upload their own files
DROP POLICY IF EXISTS "Users can upload their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own post files" ON storage.objects;

CREATE POLICY "Users can upload their own post files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'posts' AND
  (storage.foldername(name))[1] IN ('posts', 'comments') AND
  (storage.foldername(name))[2] = auth.uid()::text
);

-- Policy to allow users to update their own files
DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own post files" ON storage.objects;

CREATE POLICY "Users can update their own post files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'posts' AND
  (storage.foldername(name))[2] = auth.uid()::text
);

-- Policy to allow users to delete their own files
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own post files" ON storage.objects;

CREATE POLICY "Users can delete their own post files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'posts' AND
  (storage.foldername(name))[2] = auth.uid()::text
);
