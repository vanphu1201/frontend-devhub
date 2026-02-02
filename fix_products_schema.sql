-- Run this in your Supabase SQL Editor to fix the schema mismatch

ALTER TABLE products ADD COLUMN IF NOT EXISTS download_url TEXT;

-- Ensuring all recently added fields are present
ALTER TABLE products ADD COLUMN IF NOT EXISTS version TEXT DEFAULT '1.0.0';
ALTER TABLE products ADD COLUMN IF NOT EXISTS support_duration TEXT DEFAULT '6 tháng';
ALTER TABLE products ADD COLUMN IF NOT EXISTS long_description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

-- Optional: Refresh the schema cache
-- NOTIFY pgrst, 'reload schema';
