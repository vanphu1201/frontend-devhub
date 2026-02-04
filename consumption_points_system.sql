-- Consumption Points System Implementation

-- 1. Add consumption_points column to profiles if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='consumption_points') THEN
        ALTER TABLE public.profiles ADD COLUMN consumption_points INTEGER DEFAULT 0;
    END IF;
END $$;

-- 2. Update existing reputation triggers to also add consumption points
-- Note: We are using the same logic as reputation for adding points.

-- Function for follow stats with consumption points
CREATE OR REPLACE FUNCTION public.handle_follow_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.profiles SET 
            followers_count = followers_count + 1,
            reputation = reputation + 50,
            consumption_points = consumption_points + 50
        WHERE id = NEW.following_id;
        
        UPDATE public.profiles SET 
            following_count = following_count + 1
        WHERE id = NEW.follower_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.profiles SET 
            followers_count = GREATEST(0, followers_count - 1),
            reputation = GREATEST(0, reputation - 50),
            consumption_points = GREATEST(0, consumption_points - 50)
        WHERE id = OLD.following_id;
        
        UPDATE public.profiles SET 
            following_count = GREATEST(0, following_count - 1)
        WHERE id = OLD.follower_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function for reputation and consumption points impact from likes/reviews
CREATE OR REPLACE FUNCTION public.handle_reputation_impact()
RETURNS TRIGGER AS $$
DECLARE
    v_target_user_id UUID;
    v_points_change INTEGER := 0;
BEGIN
    IF (TG_TABLE_NAME = 'post_likes') THEN
        SELECT user_id INTO v_target_user_id FROM public.posts WHERE id = COALESCE(NEW.post_id, OLD.post_id);
        v_points_change := 10;
    ELSIF (TG_TABLE_NAME = 'blog_post_likes') THEN
        SELECT user_id INTO v_target_user_id FROM public.blog_posts WHERE id = COALESCE(NEW.blog_post_id, OLD.blog_post_id);
        v_points_change := 20;
    ELSIF (TG_TABLE_NAME = 'product_reviews') THEN
        SELECT user_id INTO v_target_user_id FROM public.products WHERE id = COALESCE(NEW.product_id, OLD.product_id);
        v_points_change := CASE 
            WHEN COALESCE(NEW.rating, OLD.rating, 0) >= 5 THEN 100
            WHEN COALESCE(NEW.rating, OLD.rating, 0) = 4 THEN 50
            WHEN COALESCE(NEW.rating, OLD.rating, 0) <= 2 AND COALESCE(NEW.rating, OLD.rating, 0) > 0 THEN -50
            ELSE 0 
        END;
    END IF;

    IF v_target_user_id IS NOT NULL THEN
        IF (TG_OP = 'INSERT') THEN
            UPDATE public.profiles SET 
                reputation = reputation + v_points_change,
                consumption_points = consumption_points + v_points_change
            WHERE id = v_target_user_id;
        ELSIF (TG_OP = 'DELETE') THEN
            UPDATE public.profiles SET 
                reputation = GREATEST(0, reputation - v_points_change),
                consumption_points = GREATEST(0, consumption_points - v_points_change)
            WHERE id = v_target_user_id;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function for reputation and consumption points from creation
CREATE OR REPLACE FUNCTION public.handle_creation_reputation()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_TABLE_NAME = 'posts' AND TG_OP = 'INSERT') THEN
        UPDATE public.profiles SET 
            reputation = reputation + 5,
            consumption_points = consumption_points + 5
        WHERE id = NEW.user_id;
    ELSIF (TG_TABLE_NAME = 'blog_posts' AND NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved')) THEN
        UPDATE public.profiles SET 
            reputation = reputation + 50,
            consumption_points = consumption_points + 50
        WHERE id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger applications for Consumption Points
-- Follows
DROP TRIGGER IF EXISTS on_follow_consumption_points ON public.follows;
CREATE TRIGGER on_follow_consumption_points
AFTER INSERT OR DELETE ON public.follows
FOR EACH ROW EXECUTE FUNCTION public.handle_follow_stats();

-- Likes (Social Posts)
DROP TRIGGER IF EXISTS on_post_like_consumption_points ON public.post_likes;
CREATE TRIGGER on_post_like_consumption_points
AFTER INSERT OR DELETE ON public.post_likes
FOR EACH ROW EXECUTE FUNCTION public.handle_reputation_impact();

-- Likes (Blog Posts)
DROP TRIGGER IF EXISTS on_blog_post_like_consumption_points ON public.blog_post_likes;
CREATE TRIGGER on_blog_post_like_consumption_points
AFTER INSERT OR DELETE ON public.blog_post_likes
FOR EACH ROW EXECUTE FUNCTION public.handle_reputation_impact();

-- Reviews
DROP TRIGGER IF EXISTS on_product_review_consumption_points ON public.product_reviews;
CREATE TRIGGER on_product_review_consumption_points
AFTER INSERT OR DELETE ON public.product_reviews
FOR EACH ROW EXECUTE FUNCTION public.handle_reputation_impact();

-- Creation (Social Posts)
DROP TRIGGER IF EXISTS on_post_creation_consumption_points ON public.posts;
CREATE TRIGGER on_post_creation_consumption_points
AFTER INSERT ON public.posts
FOR EACH ROW EXECUTE FUNCTION public.handle_creation_reputation();

-- Creation (Blog Posts - only when approved)
DROP TRIGGER IF EXISTS on_blog_post_creation_consumption_points ON public.blog_posts;
CREATE TRIGGER on_blog_post_creation_consumption_points
AFTER UPDATE OF status ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION public.handle_creation_reputation();

-- 3. Purchases/Unlocks Table
CREATE TABLE IF NOT EXISTS public.resource_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE NOT NULL,
    points_paid INTEGER NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, resource_id)
);

-- RLS for resource_purchases
ALTER TABLE public.resource_purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own purchases" ON public.resource_purchases;
CREATE POLICY "Users can view their own purchases"
ON public.resource_purchases FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own purchases via function" ON public.resource_purchases;
CREATE POLICY "Users can insert their own purchases via function"
ON public.resource_purchases FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 4. Function to unlock resource with points
CREATE OR REPLACE FUNCTION public.unlock_resource_with_points(p_resource_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_points_required INTEGER;
    v_user_points INTEGER;
    v_resource_title TEXT;
BEGIN
    -- Check if user is authenticated
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Not authenticated');
    END IF;

    -- Get resource details
    SELECT title, points_price INTO v_resource_title, v_points_required
    FROM public.resources
    WHERE id = p_resource_id AND is_premium = true;

    IF v_resource_title IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Resource not found or not premium');
    END IF;

    -- Check if already unlocked
    IF EXISTS (SELECT 1 FROM public.resource_purchases WHERE user_id = v_user_id AND resource_id = p_resource_id) THEN
        RETURN jsonb_build_object('success', true, 'message', 'Resource already unlocked');
    END IF;

    -- Get user points
    SELECT consumption_points INTO v_user_points
    FROM public.profiles
    WHERE id = v_user_id;

    -- Validate points
    IF v_user_points < v_points_required THEN
        RETURN jsonb_build_object('success', false, 'message', 'Insufficient consumption points');
    END IF;

    -- Deduct points and record purchase
    UPDATE public.profiles 
    SET consumption_points = consumption_points - v_points_required
    WHERE id = v_user_id;

    INSERT INTO public.resource_purchases (user_id, resource_id, points_paid)
    VALUES (v_user_id, p_resource_id, v_points_required);

    RETURN jsonb_build_object('success', true, 'message', 'Resource unlocked successfully', 'title', v_resource_title);
END;
$$;
