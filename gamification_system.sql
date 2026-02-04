-- SQL script to automate Badge Awarding

-- 1. Function to award badges based on reputation
CREATE OR REPLACE FUNCTION public.check_reputation_badges()
RETURNS TRIGGER AS $$
DECLARE
    badge_record RECORD;
BEGIN
    -- For each badge that has a points_required threshold
    FOR badge_record IN 
        SELECT id, name, points_required 
        FROM public.badges 
        WHERE points_required > 0
    LOOP
        -- If user reached the threshold, award the badge
        IF NEW.reputation >= badge_record.points_required THEN
            INSERT INTO public.user_badges (user_id, badge_id)
            VALUES (NEW.id, badge_record.id)
            ON CONFLICT (user_id, badge_id) DO NOTHING;
        END IF;
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on profile reputation change
DROP TRIGGER IF EXISTS on_reputation_badge_check ON public.profiles;
CREATE TRIGGER on_reputation_badge_check
AFTER UPDATE OF reputation ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.check_reputation_badges();


-- 2. Function to award 'First Post' and other activity-based badges
CREATE OR REPLACE FUNCTION public.award_activity_badges()
RETURNS TRIGGER AS $$
DECLARE
    v_badge_id UUID;
    v_post_count INTEGER;
BEGIN
    -- Award 'First Post' badge
    IF (TG_OP = 'INSERT') THEN
        SELECT id INTO v_badge_id FROM public.badges WHERE name = 'First Post';
        
        IF (v_badge_id IS NOT NULL) THEN
            INSERT INTO public.user_badges (user_id, badge_id)
            VALUES (NEW.user_id, v_badge_id)
            ON CONFLICT (user_id, badge_id) DO NOTHING;
        END IF;

        -- Check for '100 Posts' badge (if it exists as a count threshold)
        -- Note: The existing '100 Posts' badge has points_required = 100 in the migration,
        -- likely meaning reputation 100. If we want it to be 100 POSTS, we'd check count.
        -- For now, let's stick to the points_required logic in check_reputation_badges.
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on new post
DROP TRIGGER IF EXISTS on_post_activity_badge ON public.posts;
CREATE TRIGGER on_post_activity_badge
AFTER INSERT ON public.posts
FOR EACH ROW EXECUTE FUNCTION public.award_activity_badges();

-- Trigger on new blog post
DROP TRIGGER IF EXISTS on_blog_post_activity_badge ON public.blog_posts;
CREATE TRIGGER on_blog_post_activity_badge
AFTER INSERT ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION public.award_activity_badges();


-- 3. Retroactively award badges for existing reputation
DO $$
DECLARE
    user_record RECORD;
BEGIN
    FOR user_record IN SELECT id, reputation FROM public.profiles LOOP
        -- For each user, check all badges
        INSERT INTO public.user_badges (user_id, badge_id)
        SELECT user_record.id, id
        FROM public.badges
        WHERE points_required > 0 AND user_record.reputation >= points_required
        ON CONFLICT (user_id, badge_id) DO NOTHING;
    END LOOP;
END $$;
