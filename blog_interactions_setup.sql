-- SQL script để thêm tính năng tương tác cho Blog (Likes, Comments, Bookmarks)

-- 1. Thêm blog_post_id vào bảng bookmarks (nếu chưa có)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookmarks' AND column_name='blog_post_id') THEN
        ALTER TABLE public.bookmarks ADD COLUMN blog_post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE;
        
        -- Cập nhật constraint
        ALTER TABLE public.bookmarks DROP CONSTRAINT IF EXISTS bookmark_target;
        ALTER TABLE public.bookmarks ADD CONSTRAINT bookmark_target CHECK (
            (post_id IS NOT NULL AND product_id IS NULL AND blog_post_id IS NULL) OR
            (post_id IS NULL AND product_id IS NOT NULL AND blog_post_id IS NULL) OR
            (post_id IS NULL AND product_id IS NULL AND blog_post_id IS NOT NULL)
        );
    END IF;
END $$;

-- 2. Tạo bảng blog_post_likes
CREATE TABLE IF NOT EXISTS public.blog_post_likes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    blog_post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(blog_post_id, user_id)
);

ALTER TABLE public.blog_post_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Blog likes are viewable by everyone" ON public.blog_post_likes;
CREATE POLICY "Blog likes are viewable by everyone" ON public.blog_post_likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can like blog posts" ON public.blog_post_likes;
CREATE POLICY "Users can like blog posts" ON public.blog_post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can unlike blog posts" ON public.blog_post_likes;
CREATE POLICY "Users can unlike blog posts" ON public.blog_post_likes FOR DELETE USING (auth.uid() = user_id);

-- 3. Tạo bảng blog_post_comments
CREATE TABLE IF NOT EXISTS public.blog_post_comments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    blog_post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    parent_id UUID REFERENCES public.blog_post_comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.blog_post_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Blog comments are viewable by everyone" ON public.blog_post_comments;
CREATE POLICY "Blog comments are viewable by everyone" ON public.blog_post_comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can comment on blog posts" ON public.blog_post_comments;
CREATE POLICY "Users can comment on blog posts" ON public.blog_post_comments FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own blog comments" ON public.blog_post_comments;
CREATE POLICY "Users can update their own blog comments" ON public.blog_post_comments FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own blog comments" ON public.blog_post_comments;
CREATE POLICY "Users can delete their own blog comments" ON public.blog_post_comments FOR DELETE USING (auth.uid() = user_id);

-- 4. Thêm shares_count vào blog_posts (nếu chưa có)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='blog_posts' AND column_name='shares_count') THEN
        ALTER TABLE public.blog_posts ADD COLUMN shares_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- 5. Tạo bảng blog_post_comment_likes
CREATE TABLE IF NOT EXISTS public.blog_post_comment_likes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    comment_id UUID NOT NULL REFERENCES public.blog_post_comments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(comment_id, user_id)
);

ALTER TABLE public.blog_post_comment_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Blog comment likes are viewable by everyone" ON public.blog_post_comment_likes;
CREATE POLICY "Blog comment likes are viewable by everyone" ON public.blog_post_comment_likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can like blog comments" ON public.blog_post_comment_likes;
CREATE POLICY "Users can like blog comments" ON public.blog_post_comment_likes FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can unlike blog comments" ON public.blog_post_comment_likes;
CREATE POLICY "Users can unlike blog comments" ON public.blog_post_comment_likes FOR DELETE USING (auth.uid() = user_id);
