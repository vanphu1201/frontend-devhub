-- Add cover_url to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cover_url TEXT;

-- Create series table if it doesn't exist (it should, but just in case)
CREATE TABLE IF NOT EXISTS public.series (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on series if not already
ALTER TABLE public.series ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'series' AND policyname = 'Series are viewable by everyone'
    ) THEN
        CREATE POLICY "Series are viewable by everyone" ON public.series FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'series' AND policyname = 'Users can create series'
    ) THEN
        CREATE POLICY "Users can create series" ON public.series FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'series' AND policyname = 'Users can update their own series'
    ) THEN
        CREATE POLICY "Users can update their own series" ON public.series FOR UPDATE USING (auth.uid() = user_id);
    END IF;
END $$;
