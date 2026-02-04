-- Admin Price Controls & Access Enforcement

-- 1. Add points_price to resources
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='resources' AND column_name='points_price') THEN
        ALTER TABLE public.resources ADD COLUMN points_price INTEGER DEFAULT 0;
    END IF;
END $$;

-- 2. Update unlock_resource_with_points to use points_price
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

    INSERT INTO public.resource_purchases (user_id, resource_id, points_paid, payment_type)
    VALUES (v_user_id, p_resource_id, v_points_required, 'points');

    RETURN jsonb_build_object('success', true, 'message', 'Resource unlocked successfully', 'title', v_resource_title);
END;
$$;

-- 3. Update resource_purchases table structure if needed
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='resource_purchases' AND column_name='payment_type') THEN
        ALTER TABLE public.resource_purchases ADD COLUMN payment_type TEXT DEFAULT 'points';
        ALTER TABLE public.resource_purchases ADD COLUMN money_paid INTEGER DEFAULT 0;
    END IF;
END $$;
