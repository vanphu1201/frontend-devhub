-- Ensure profiles has is_admin column for support policies
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'is_admin') THEN
    ALTER TABLE public.profiles ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- Create product_reviews table
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(product_id, user_id)
);

-- Enable RLS for product_reviews
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- product_reviews policies
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.product_reviews;
CREATE POLICY "Reviews are viewable by everyone" ON public.product_reviews
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create reviews for products they own" ON public.product_reviews;
CREATE POLICY "Users can create reviews for products they own" ON public.product_reviews
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND 
    EXISTS (
      SELECT 1 FROM public.purchases 
      WHERE user_id = auth.uid() AND product_id = product_reviews.product_id
    )
  );

DROP POLICY IF EXISTS "Users can edit their own reviews" ON public.product_reviews;
CREATE POLICY "Users can edit their own reviews" ON public.product_reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Update tickets/ticket_messages for RLS
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;

-- tickets policies
DROP POLICY IF EXISTS "Users can view their own tickets" ON public.tickets;
CREATE POLICY "Users can view their own tickets" ON public.tickets
  FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

DROP POLICY IF EXISTS "Users can create their own tickets" ON public.tickets;
CREATE POLICY "Users can create their own tickets" ON public.tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ticket_messages policies
DROP POLICY IF EXISTS "Users can view messages of their own tickets" ON public.ticket_messages;
CREATE POLICY "Users can view messages of their own tickets" ON public.ticket_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tickets 
      WHERE id = ticket_messages.ticket_id AND (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true))
    )
  );

DROP POLICY IF EXISTS "Users can send messages to their own tickets" ON public.ticket_messages;
CREATE POLICY "Users can send messages to their own tickets" ON public.ticket_messages
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.tickets 
      WHERE id = ticket_messages.ticket_id AND (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true))
    )
  );

-- Add missing columns if they don't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ticket_messages' AND column_name = 'is_staff_reply') THEN
    ALTER TABLE public.ticket_messages ADD COLUMN is_staff_reply BOOLEAN DEFAULT FALSE;
  END IF;
  
  -- Add stats columns to products if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'reviews_count') THEN
    ALTER TABLE public.products ADD COLUMN reviews_count INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'rating_avg') THEN
    ALTER TABLE public.products ADD COLUMN rating_avg DECIMAL DEFAULT 0;
  END IF;
END $$;
