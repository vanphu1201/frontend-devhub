-- SQL script to automate Reputation, Followers, and Following counts

-- 1. Create Follow Statistics Trigger
CREATE OR REPLACE FUNCTION public.handle_follow_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        -- Increase following_count for the follower
        UPDATE public.profiles 
        SET following_count = following_count + 1 
        WHERE id = NEW.follower_id;
        
        -- Increase followers_count for the followed user
        -- AND award 50 Reputation points
        UPDATE public.profiles 
        SET followers_count = followers_count + 1,
            reputation = reputation + 50
        WHERE id = NEW.following_id;
        
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        -- Decrease following_count for the follower
        UPDATE public.profiles 
        SET following_count = GREATEST(0, following_count - 1)
        WHERE id = OLD.follower_id;
        
        -- Decrease followers_count for the followed user
        -- AND deduct 50 Reputation points
        UPDATE public.profiles 
        SET followers_count = GREATEST(0, followers_count - 1),
            reputation = GREATEST(0, reputation - 50)
        WHERE id = OLD.following_id;
        
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_follow_change ON public.follows;
CREATE TRIGGER on_follow_change
AFTER INSERT OR DELETE ON public.follows
FOR EACH ROW EXECUTE FUNCTION public.handle_follow_stats();


-- 2. Create Reputation Trigger for Content Interactions (Likes)
CREATE OR REPLACE FUNCTION public.handle_reputation_impact()
RETURNS TRIGGER AS $$
DECLARE
    target_user_id UUID;
    points INTEGER;
BEGIN
    -- Determine target user and point value
    IF (TG_TABLE_NAME = 'post_likes') THEN
        SELECT user_id INTO target_user_id FROM public.posts WHERE id = COALESCE(NEW.post_id, OLD.post_id);
        points := 10;
    ELSIF (TG_TABLE_NAME = 'blog_post_likes') THEN
        SELECT user_id INTO target_user_id FROM public.blog_posts WHERE id = COALESCE(NEW.blog_post_id, OLD.blog_post_id);
        points := 20;
    ELSIF (TG_TABLE_NAME = 'product_reviews') THEN
        target_user_id := (SELECT user_id FROM public.products WHERE id = COALESCE(NEW.product_id, OLD.product_id));
        -- Points based on rating: 5 stars = 100, 4 stars = 50, 1-2 stars = -50
        points := CASE 
            WHEN COALESCE(NEW.rating, 0) >= 5 THEN 100
            WHEN COALESCE(NEW.rating, 0) = 4 THEN 50
            WHEN COALESCE(NEW.rating, 0) <= 2 AND COALESCE(NEW.rating, 0) > 0 THEN -50
            ELSE 0 
        END;
        
        -- For deletions, we reverse the NEW points if we had them, 
        -- but simpler is to check TG_OP
    END IF;

    IF (target_user_id IS NOT NULL) THEN
        IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
            UPDATE public.profiles SET reputation = reputation + points WHERE id = target_user_id;
        ELSIF (TG_OP = 'DELETE') THEN
            -- Reverse the points
            -- For product reviews, we'd need to calculate the OLD points
            IF (TG_TABLE_NAME = 'product_reviews') THEN
                points := CASE 
                    WHEN OLD.rating >= 5 THEN 100
                    WHEN OLD.rating = 4 THEN 50
                    WHEN OLD.rating <= 2 THEN -50
                    ELSE 0 
                END;
            END IF;
            UPDATE public.profiles SET reputation = GREATEST(0, reputation - points) WHERE id = target_user_id;
        END IF;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Post Likes Trigger
DROP TRIGGER IF EXISTS on_post_like_reputation ON public.post_likes;
CREATE TRIGGER on_post_like_reputation
AFTER INSERT OR DELETE ON public.post_likes
FOR EACH ROW EXECUTE FUNCTION public.handle_reputation_impact();

-- Blog Post Likes Trigger
DROP TRIGGER IF EXISTS on_blog_like_reputation ON public.blog_post_likes;
CREATE TRIGGER on_blog_like_reputation
AFTER INSERT OR DELETE ON public.blog_post_likes
FOR EACH ROW EXECUTE FUNCTION public.handle_reputation_impact();

-- Product Reviews Trigger
DROP TRIGGER IF EXISTS on_product_review_reputation ON public.product_reviews;
CREATE TRIGGER on_product_review_reputation
AFTER INSERT OR UPDATE OR DELETE ON public.product_reviews
FOR EACH ROW EXECUTE FUNCTION public.handle_reputation_impact();


-- 3. Create Reputation Trigger for Content Creation
CREATE OR REPLACE FUNCTION public.handle_creation_reputation()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        IF (TG_TABLE_NAME = 'posts') THEN
            UPDATE public.profiles SET reputation = reputation + 5 WHERE id = NEW.user_id;
        ELSIF (TG_TABLE_NAME = 'blog_posts' AND NEW.status = 'approved') THEN
            UPDATE public.profiles SET reputation = reputation + 50 WHERE id = NEW.user_id;
        END IF;
    ELSIF (TG_OP = 'UPDATE') THEN
        -- Award points for blog post approval
        IF (TG_TABLE_NAME = 'blog_posts' AND OLD.status != 'approved' AND NEW.status = 'approved') THEN
            UPDATE public.profiles SET reputation = reputation + 50 WHERE id = NEW.user_id;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Posts Creation Trigger
DROP TRIGGER IF EXISTS on_post_creation_reputation ON public.posts;
CREATE TRIGGER on_post_creation_reputation
AFTER INSERT ON public.posts
FOR EACH ROW EXECUTE FUNCTION public.handle_creation_reputation();

-- Blog Posts Approval Trigger
DROP TRIGGER IF EXISTS on_blog_post_approval_reputation ON public.blog_posts;
CREATE TRIGGER on_blog_post_approval_reputation
AFTER INSERT OR UPDATE ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION public.handle_creation_reputation();

-- 4. Sync existing counts (One-time cleanup)
UPDATE public.profiles p
SET 
    followers_count = (SELECT count(*) FROM public.follows f WHERE f.following_id = p.id),
    following_count = (SELECT count(*) FROM public.follows f WHERE f.follower_id = p.id);
