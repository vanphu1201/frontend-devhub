-- SQL script to update blog_posts and series with status column and RLS policies

-- 1. Add status column to blog_posts if not exists
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='blog_posts' AND column_name='status') THEN
        ALTER TABLE public.blog_posts ADD COLUMN status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));
    END IF;
END $$;

-- 2. Add status column to series if not exists
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='series' AND column_name='status') THEN
        ALTER TABLE public.series ADD COLUMN status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));
    END IF;
END $$;

-- 3. Update RLS policies for blog_posts
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published blog posts are viewable by everyone" ON public.blog_posts;
DROP POLICY IF EXISTS "Approved or own blog posts are viewable" ON public.blog_posts;
CREATE POLICY "Approved or own blog posts are viewable"
ON public.blog_posts FOR SELECT
USING (
  (is_published = true AND status = 'approved') OR 
  (auth.uid() = user_id)
);

-- 4. Update RLS policies for series
ALTER TABLE public.series ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Series are viewable by everyone" ON public.series;
DROP POLICY IF EXISTS "Approved or own series are viewable" ON public.series;
CREATE POLICY "Approved or own series are viewable"
ON public.series FOR SELECT
USING (
  (status = 'approved') OR 
  (auth.uid() = user_id)
);

DROP POLICY IF EXISTS "Users can create their own series" ON public.series;
CREATE POLICY "Users can create their own series"
ON public.series FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own series" ON public.series;
CREATE POLICY "Users can update their own series"
ON public.series FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own series" ON public.series;
CREATE POLICY "Users can delete their own series"
ON public.series FOR DELETE
USING (auth.uid() = user_id);

-- 5. Admin specific policies
DROP POLICY IF EXISTS "Admins can manage all blog posts" ON public.blog_posts;
CREATE POLICY "Admins can manage all blog posts"
ON public.blog_posts
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

DROP POLICY IF EXISTS "Admins can manage all series" ON public.series;
CREATE POLICY "Admins can manage all series"
ON public.series
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
