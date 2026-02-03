-- Add image_url and image_size columns to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS image_size TEXT DEFAULT 'full';

-- Add image_url and image_size columns to comments table
ALTER TABLE comments ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS image_size TEXT DEFAULT 'full';
