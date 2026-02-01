-- SQL script to add more detailed columns to series table
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='series' AND column_name='category') THEN
        ALTER TABLE public.series ADD COLUMN category TEXT DEFAULT 'general';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='series' AND column_name='difficulty') THEN
        ALTER TABLE public.series ADD COLUMN difficulty TEXT DEFAULT 'beginner';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='series' AND column_name='target_audience') THEN
        ALTER TABLE public.series ADD COLUMN target_audience TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='series' AND column_name='estimated_duration') THEN
        ALTER TABLE public.series ADD COLUMN estimated_duration TEXT;
    END IF;
END $$;
